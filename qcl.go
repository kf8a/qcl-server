package main

import (
	zmq "github.com/pebbe/zmq4"
	"log"
)

type qcl struct {
	connections map[*connection]bool
	register    chan *connection
	unregister  chan *connection
	socket      zmq.Socket
	// send        chan []byte
	host string
}

func newQcl(hostName string) *qcl {
	return &qcl{
		connections: make(map[*connection]bool),
		register:    make(chan *connection),
		unregister:  make(chan *connection),
		host:        hostName,
	}
}

func (q *qcl) read() {
	for {
		socket, err := zmq.NewSocket(zmq.SUB)
		if err != nil {
			log.Println("ZMQ socket error", err)
		}
		defer socket.Close()

		socket.SetSubscribe("")
		socket.Connect(q.host)
		for {
			data, err := socket.Recv(0)
			if err != nil {
				log.Println("Read error", err)
				socket.Close()
				break
			}
			select {
			case c := <-q.register:
				q.connections[c] = true
			case c := <-q.unregister:
				q.connections[c] = false
			default:
				for c := range q.connections {
					select {
					case c.send <- []byte(data):
					default:
						delete(q.connections, c)
						close(c.send)
					}
				}
			}
		}
	}
}
