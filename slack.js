const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);


// io.on = io.of('/').on = io.sockets.on
// io.emit = io.of('/').emit = io.sockets.emit
// when someone connects to '/' namespace we send back namespaces in which that user is in
io.on('connection', (Socket) => {
    let nsData = namespaces.map(ns => ({
        image: ns.img,
        endpoint: ns.endpoint
    }));
    //console.log(nsData);
    Socket.emit('nsList', nsData);
});




// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
    console.log(namespace.endpoint);
    io.of(namespace.endpoint).on('connect', (nsSocket) => {
        console.log(`${nsSocket.id} connected to ${namespace.endpoint}`);
        // emit rooms for this user
        nsSocket.emit('nsRooms', namespace.rooms);
        // join rooms for this user
        nsSocket.on('joinRoom', (obj, numberOfUsersCallback) => {

            //let oldRoomName = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(obj.oldRoomName);
            nsSocket.join(obj.roomName);
            io.of(namespace.endpoint).in(obj.roomName).clients((err, clients) => {
                numberOfUsersCallback(clients.length);
            });
            io.of(namespace.endpoint).in(obj.roomName).clients((err, clients) => {
                // console.log(namespace.rooms);
                console.log(namespace.rooms.filter(eachRoom => {
                    console.log("eachRoom : ", eachRoom);
                    return eachRoom.roomTitle === obj.roomName.trim()
                }));
                // console.log(namespace.rooms.filter(eachRoom => eachRoom.roomTitle === roomName.trim()));
                // console.log("rooms : ", roomName);
                nsSocket.emit('updateMsgs', {
                    history: namespace.rooms.filter(eachRoom => eachRoom.roomTitle === obj.roomName.trim())[0].history
                });
                io.of(namespace.endpoint).in(obj.roomName).emit('updateClients', {
                    clients: clients.length
                });
            });
            io.of(namespace.endpoint).in(obj.oldRoomName).clients((err, clients) => {
                io.of(namespace.endpoint).in(obj.oldRoomName).emit('updateClients', {
                    clients: clients.length
                });
            })
        });
        nsSocket.on('disconnect', () => {
            io.of(namespace.endpoint).clients((err, clients) => {
                io.of(namespace.endpoint).emit('updateNoOfUsersAndMsgs', { clients: clients.length });
            })
        })

        nsSocket.on('sendMsgToServer', (msg) => {
            console.log(msg);
            let fullMsg = {
                text: msg.text,
                image: "https://via.placeholder.com/30",
                name: msg.username,
                date: Date.now()
            }
            let roomName = Object.keys(nsSocket.rooms)[1];
            namespace.rooms.forEach(eachRoom => {
                if (eachRoom.roomTitle === roomName.trim()) {
                    console.log(eachRoom.roomTitle, " :  ", roomName);
                    eachRoom.history.push(fullMsg);
                };
            })
            io.of(namespace.endpoint).in(roomName).emit('sendMsgToClient', fullMsg);
        })
    });
})

