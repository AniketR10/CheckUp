package model

type Edge struct {
	Id string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
}

type Node struct { 
	Id string `json:"id"`
	Type string `json:"type"`
	Position struct {
		X float64 `json:"x"`
		Y float64 `json:"y"`
	} `json:"position"`
}

type TriageNode struct {
	Node
	Data struct {
		Value string `json:"value"` // jo hum fill krte hain
	    IsRoot bool `json:"isRoot"`
	    StepType string `json:"stepType"`
	    AssignedLabel string `json:"assignedLabel"`
	} `json:"data"`
	
}

type TriageOptionNode struct {
	Node
	ParentId string `json:"parentId"`
	Data struct {
		Value string `json:"value"`
		Index int `json:"index"`
	} `json:"data"`
}

// map any slice type T[] into []interface{}
func NodesToInterface[T any](slice []T) []interface{} {
	result := make([]interface{},len(slice))

	for i,v := range slice{
		result[i] = v
	}

	return result
}

func MergeNodes(tnodes []*TriageNode, onodes []*TriageOptionNode) []interface{} {
	return append(NodesToInterface(tnodes), NodesToInterface(onodes)...)
}