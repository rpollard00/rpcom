package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func home(w http.ResponseWriter, r *http.Request) {
	log.Print("HTTP METHOD: ", r.Method)

	if r.URL.Path != "/api/" {
		http.NotFound(w, r)
		return
	}
}

func getBlog(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id"))

	if err != nil || id < 1 {
		http.NotFound(w, r)
		return
	}

	log.Print("HTTP METHOD: ", r.Method)
	log.Print("id? =  ", id)
	fmt.Fprintf(w, "Read a specific blog with id %d...\n", id)

}

func postBlog(w http.ResponseWriter, r *http.Request) {
	log.Print("HTTP METHOD: ", r.Method)

	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}

	w.Write([]byte("Create a new blog...\n"))
}
