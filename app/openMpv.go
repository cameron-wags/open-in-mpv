package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

const g_separator = "_"

func main() {
	os.WriteFile("/home/cameron/mpvopen.log", []byte("Hello there"), os.ModeAppend)
	os.WriteFile("/home/cameron/mpvopen.log", []byte(os.Args[0]), os.ModeAppend)
	if len(os.Args) != 2 {
		os.Exit(1)
	}

	os.WriteFile("/home/cameron/mpvopen.log", []byte(os.Args[1]), os.ModeAppend)
	command, err := parse(os.Args[1])
	if err != nil {
		os.Exit(1)
	}
	c, _ := json.MarshalIndent(command, "", "  ")
	os.WriteFile("/home/cameron/mpvopen.log", c, os.ModeAppend)
	err = exec.Command(command.Path, command.Args...).Start()
	if err != nil {
		os.Exit(1)
	}
}

type Command struct {
	// Local path to mpv executable, including the executable.
	Path string

	// Command line arguments to pass when calling mpv.
	Args []string
}

/*
returns a command that can be sent to mpv


Protocol for mpv stuff:

message: $prefix$path$sep$video$args

$prefix is the string literal "mpv://"

$path is the base64 encoded location of the user's local mpv executable

$video is a base64 encoded video url

$args is zero or more occurrences of $arg

$arg = $sep$param$sep$value

$sep is a url-allowable separator character outside of the base64 set

$param is a base64 encoded mpv argument key, not including whitespace, "--" or "="

$value is a base64 encoded mpv argument value. can be empty string to denote no value(equals will be omitted from argument)
*/
func parse(url string) (mpv Command, err error) {
	url = strings.TrimPrefix(url, "mpv://")

	parts := strings.Split(url, g_separator)

	mpv.Path, err = decode(parts[0])
	if err != nil {
		return
	}

	videoUrl, err := decode(parts[1])
	if err != nil {
		return
	}
	mpv.Args = append(mpv.Args, fmt.Sprintf("--url=%s", videoUrl))

	for i := 2; i < len(parts); i += 2 {
		argName, inErr := decode(parts[i])
		if inErr != nil {
			// I'm okay with discarding broken arguments
			continue
		}

		if len(parts[i+1]) == 0 {
			mpv.Args = append(mpv.Args, fmt.Sprintf("--%s", argName))
			continue
		}

		argValue, inErr := decode(parts[i+1])
		if inErr != nil {
			continue
		}
		mpv.Args = append(mpv.Args, fmt.Sprintf("--%s=%s", argName, argValue))
	}

	return
}

// returns a string decoded from the base64 string provided
func decode(encoded string) (decoded string, err error) {
	temp, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return
	}

	return string(temp), nil
}
