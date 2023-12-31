package main

import (
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

var allowedOrigins = []string{
	"http://localhost:5173",
	"https://reesep.com",
	"https://reesep-com-test.fly.dev",
}

func (app *application) setGlobalOptions(rtr *httprouter.Router) {
	rtr.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Access-Control-Request-Method") != "" {
			header := w.Header()
			header.Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT")
			header.Set("Access-Control-Allow-Headers", "Content-Type, x-requested-with, authorization")

			// handle both prod and dev origins by matching the allowed origin
			origin := r.Header.Get("origin")

			for _, allowedOrigin := range allowedOrigins {
				if strings.EqualFold(origin, allowedOrigin) {
					header.Set("Access-Control-Allow-Origin", allowedOrigin)
				}
			}
		}

		w.WriteHeader(http.StatusNoContent)
	})
}
func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/api/ping", ping)
	// this is for automatic option/CORS handling
	app.setGlobalOptions(router)

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
	router.Handler(http.MethodPut, "/api/blog/post/:id", protected.ThenFunc(app.blogUpdatePost))

	standard := alice.New(app.recoverPanic, app.logRequest)
	return standard.Then(router)
}
