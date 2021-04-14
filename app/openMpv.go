package main

import (
	"encoding/base64"
	"os"
	"os/exec"
	"strings"
)

/*
Protocol that should be implemented for all of this mess:

$prefix$path$video$args

$prefix is the string literal "mpv://"
$path is the base64 encoded location of the user's local mpv executable
$video is a base64 encoded video url
$args is zero or more occurrences of $arg
$arg = $sep$param$sep$value
$sep is a url-allowable separator character outside of the base64 set
$param is a base64 encoded mpv argument key, not including whitespace, "--" or "="
$value is a base64 encoded mpv argument value. can be empty string to denote no value(equals will be omitted from argument)
*/
var mpvPath = "C:\\mpv\\mpv.exe"
var mpvArgs = []string{
	"--no-border",
	"--ytdl-format=bestvideo+bestaudio/best",
	"--autofit=60%",
}

const g_separator = "_"

func main() {
	if len(os.Args) != 2 {
		os.Exit(1)
	}

	mpvArgs, err := parse(os.Args[1])
	if err != nil {
		os.Exit(1)
	}

	err = exec.Command(mpvPath, mpvArgs...).Start()
	if err != nil {
		os.Exit(1)
	}
}

//TODO re-implement following the protocol defined above
func parse(url string) (args []string, err error) {
	url = strings.TrimPrefix(url, "mpv://")

	parts := strings.Split(url, g_separator)

	videoUrl, err := base64.StdEncoding.DecodeString(parts[0])
	if err != nil {
		return
	}
	args = append(args, string(videoUrl))

	args = append(args, mpvArgs...)

	return
}
