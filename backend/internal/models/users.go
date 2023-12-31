package models

import (
	"database/sql"
	"errors"
	"strings"

	//"fmt"
	"time"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int
	Username       string
	Email          string
	HashedPassword []byte
	Created        time.Time
}

type UserModel struct {
	DB *sql.DB
}

type UserModelInterface interface {
	Insert(username, email, password string) error
	Exists(id int) (bool, error)
	Authenticate(email, password string) (int, error)
}

func (m *UserModel) Insert(username, email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	stmt := `INSERT INTO users (name, email, hashed_password, created) 
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`

	_, err = m.DB.Exec(stmt, username, email, string(hashedPassword))
	if err != nil {
		var pSQLError *pq.Error

		if errors.As(err, &pSQLError) {
			if pSQLError.Code == "23505" && strings.Contains(pSQLError.Message, "users_uc_email") {
				return ErrDuplicateEmail
			}
		}
		return err
	}
	return nil
}

func (m *UserModel) Exists(id int) (bool, error) {
	return true, nil
}

func (m *UserModel) Authenticate(email, password string) (int, error) {
	var id int
	var hashedPassword []byte

	stmt := "SELECT id, hashed_password FROM users WHERE email = $1"

	err := m.DB.QueryRow(stmt, email).Scan(&id, &hashedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			println("Bad query??")
			return 0, ErrInvalidCredentials
		} else {
			return 0, err
		}
	}
	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, ErrInvalidCredentials
		} else {
			println(err)
			return 0, err
		}
	}

	println(id)
	return id, nil
}
