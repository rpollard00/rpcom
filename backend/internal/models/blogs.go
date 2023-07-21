package models

import (
	"database/sql"
	"errors"
	"time"
)

// struct that represents a blog
type Blog struct {
	ID      int
	Title   string
	Author  string
	Content string
	Tags    string
	Created time.Time
}

// a blog interface
type BlogModelInterface interface {
	Insert(title string, author string, content string, tags string) (int, error)
	Get(id int) (*Blog, error)
	GetNextId(currentId int) (int, error)
	GetPrevId(currentId int) (int, error)
	GetLatestId() (int, error)
	//LastN(num int) ([]*Blog, error)
}

// a blogModel struct with a pointer to the DB
type BlogModel struct {
	DB *sql.DB
}

func (m *BlogModel) Get(id int) (*Blog, error) {
	b := &Blog{}

	err := m.DB.QueryRow(
		`SELECT id, title, author, content, tags, created FROM blogs 
	WHERE id = $1`, id).Scan(
		&b.ID, &b.Title, &b.Author, &b.Content, &b.Tags, &b.Created)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		} else {
			return nil, err
		}
	}

	return b, err
}

func (m *BlogModel) GetLatestId() (int, error) {
	b := &Blog{}
	stmt := `SELECT id, created FROM blogs ORDER BY created DESC LIMIT 1`
	err := m.DB.QueryRow(stmt).Scan(
		&b.ID, &b.Created)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrNoRecord
		} else {
			return 0, err
		}
	}

	return b.ID, err
}

func (m *BlogModel) GetNextId(currentId int) (int, error) {
	b := &Blog{}
	stmt := `SELECT id FROM blogs WHERE id > $1 ORDER BY id ASC LIMIT 1`
	err := m.DB.QueryRow(stmt, currentId).Scan(
		&b.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// its not really an error if there's no next row, return the currentId as it means we have the highest entry
			return currentId, nil
		} else {
			return 0, err
		}
	}

	return b.ID, err
}

func (m *BlogModel) GetPrevId(currentId int) (int, error) {
	b := &Blog{}
	stmt := `SELECT id FROM blogs WHERE id < $1 ORDER BY id DESC LIMIT 1`
	err := m.DB.QueryRow(stmt, currentId).Scan(
		&b.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// its not really an error if there's no previous entry
			// return the currentId as it means we have the highest entry
			return currentId, nil
		} else {
			return 0, err
		}
	}

	return b.ID, err
}

func (m *BlogModel) Insert(title string, author string, content string, tags string) (int, error) {
	stmt := `INSERT INTO blogs (title, author, content, tags, created)
	VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
	RETURNING id`

	var id int

	err := m.DB.QueryRow(stmt, title, author, content, tags).Scan(&id)
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *BlogModel) Latest() (*Blog, error) {
	b := &Blog{}

	stmt := `SELECT id, title, author, content, tags, created FROM blogs ORDER BY created DESC LIMIT 1`

	err := m.DB.QueryRow(stmt).Scan(&b.ID, &b.Title, &b.Author, &b.Content, &b.Tags)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		} else {
			return nil, err
		}
	}

	return b, nil
}
