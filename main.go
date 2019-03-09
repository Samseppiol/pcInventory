package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var isboardRegexp = regexp.MustCompile(`PC-(.*)`)
var errorLogger = log.New(os.Stderr, "ERROR ", log.Llongfile)

type module struct {
	ID    string `json:"id"`
	Count int    `json:"count"`
}

func show(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Get the `isbn` query string parameter from the request and
	// validate it.
	id := req.QueryStringParameters["id"]
	if !isboardRegexp.MatchString(id) {
		return clientError(http.StatusBadRequest)
	}

	// Fetch the book record from the database based on the isbn value.
	board, err := getItem(id)
	if err != nil {
		return serverError(err)
	}
	if board == nil {
		return clientError(http.StatusNotFound)
	}

	// The APIGatewayProxyResponse.Body field needs to be a string, so
	// we marshal the book record into JSON.
	js, err := json.Marshal(board)
	if err != nil {
		return serverError(err)
	}

	// Return a response with a 200 OK status and the JSON book record
	// as the body.
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(js),
	}, nil
}

func serverError(err error) (events.APIGatewayProxyResponse, error) {
	errorLogger.Println(err.Error())

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Body:       http.StatusText(http.StatusInternalServerError),
	}, nil
}

// Similarly add a helper for send responses relating to client errors.
func clientError(status int) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Body:       http.StatusText(status),
	}, nil
}

func main() {
	lambda.Start(show)
}
