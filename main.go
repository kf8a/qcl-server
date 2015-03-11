package main

import (
	// "fmt"
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
			log.Println(err)
			return
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
		log.Println("ZMQ socket error")
		log.Fatal(err)
	}
	defer socket.Close()

	socket.SetSubscribe("")
	socket.Connect("tcp://192.108.190.96:5550")
	for {
		data, err := socket.Recv(0)
		if err != nil {
			log.Println("line 44")
			log.Println(err)
			return
		}
		q.send <- []byte(data)
	}
}

var upgrader = websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

func QclHandler(q *qcl, w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	c := &connection{send: q.send, ws: ws}
	c.reader()
}

func main() {

	instrument := &qcl{send: make(chan []byte, 512)}
	go instrument.read()
	// for {
	// 	fmt.Println(string(<-instrument.send))
	// }
	r := mux.NewRouter()
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		QclHandler(instrument, w, r)
	})
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
	http.Handle("/", r)
	http.ListenAndServe(":9000", nil)
}
