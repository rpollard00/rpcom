package validator

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"unicode/utf8"
	_ "unicode/utf8"
)

var EmailRX = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

type Validator struct {
	NonFieldErrors []string
	FieldErrors    map[string]string
}

func (v *Validator) Valid() bool {
	return len(v.FieldErrors) == 0 && len(v.NonFieldErrors) == 0
}

type ValidatorMessages struct {
	Messages []string
}

func (v *Validator) GetValidatorMessages() (*ValidatorMessages, error) {
	if v.Valid() {
		return nil, errors.New("Validator messages is empty")
	}

	var messages []string
	if len(v.NonFieldErrors) > 0 {
		for _, s := range v.NonFieldErrors {
			messages = append(messages, s)
		}
	}

	if len(v.FieldErrors) > 0 {
		for k, v := range v.FieldErrors {
			messages = append(messages, fmt.Sprintf("%s %s", k, v))
		}
	}
	vmessages := &ValidatorMessages{
		Messages: messages,
	}
	return vmessages, nil
}

func (v *Validator) AddFieldError(key string, message string) {
	if v.FieldErrors == nil {
		v.FieldErrors = make(map[string]string)
	}

	if _, exists := v.FieldErrors[key]; !exists {
		v.FieldErrors[key] = message
	}
}

func (v *Validator) AddNonFieldError(message string) {
	v.NonFieldErrors = append(v.NonFieldErrors, message)
}

func (v *Validator) CheckField(ok bool, key string, message string) {
	if !ok {
		v.AddFieldError(key, message)
	}
}
func MaxChars(str string, numChars int) bool {
	return utf8.RuneCountInString(str) <= numChars
}

func MinChars(str string, numChars int) bool {
	return utf8.RuneCountInString(str) >= numChars
}

func Matches(str string, rx *regexp.Regexp) bool {
	return rx.MatchString(str)
}

func NotBlank(str string) bool {
	return strings.TrimSpace(str) != ""
}

func NotZero(num int) bool {
	return num != 0
}
