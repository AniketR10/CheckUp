package main

import (
	
	"log"
	"github.com/joho/godotenv"
	"github.com/caarlos0/env/v11"
)


type Env struct {
	PORT string `env:"PORT,required"`
	MONGO_URI string `env:"MONGO_URI,required"`
	MONGO_DATABASE string `env:"MONGO_DATABASE,required"`
	
	PUSHER_APP_ID string `env: "PUSHER_APP_ID,required"`
    PUSHER_KEY string `env: "PUSHER_KEY,required"`
    PUSHER_SECRET string `env: "PUSHER_SECRET,required"`
    PUSHER_SECURE bool `env: "PUSHER_SECURE,required"`
	PUSHER_CLUSTER string `env: "PUSHER_CLUSTER,required"`
}

func EnvConfig() *Env {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Could not load the .env file: %e", err)
	}

	envConfig := &Env{}
	
	if err := env.Parse(envConfig); err != nil {
		log.Fatalf("Could not parse the environment variables: %e", err)
	}

	return envConfig

}