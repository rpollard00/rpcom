package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/api/ping", ping)
	// dynamic := alice.New(app.sessionManager.LoadAndSave, app.authenticate, app.addHeaders)
	dynamic := alice.New(app.addHeaders)

	router.Handler(http.MethodGet, "/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/blog/view/latest", dynamic.ThenFunc(app.getLatestBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/next", dynamic.ThenFunc(app.getNextBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/prev", dynamic.ThenFunc(app.getPrevBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/id/:id", dynamic.ThenFunc(app.getBlog))

	// protected := dynamic.Append(app.requireAuthentication)
	router.Handler(http.MethodPost, "/api/blog/post", dynamic.ThenFunc(app.blogPost))
	standard := alice.New(app.recoverPanic, app.logRequest)
	return standard.Then(router)
}
