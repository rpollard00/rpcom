package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime/debug"
)

func (app *application) isAuthenticated(r *http.Request) bool {
	//isAuthenticated, ok := r.Context().Value().isAuthenticatedContextKey.(bool)
	return false
}

func (app *application) renderJson(w http.ResponseWriter, v any) []byte {
	jsonBlog, err := json.Marshal(v)
	if err != nil {
		app.serverError(w, err)
	}

	w.Header().Set("Content-Type", "application/json")
	return jsonBlog
}

//lint:ignore U1000 TBD
func (app *application) serverError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	app.errorLog.Output(2, trace)

	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

type JsonErrorData struct {
	Error string `json:"error"`
}

func (app *application) jsonError(w http.ResponseWriter, error error, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)

	jsonError := &JsonResponseData{
		Data: JsonErrorData{
			Error: string(error.Error()),
		},
		Code: code,
	}

	err := json.NewEncoder(w).Encode(jsonError)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

type JsonResponseData struct {
	Data any `json:"data"`
	Code int `json:"code"`
}

func (app *application) jsonResponse(w http.ResponseWriter, Body any, code int) {
	if code == 0 {
		code = http.StatusOK
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")

	// err := json.NewEncoder(w).Encode(body)
	app.infoLog.Printf("DATA: %s", Body)
	JsonPayload := &JsonResponseData{
		Data: Body,
		Code: code,
	}
	Data, err := json.Marshal(JsonPayload)
	if err != nil {
		app.jsonError(w, err, http.StatusUnprocessableEntity)
		return
	}
	app.infoLog.Printf("JSON DATA: %s", Data)
	w.WriteHeader(code)
	w.Write(Data)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}
