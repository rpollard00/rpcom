package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/rpollard00/rpcom/internal/models"

	"github.com/alexedwards/scs/postgresstore"
	"github.com/alexedwards/scs/v2"
	_ "github.com/lib/pq"
)

type application struct {
	infoLog        *log.Logger
	errorLog       *log.Logger
	blogs          models.BlogModelInterface
	sessionManager *scs.SessionManager
}

func main() {
	db_pass := os.Getenv("DB_SECRET")
	default_dsn := fmt.Sprintf("postgres://web:%s@localhost:5432/rpcom_dev?sslmode=disable", db_pass)
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

	// initialize session manager
	sessionManager := scs.New()
	sessionManager.Store = postgresstore.New(db)
	sessionManager.Lifetime = 12 * time.Hour // 12 hour session

	app := &application{
		infoLog:        infoLog,
		errorLog:       errorLog,
		blogs:          &models.BlogModel{DB: db},
		sessionManager: sessionManager,
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
