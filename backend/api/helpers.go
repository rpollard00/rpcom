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

func (app *application) jsonError(w http.ResponseWriter, error error, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)

	jsonError := struct {
		error string
	}{
		error: error.Error(),
	}

	err := json.NewEncoder(w).Encode(jsonError)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

func (app *application) jsonResponse(w http.ResponseWriter, body any, code int) {
	if code == 0 {
		code = http.StatusOK
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)

	err := json.NewEncoder(w).Encode(body)
	if err != nil {
		app.jsonError(w, err, http.StatusUnprocessableEntity)
		return
	}
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}
