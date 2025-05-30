package handler

import (
	"context"
	"time"

	"github.com/AniketR10/CheckUp/model"
	"github.com/AniketR10/CheckUp/storage"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type TriageHandler struct {
	storage *storage.TriageStorage
}

func (h *TriageHandler) Get(ctx *fiber.Ctx)	error {
	contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	TNodes, ONodes, Edges, err := h.storage.Get(contxt)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	nodes := model.MergeNodes(TNodes, ONodes)

	 return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"nodes":nodes,
		"edges":Edges,
	})

}

func (h *TriageHandler) GetTriageDecisionTree(ctx *fiber.Ctx) error {
	contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	TNodes, ONodes, Edges, err := h.storage.Get(contxt)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	nextStepID := ctx.Query("nextStepId","")
	currNodeStep := &model.TriageNode{}
	var step string //ques that the user will see
	options := []map[string]string{} // key and value both are strings

	for _, node := range TNodes {
		if(nextStepID == "" && node.Data.IsRoot) || node.Id == nextStepID {
			currNodeStep = node
			step = node.Data.Value
			break
		}
	}

	for _, Onode := range ONodes {
		if Onode.ParentId == currNodeStep.Id {
			option := make(map[string]string)
			option["value"] =  Onode.Data.Value

			for _, edge := range Edges {
		    if edge.Source == Onode.Id {
				for _,node := range TNodes {
					if node.Id == edge.Target {
						if node.Data.StepType == "label" {
							option["assignedLabel"] = node.Data.AssignedLabel 
						} else {
							option["nextStep"] = node.Id 
						}
						break
					}
				}
				break
			}
	      }
			options = append(options, option)
		}
		
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"step":step,
		"options":options,
	})

}

func (h *TriageHandler) Post(ctx *fiber.Ctx) error {
	contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	var body struct {
		TNodes []*model.TriageNode `json:"nodes" validate:"required"`
		ONodes []*model.TriageOptionNode `json:"optionNodes" validate:"required"`
		Edges []*model.Edge `json:"edges" validate:"required"`
	}

	if err := ctx.BodyParser(&body); err != nil {

		return ctx.SendStatus(fiber.StatusUnprocessableEntity)
	}

	if err := validator.New().Struct(&body); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	if err := h.storage.Post(contxt, body.TNodes, body.ONodes, body.Edges); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	return ctx.SendStatus(fiber.StatusOK)
	
}

func InitTriageHandler(router fiber.Router, store *storage.TriageStorage) {
		handler := &TriageHandler{
			storage: store,
		}

		router.Get("/",handler.Get)
		router.Post("/",handler.Post)
		router.Get("/decision-tree", handler.GetTriageDecisionTree)
}		
