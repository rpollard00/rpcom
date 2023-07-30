package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) setGlobalOptions(rtr *httprouter.Router) {
	rtr.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Access-Control-Request-Method") != "" {
			header := w.Header()
			header.Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
			header.Set("Access-Control-Allow-Headers", "Content-Type, x-requested-with")
			header.Set("Access-Control-Allow-Origin", "*")
		}

		w.WriteHeader(http.StatusNoContent)
	})
}
func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/api/ping", ping)
	// this is for automatic option/CORS handling
	app.setGlobalOptions(router)
	// dynamic := alice.New(app.sessionManager.LoadAndSave, app.authenticate, app.addHeaders)
	dynamic := alice.New(app.addHeaders)

	router.Handler(http.MethodGet, "/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/", dynamic.ThenFunc(app.home))
	router.Handler(http.MethodGet, "/api/blog/view/latest", dynamic.ThenFunc(app.getLatestBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/next", dynamic.ThenFunc(app.getNextBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/prev", dynamic.ThenFunc(app.getPrevBlogId))
	router.Handler(http.MethodGet, "/api/blog/view/id/:id", dynamic.ThenFunc(app.getBlog))
	router.Handler(http.MethodPost, "/api/users/login", dynamic.ThenFunc(app.userLoginPost))
	router.Handler(http.MethodPost, "/api/users/signup", dynamic.ThenFunc(app.signUp))

	protected := dynamic.Append(app.requireAuthentication)
	router.Handler(http.MethodPost, "/api/blog/post", protected.ThenFunc(app.blogPost))
	router.Handler(http.MethodPost, "/api/users/logout", protected.ThenFunc(app.blogPost))
	standard := alice.New(app.recoverPanic, app.logRequest)
	return standard.Then(router)
}
