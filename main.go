// main.go
// http server for docs-upload-site
// author: @notatestuser, 2018

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const maxFileSize = 1024 * 1024 * 10 // 10MB
const bufferSize = 1024 * 1024 * 1   // 1MB

func main() {
	// use APP_ENV to decide the current environment for static assets
	env := os.Getenv("APP_ENV")
	uploadsDir := "./public/uploads/"
	if env == "production" {
		uploadsDir = "./build/uploads/"
	}

	// set up the gorilla/mux router to serve http requests
	r := mux.NewRouter()
	r.HandleFunc("/upload", uploadFile(uploadsDir)).Methods("POST", "OPTIONS")
	r.HandleFunc("/list", listOrSearchFiles(uploadsDir)).Methods("GET")
	r.HandleFunc("/search/{query}", listOrSearchFiles(uploadsDir)).Methods("GET")
	r.HandleFunc("/delete/{filename}", deleteFile(uploadsDir)).Methods("POST", "OPTIONS")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./build/")))

	fmt.Println("Starting up on 8081")

	// cors config
	origins := handlers.AllowedOrigins([]string{"*"})
	headers := handlers.AllowedHeaders([]string{"X-Requested-With"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	err := http.ListenAndServe(":8081", handlers.CORS(origins, headers, methods)(r))
	log.Fatal(err)
}

func throwHTTPError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)
	w.Write([]byte(err.Error()))
	return
}

// uploadFile produces an HTTP handler for uploading a file to the server.
func uploadFile(uploadsDir string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// reject suspiciously large file uploads
		if r.ContentLength > maxFileSize {
			http.Error(w, "request too large", http.StatusExpectationFailed)
			return
		}

		// parse request body as multipart/form-data with maxFileSize in mind
		r.Body = http.MaxBytesReader(w, r.Body, maxFileSize)
		r.ParseMultipartForm(bufferSize)

		file, handler, err := r.FormFile("file") //retrieve the file from form data
		defer file.Close()                       //close the file when we finish

		if err != nil {
			throwHTTPError(w, http.StatusInternalServerError, err)
			return
		}

		f, err := os.OpenFile(uploadsDir+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			throwHTTPError(w, http.StatusInternalServerError, err)
			return
		}

		defer f.Close()
		io.Copy(f, file)

		resp := struct {
			FileName string `json:"filename"`
		}{
			FileName: handler.Filename,
		}

		output, err := json.Marshal(resp)
		if err != nil {
			throwHTTPError(w, http.StatusInternalServerError, err)
			return
		}
		w.Write(output)
	}
}

// listOrSearchFiles produces an HTTP handler for listing or searching file uploads.
func listOrSearchFiles(uploadsDir string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		query := ""
		if len(vars) > 0 {
			query = vars["query"]
		}

		files, err := ioutil.ReadDir(uploadsDir)
		if err != nil {
			log.Fatal(err)
		}

		type File struct {
			Name string `json:"name"`
			Size int64  `json:"size"`
		}

		list := make([]File, 0)
		for _, f := range files {
			fname := f.Name()
			// ignore empty filenames and hidden files
			if len(fname) == 0 || strings.Index(fname, ".") == 0 {
				continue
			}
			// list all files or look for `query` within filenames
			if len(query) == 0 || strings.Contains(strings.ToLower(fname), strings.ToLower(query)) {
				list = append(list, File{
					Name: fname,
					Size: f.Size(),
				})
			}
		}

		resp := struct {
			Files []File `json:"files"`
		}{
			Files: list,
		}

		output, err := json.Marshal(resp)
		if err != nil {
			throwHTTPError(w, http.StatusInternalServerError, err)
			return
		}
		w.Write(output)
	}
}

// deleteFile deletes a file on the server.
func deleteFile(uploadsDir string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		filename := ""
		if len(vars) > 0 {
			filename = vars["filename"]
		}

		if len(filename) == 0 {
			http.Error(w, "unknown filename", http.StatusInternalServerError)
			return
		}

		err := os.Remove(uploadsDir + filename)
		if err != nil {
			throwHTTPError(w, http.StatusNotFound, err)
			return
		}

		w.Write(nil)
	}
}
