function joinRoom(roomName, oldRoomName) {
    nsSocket.emit('joinRoom', {roomName:roomName,oldRoomName:oldRoomName}, (newNumberOfUsers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfUsers} <span class="glyphicon glyphicon-user">`;
        document.querySelector('.curr-room-text').innerHTML = roomName;
        console.log(newNumberOfUsers);
    });
};