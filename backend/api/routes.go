package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) routes() *http.ServeMux {
	router := httprouter.New()

	dynamic := alice.New(app.sessionManager.LoadAndSave, noSurf, app.authenticate)
	router.Handler(http.MethodGet, "/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/snippet/view/:id", dynamic.ThenFunc(app.snippetView))
	router.Handler(http.MethodGet, "/user/signup", dynamic.ThenFunc(app.userSignup))
	router.Handler(http.MethodPost, "/user/signup", dynamic.ThenFunc(app.userSignupPost))
	router.Handler(http.MethodGet, "/api/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/blog", dynamic.ThenFunc(getBlog))
	router.Handler(http.MethodGet, "/api/blog/post", dynamic.ThenFunc(postBlog))

	return mux
}
