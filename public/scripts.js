const username = prompt("What is your username?")
// const socket = io('http://localhost:9000'); // the / namespace/endpoint
const port = process.env.PORT || 9000;
const hostName = `http://localhost:${port}`;
const socket = io(hostName);
let nsSocket = null;
//listen for nslist
socket.on('nsList', (namespaceList) => {
    let nameSpaceDiv = document.querySelector('.namespaces');
    nameSpaceDiv.innerHTML = "";
    namespaceList.forEach(nameSpace => {
        nameSpaceDiv.innerHTML += `<div class="namespace" ns="${nameSpace.endpoint}"><img src="${nameSpace.image}"/></div>`
    });
    Array.from(document.getElementsByClassName('namespace')).forEach(eachEndpoint => {
        eachEndpoint.addEventListener('click', (e) => {
            const endpoint = eachEndpoint.getAttribute("ns");
            console.log(endpoint);
            joinNs(endpoint);
        });
        // let nsSocket = io(hostName+nsEle);
    });

});
document.getElementById('user-input').addEventListener('submit', (e) => {
    e.preventDefault();
    let msg = document.getElementById('user-message').value;
    console.log("testing", msg);
    nsSocket.emit('sendMsgToServer', {
        text: msg,
        username: username
    });
});





