package storage

import (
	"context"

	"github.com/AniketR10/CheckUp/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type TriageStorage struct {
	db *mongo.Database
}

func find[T any](ts *TriageStorage, ctx context.Context, collection string) ([]*T, error) {
	documents := []*T{}

	cursor, err := ts.db.Collection(collection).Find(ctx,bson.D{})
	if err != nil {
		return nil,err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var doc T
		if err := cursor.Decode(&doc); err != nil {
			return nil,err
		}
		documents = append(documents, &doc)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return documents, nil
}

func (ts *TriageStorage) Get (ctx context.Context) (
	[]*model.TriageNode,[]*model.TriageOptionNode,[]*model.Edge, error,
) {
	TNodes, err := find[model.TriageNode](ts,ctx,"tnodes")
	if err != nil {
		return nil,nil,nil,err
	}

	ONodes, err := find[model.TriageOptionNode](ts,ctx,"onodes")
	if err != nil {
		return nil,nil,nil,err
	}

	Edges, err := find[model.Edge](ts,ctx,"edges")
	if err != nil {
		return nil,nil,nil,err
	}
	
	return TNodes, ONodes, Edges, nil

}
func (ts *TriageStorage) Post ( // database me value daalni hai
	ctx context.Context,
	TNodes []*model.TriageNode,
	ONodes []*model.TriageOptionNode,
	Edges []*model.Edge,
) error {
	// cleaning up db if an error occurs and the updating with the new values as we do not want to update the things that shows error as that would be very messy
	ts.db.Collection("tnodes").Drop(ctx)
	ts.db.Collection("onodes").Drop(ctx)
	ts.db.Collection("edges").Drop(ctx)

	//insert new data
	if(len(TNodes) > 0){
		if _, err := ts.db.Collection("tnodes").InsertMany(ctx,model.NodesToInterface(TNodes)); err != nil {
			return err
		}
	}

	if(len(ONodes) > 0){
		if _, err := ts.db.Collection("onodes").InsertMany(ctx,model.NodesToInterface(ONodes)); err != nil {
			return err
		}
	}

	if(len(Edges) > 0){
		if _, err := ts.db.Collection("edges").InsertMany(ctx,model.NodesToInterface(Edges)); err != nil {
			return err
		}
	}

	return nil
}


func InitTriageStorage(db *mongo.Database) *TriageStorage {
	return &TriageStorage{
		db:db,
	}
}