package models

import (
	"errors"
)

var (
	ErrNoRecord           = errors.New("models: Record could not be found")
	ErrInvalidCredentials = errors.New("models: invalid credentials")
	ErrDuplicateEmail     = errors.New("models: duplicate email")
)
