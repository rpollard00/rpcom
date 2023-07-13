package main

import (
	"net/http"
)

func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/", app.home)
	mux.HandleFunc("/api/blog", app.getBlog)
	mux.HandleFunc("/api/blog/post", app.postBlog)

	return mux
}
