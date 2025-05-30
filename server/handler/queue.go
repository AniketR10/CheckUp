package handler

import (
	"context"
	"time"

	"github.com/AniketR10/CheckUp/model"
	"github.com/AniketR10/CheckUp/storage"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/pusher/pusher-http-go/v5"
)

type QueueHandler struct {
	storage *storage.QueueStorage
	pusher *pusher.Client
}

func (h *QueueHandler) GetQueue(ctx *fiber.Ctx) error {
	contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	queue, err := h.storage.GetQueue(contxt)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	return ctx.Status(fiber.StatusOK).JSON(queue)

}

	func (h *QueueHandler) PostToQueue(ctx *fiber.Ctx) error {
		contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	    defer cancel()

		newPatient := &model.QueueEntry{}

		if err := ctx.BodyParser(newPatient); err != nil {
			return ctx.SendStatus(fiber.StatusUnprocessableEntity)
		}

		if err := validator.New().Struct(newPatient); err != nil {
			return ctx.SendStatus(fiber.StatusBadRequest)
		}

		 number, err := h.storage.PushToQueue(contxt, newPatient) 
		if err != nil {
			return ctx.SendStatus(fiber.StatusBadRequest)
		}

		h.pusher.Trigger("live-queue", "patient-in", number)

		return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
			"number": number,
			"assignedLabel": newPatient.AssignedLabel,
		})

	}

func (h *QueueHandler) RemoveFromQueue(ctx *fiber.Ctx) error {
		contxt, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	    defer cancel()
	
		patientNumber, _ := ctx.ParamsInt("patientNumber")
		if err := h.storage.RemoveFromQueue(contxt,patientNumber); err != nil {
			return ctx.SendStatus(fiber.StatusBadRequest)
		}

			h.pusher.Trigger("live-queue", "patient-out", patientNumber)
		return ctx.SendStatus(fiber.StatusOK)

}

func InitQueueHandler(router fiber.Router, store *storage.QueueStorage, pusher *pusher.Client) {
      handler := &QueueHandler{
		storage: store,
		pusher: pusher,
	  }

	  router.Get("/",handler.GetQueue)
	  router.Post("/new-patient",handler.PostToQueue)
	  router.Delete("/:patientNumber", handler.RemoveFromQueue)

}