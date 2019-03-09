package main

import (
	"github.com/aws/aws-lambda-go/lambda"
)

type module struct {
	ID    string `json:"id"`
	Count int    `json:"count"`
}

func show() (*module, error) {
	// Fetch a specific module record from the DynamoDB database. We'll
	// make this more dynamic in the next section.
	board, err := getItem("PC-F10")
	if err != nil {
		return nil, err
	}

	return board, nil
}

func main() {
	lambda.Start(show)
}
