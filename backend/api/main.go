package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/rpollard00/rpcom/internal/models"

	"github.com/alexedwards/scs/postgresstore"
	"github.com/alexedwards/scs/v2"
	"github.com/go-playground/form/v4"
	_ "github.com/lib/pq"
)

type application struct {
	infoLog        *log.Logger
	errorLog       *log.Logger
	users          models.UserModelInterface
	blogs          models.BlogModelInterface
	sessionManager *scs.SessionManager
	formDecoder    *form.Decoder
}

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func main() {
	var default_dsn string
	db_pass := os.Getenv("DB_SECRET")
	environment := os.Getenv("APP_MODE")
	if strings.ToLower(environment) == "prod" {
		default_dsn = fmt.Sprintf("postgres://web:%s@rpcom.flycast:5432/rpcom_prod?sslmode=disable", db_pass)
	} else {
		default_dsn = fmt.Sprintf("postgres://web:%s@localhost:5432/rpcom_dev?sslmode=disable", db_pass)
	}
	addr := flag.String("addr", ":8080", "HTTP Network Address:[port]")
	dsn := flag.String("dsn", default_dsn, "PSQL Connection String")

	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	db, err := openDB(*dsn)
	if err != nil {
		errorLog.Fatal(err)
	}

	defer db.Close()

	formDecoder := form.NewDecoder()
	// initialize session manager
	sessionManager := scs.New()
	sessionManager.Store = postgresstore.New(db)
	sessionManager.Lifetime = 12 * time.Hour // 12 hour session

	app := &application{
		infoLog:        infoLog,
		errorLog:       errorLog,
		users:          &models.UserModel{DB: db},
		blogs:          &models.BlogModel{DB: db},
		sessionManager: sessionManager,
		formDecoder:    formDecoder,
	}

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(),
	}

	infoLog.Printf("Starting server on address: %s ", *addr)

	err = srv.ListenAndServe()

	errorLog.Fatal(err)
}

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
