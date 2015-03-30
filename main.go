package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net/http"
	"os"
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

type datum struct{}

func SaveDataHanlder(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var data map[string]interface{}
	err := decoder.Decode(&data)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println(data)
	// save data
	f, err := os.Open("data.json")
	if err != nil {
		log.Println(err)
		return
	}
	defer f.Close()
	io.Copy(f, r.Body)

	http.Redirect(w, r, "/", http.StatusFound)
}

func main() {
	var test bool
	flag.BoolVar(&test, "test", false, "use a random number generator instead of a live feed")
	flag.Parse()

	var host = "127.0.0.1"
	instrument := newQcl("tcp://" + host + ":5550")
	go instrument.read(test)

	r := mux.NewRouter()
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		QclHandler(instrument, w, r)
	})
	r.HandleFunc("/save", func(w http.ResponseWriter, r *http.Request) {
		SaveDataHanlder(w, r)
	})
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}
