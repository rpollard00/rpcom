package main

import (
	"errors"
	_ "fmt"
	"net/http"
	"strconv"

	"github.com/rpollard00/rpcom/internal/models"

	"github.com/julienschmidt/httprouter"
)

func ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK\n"))
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	app.infoLog.Print("HTTP METHOD: ", r.Method)

	if r.URL.Path != "/api/" {
		app.notFound(w)
		return
	}
}

func (app *application) getBlog(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil || id < 1 {
		app.notFound(w)
		return
	}

	blog, err := app.blogs.Get(id)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}
		return
	}

	w.Write(app.renderJson(w, blog))
}

func (app *application) postBlog(w http.ResponseWriter, r *http.Request) {
	app.infoLog.Print("HTTP METHOD: ", r.Method)

	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
	}

	w.Write([]byte("Create a new blog...\n"))
}
