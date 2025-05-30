package model

type QueueEntry struct {
	AssignedLabel string `json:"assignedLabel"`
	Number int `json:"number"`
}

func QueueToInterface[T any](slice []T) []interface{} {
	result := make([]interface{}, len(slice))

	for i,v := range slice {
		result[i] = v
	}

	return result
}