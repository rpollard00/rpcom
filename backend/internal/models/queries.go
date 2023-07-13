package models

import (
	"database/sql"
	_ "errors"
	"time"
)

type Blog struct {
	ID      int
	Title   string
	Content string
	Tags    string
	Author  string
	Created time.Time
}

type Model struct {
	DB *sql.DB
}

func (m *Model) InsertBlog(title string, content string, tags string, author string) (int, error) {

	return 0, nil
}

func (m *Model) GetBlog(id int) (*Blog, error) {
	return nil, nil
}

func (m *Model) Latest() ([]*Blog, error) {
	return nil, nil
}
