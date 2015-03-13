package main

import (
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type connection struct {
	ws   *websocket.Conn
	send chan []byte
	q    *qcl
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

var upgrader = websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

func QclHandler(q *qcl, w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	c := &connection{send: make(chan []byte), ws: ws, q: q}
	c.q.register <- c
	defer func() { c.q.unregister <- c }()
	c.reader()
}

func main() {
	var host = "127.0.0.1"
	instrument := newQcl("tcp://" + host + ":5550")
	go instrument.read()

	r := mux.NewRouter()
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		QclHandler(instrument, w, r)
	})
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}
