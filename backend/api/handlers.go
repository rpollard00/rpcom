package main

import (
	"encoding/json"
	"errors"
	"fmt"
	_ "fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/rpollard00/rpcom/internal/models"
	"github.com/rpollard00/rpcom/internal/validator"

	"github.com/golang-jwt/jwt/v5"
	"github.com/julienschmidt/httprouter"
)

const PasswordMinChars = 12

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
		app.jsonError(w, err, http.StatusUnprocessableEntity)
		return
	}
}

// signup
type signUpForm struct {
	Email               string `json:"email"`
	Username            string `json:"username"`
	Password            string `json:"password"`
	validator.Validator `json:"-"`
}

func (app *application) signUp(w http.ResponseWriter, r *http.Request) {
	var form signUpForm
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
	}

	form.CheckField(validator.NotBlank(form.Email), "email", "Cannot be blank")
	form.CheckField(validator.Matches(form.Email, validator.EmailRX), "email", "Must be a valid email address")
	form.CheckField(validator.NotBlank(form.Username), "username", "Cannot be blank")
	form.CheckField(validator.NotBlank(form.Password), "password", "Cannot be blank")

	passwordReqMsg := fmt.Sprintf("Password must contain at least %v chars", PasswordMinChars)
	form.CheckField(validator.MinChars(form.Password, PasswordMinChars), "password", passwordReqMsg)

	if !form.Valid() {
		messages, err := form.GetValidatorMessages()
		if err != nil {
			app.serverError(w, err)
		}

		app.jsonResponse(w, messages, http.StatusUnprocessableEntity)
		return
	}

	err = app.users.Insert(form.Username, form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			app.jsonError(w, err, http.StatusConflict)
		} else {
			app.serverError(w, err)
		}
		return
	}

	responseData := struct {
		Message  string `json:"message"`
		Username string `json:"username"`
	}{
		Message:  "User account created",
		Username: form.Username,
	}
	app.jsonResponse(w, responseData, http.StatusCreated)
}

// login
type UserLoginForm struct {
	Email               string `json:"email"`
	Password            string `json:"password"`
	validator.Validator `json:"-"`
}

type TokenResponse struct {
	Token string `json:"token"`
	Email string `json:"email"`
	ID    int    `json:"id"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func (app *application) userLoginPost(w http.ResponseWriter, r *http.Request) {
	var form UserLoginForm

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&form)
	if err != nil {
		app.clientError(w, http.StatusBadRequest)
	}

	// validation checks
	// check that the email and password are not blank
	// check that the email is nicely formatted
	form.CheckField(validator.NotBlank(form.Email), "email", "Field cannot be blank")
	form.CheckField(validator.Matches(form.Email, validator.EmailRX), "email", "Must be a valid email address")
	form.CheckField(validator.NotBlank(form.Password), "password", "Field cannot be blank")

	if !form.Valid() {
		messages, err := form.GetValidatorMessages()
		if err != nil {
			app.serverError(w, err)
		}

		app.jsonResponse(w, messages, http.StatusUnprocessableEntity)
		return
	}

	id, err := app.users.Authenticate(form.Email, form.Password)
	if err != nil {
		if errors.Is(err, models.ErrInvalidCredentials) {
			form.AddNonFieldError("Invalid username or password")

			messages, err := form.GetValidatorMessages()
			if err != nil {
				app.serverError(w, err)
			}

			app.jsonResponse(w, messages, http.StatusUnprocessableEntity)
			return
		} else {
			app.serverError(w, err)
		}
	}

	// 10 minutes from now if that isn't obvious
	expirationTime := time.Now().Add(10 * time.Minute)

	claims := &Claims{
		Email: form.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		app.serverError(w, err)
		return
	}

	tokenResponse := &TokenResponse{
		Token: tokenString,
		Email: form.Email,
		ID:    id,
	}
	app.jsonResponse(w, tokenResponse, http.StatusOK)

	return
}

// logout
