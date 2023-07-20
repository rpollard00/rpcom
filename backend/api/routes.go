package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/api/ping", ping)
	dynamic := alice.New(app.sessionManager.LoadAndSave, noSurf, app.authenticate)

	router.Handler(http.MethodGet, "/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/blog", dynamic.ThenFunc(app.getBlog))
	router.Handler(http.MethodGet, "/api/blog/view/:id", dynamic.ThenFunc(app.getBlog))
	router.Handler(http.MethodPost, "/api/blog/post", dynamic.ThenFunc(app.postBlog))

	standard := alice.New(app.recoverPanic, app.logRequest)
	return standard.Then(router)
}
