package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"runtime/debug"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func (app *application) isAuthenticated(r *http.Request) (bool, error) {
	authHeader := r.Header.Get("Authorization")
	bearerToken := strings.Fields(authHeader)
	if len(bearerToken) != 2 || strings.ToLower(bearerToken[0]) != "bearer" {
		err := errors.New("invalid authorization header")
		return false, err
	}
	token := bearerToken[1]

	claims := &Claims{}

	tok, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrSignatureInvalid) {
			return false, nil
		}
		return false, err
	}

	if !tok.Valid {
		return false, nil
	}

	return true, nil
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
	JsonPayload := &JsonResponseData{
		Data: Body,
		Code: code,
	}
	Data, err := json.Marshal(JsonPayload)
	if err != nil {
		app.jsonError(w, err, http.StatusUnprocessableEntity)
		return
	}
	w.WriteHeader(code)
	w.Write(Data)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}
