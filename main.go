package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	zmq "github.com/pebbe/zmq4"
)

func QclHandler(w http.ResponseWriter, r *http.Request) {
	socket, err := zmq.NewSocket(zmq.SUB)
	if err != nil {
		log.Fatal(err)
	}
	defer socket.Close()
	socket.Bind("tcp://192.108.190.96:5550")
	w.Write(socket.Read())
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", QclHandler)
	http.Handle("/", r)
}
