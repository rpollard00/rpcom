package main

import (
	"fmt"
	"net/http"
	"strconv"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	app.infoLog.Print("HTTP METHOD: ", r.Method)

	if r.URL.Path != "/api/" {
		app.notFound(w)
		return
	}
}

func (app *application) getBlog(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))

	if err != nil || id < 1 {
		app.notFound(w)
		return
	}

	app.infoLog.Print("HTTP METHOD: ", r.Method)
	app.infoLog.Print("id? =  ", id)
	fmt.Fprintf(w, "Read a specific blog with id %d...\n", id)

}

func (app *application) postBlog(w http.ResponseWriter, r *http.Request) {
	app.infoLog.Print("HTTP METHOD: ", r.Method)

	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
	}

	w.Write([]byte("Create a new blog...\n"))
}
