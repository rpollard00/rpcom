package main

import (
	"encoding/json"
	"errors"
	_ "fmt"
	"net/http"
	"strconv"

	"github.com/rpollard00/rpcom/internal/models"
	"github.com/rpollard00/rpcom/internal/validator"

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

func (app *application) getLatestBlogId(w http.ResponseWriter, r *http.Request) {
	id, err := app.blogs.GetLatestId()
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}
		return
	}

	w.Write(app.renderJson(w, id))
}

func (app *application) getPrevBlogId(w http.ResponseWriter, r *http.Request) {
	currentId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil || currentId < 1 {
		http.NotFound(w, r)
		return
	}

	id, err := app.blogs.GetPrevId(currentId)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}
		return
	}

	w.Write(app.renderJson(w, id))
}

func (app *application) getNextBlogId(w http.ResponseWriter, r *http.Request) {
	currentId, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil || currentId < 1 {
		http.NotFound(w, r)
		return
	}

	id, err := app.blogs.GetNextId(currentId)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFound(w)
		} else {
			app.serverError(w, err)
		}
		return
	}

	w.Write(app.renderJson(w, id))
}

type blogPostForm struct {
	Title               string `json:"title"`
	Tags                string `json:"tags"`
	Content             string `json:"content"`
	Author              string `json:"author"`
	validator.Validator `json:"-"`
}
type blogPostResponse struct {
	Id int `json:"id"`
}

func (app *application) blogPost(w http.ResponseWriter, r *http.Request) {
	var form blogPostForm
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
	}

	form.CheckField(validator.NotBlank(form.Title), "title", "This field cannot be blank")
	form.CheckField(validator.MaxChars(form.Title, 100), "title", "This field cannot be more than 100 characters long")
	form.CheckField(validator.NotBlank(form.Content), "content", "This field cannot be blank")
	form.CheckField(validator.NotBlank(form.Tags), "tags", "This field cannot be blank")
	form.CheckField(validator.NotBlank(form.Author), "author", "This field cannot be blank")

	if !form.Valid() {
		app.clientError(w, http.StatusBadRequest)
		return
	}

	id, err := app.blogs.Insert(form.Title, form.Author, form.Content, form.Tags)
	if err != nil {
		app.serverError(w, err)
		return
	}
	data := blogPostResponse{
		Id: id,
	}
	// app.sessionManager.Put(r.Context(), "flash", "Snippet successfully created!")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		app.serverError(w, err)
		return
	}
}
