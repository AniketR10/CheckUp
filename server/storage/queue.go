package storage

import (
	"context"
	"slices"

	"github.com/AniketR10/CheckUp/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type QueueStorage struct {
	db *mongo.Database
}

var priorityMap = map[string]int{
	"Emergency" : 1,
	"Delayed" : 2,
	"Minor" : 3,
}

func (qs *QueueStorage) GetQueue(ctx context.Context) ([]*model.QueueEntry, error) {
	queue := []*model.QueueEntry{}
	
	options := options.Find().SetSort(bson.D{{Key: "number", Value: 1}}) // here 1 mewans ascending order and -1 means descending order
	cursor, err := qs.db.Collection("queue").Find(ctx, bson.D{}, options)
	if err != nil {
		return nil,err
	}
	defer cursor.Close(ctx)
	 for cursor.Next(ctx) {
		var entry model.QueueEntry
		if err := cursor.Decode(&entry); err != nil {
			return nil, err
		}
		 queue = append(queue, &entry)
	 }

	if cursor.Err() != nil {
		return nil, err
	}

	slices.SortFunc(queue, func (patientA, patientB *model.QueueEntry) int {
		if priorityMap[patientA.AssignedLabel] != priorityMap[patientB.AssignedLabel] {
			return priorityMap[patientA.AssignedLabel] - priorityMap[patientB.AssignedLabel]
		}
		return patientA.Number - patientB.Number
	})

	return queue, nil

}

func (qs *QueueStorage) PushToQueue(ctx context.Context, patient *model.QueueEntry) (int,error) {
		queue, err := qs.GetQueue(ctx)
		if err != nil {
			return 0,err
		}

		patient.Number = len(queue) + 1
		queue = append(queue, patient)

		qs.db.Collection("queue").Drop((ctx)) // delete all the values and put new values
		if _, err := qs.db.Collection("queue").InsertMany(ctx,model.QueueToInterface(queue)); err != nil {
			return 0,err
		}

		return patient.Number, nil
		
}

func (qs *QueueStorage) RemoveFromQueue(ctx context.Context, patientNumber int) error {
	var filter = bson.D{{Key: "number", Value: patientNumber}}

	if _, err := qs.db.Collection("queue").DeleteOne(ctx, filter); err != nil {
		return err
	}
	return nil
}

func InitQueueStorage(db *mongo.Database) *QueueStorage {
	return &QueueStorage{
		db:db,
	}
}