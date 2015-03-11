package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	zmq "github.com/pebbe/zmq4"
	"log"
	"net/http"
)

type connection struct {
	ws   *websocket.Conn
	send chan []byte
}

func (c *connection) reader() {
	for message := range c.send {
		err := c.ws.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Fatal(err)
		}
	}
	c.ws.Close()
}

type qcl struct {
	socket zmq.Socket
	send   chan []byte
}

func (q *qcl) read() {
	socket, err := zmq.NewSocket(zmq.SUB)
	if err != nil {
		log.Fatal(err)
	}
	defer socket.Close()

	socket.SetSubscribe("")
	socket.Connect("tcp://192.108.190.96:5550")
	for {
		data, err := socket.Recv(0)
		if err != nil {
			log.Fatal(err)
		}
		q.send <- []byte(data)
	}
}

func QclHandler(w http.ResponseWriter, r *http.Request) {
	// data := QclReader()
	// fmt.Println(data)
	// w.Write(data)
}

func main() {

	instrument := &qcl{send: make(chan []byte, 512)}
	go instrument.read()
	for {
		fmt.Println(string(<-instrument.send))
	}
	r := mux.NewRouter()
	r.HandleFunc("/", QclHandler)
	http.Handle("/", r)
	http.ListenAndServe(":9000", nil)
}
