function joinNs(ns) {

    if (nsSocket && ns !== nsSocket.nsp) {
        nsSocket.close();
        nsSocket = io(hostName + ns);
    }
    if (!nsSocket) {
        nsSocket = io(hostName + ns);
    }
    console.log(nsSocket);
    nsSocket.on('nsRooms', (rooms) => {

        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        rooms.forEach(room => {
            roomList.innerHTML += '';
            let lock;
            if (room.privateRoom) {
                lock = 'lock';
            }
            else {
                lock = 'globe';
            }
            roomList.innerHTML += `<li class="room"><span class='glyphicon glyphicon-${lock}'>  <span/>${room.roomTitle}</l1>`;
        });
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach(eachRoom => {
            eachRoom.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("top room : ", eachRoom.getElementsByTagName('span')[1].innerText);
                let newRoom = eachRoom.getElementsByTagName('span')[1].innerText;
                let currentRoom = document.querySelector('.curr-room-text').innerText;
                console.log("currentRoom : ",currentRoom)
                if (newRoom !== currentRoom) {
                    joinRoom(newRoom, currentRoom);
                }

            });
        });
        // const topRoomName = document.querySelector('.room').innerText;
        // console.log("top room : ", document.querySelector('.room'));

    });

    nsSocket.on('sendMsgToClient', (msg) => {
        document.getElementById('messages').innerHTML += buildHtml(msg);
    });
    nsSocket.on('updateNoOfUsersAndMsgs', (obj) => {
        console.log(obj);
        document.querySelector('.curr-room-num-users').innerHTML = `${obj.clients} <span class="glyphicon glyphicon-user">`;
    });

    nsSocket.on('updateClients', (obj) => {
        console.log("updateClients:  ", obj);
        document.querySelector('.curr-room-num-users').innerHTML = `${obj.clients} <span class="glyphicon glyphicon-user">`;
    })
    nsSocket.on('updateMsgs', (obj) => {
        console.log("updateMsg: ", obj);
        document.getElementById('messages').innerHTML = '';
        obj.history.forEach(eachMsg => {
            document.getElementById('messages').innerHTML += buildHtml(eachMsg);
        })
    });

}


const buildHtml = (msg) => {
    let newHTML = `<li>
    <div class="user-image">
        <img src="${msg.image}" />
    </div>
    <div class="user-message">
<div class="user-name-time">${msg.name} <span>${new Date(msg.date).toLocaleString()}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>`
    return newHTML;
}