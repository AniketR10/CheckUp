package main

import (
	"fmt"

	"github.com/AniketR10/CheckUp/handler"
	"github.com/AniketR10/CheckUp/storage"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	
)
func main(){
	env := EnvConfig()
	db := DBConnection(env)
	pusher := Pusher(env)

	server := fiber.New(fiber.Config{
		AppName: "Emergency-Queue",
		ServerHeader: "Fiber V2",
	})

	server.Use(cors.New(cors.Config{AllowOrigins:"*"}))

	//triage storage interactions
	triageStorage := storage.InitTriageStorage(db)
	queueStorage := storage.InitQueueStorage(db)

	//triage handlers
	handler.InitTriageHandler(server.Group("/triage"),triageStorage)	
	handler.InitQueueHandler(server.Group("/queue"), queueStorage, pusher)

	server.Listen(fmt.Sprintf(":" + env.PORT)) // server starts to listen to the port
	
}