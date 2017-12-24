const username = prompt('Enter your username');

let chat = document.getElementById('chat'),
    status = document.getElementById('status'),
    input = document.getElementById('input');

input.focus();

input.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    const data = input.value;
    if (data === '') return;
    const msg = `${username}:<br>${data}`;
    input.value = '';
    write(msg);
    ws.send(msg);
  }
});

function write(msg) {
  if (msg === `${username}:<br>`) return;
  let line = document.createElement('div');
  line.setAttribute("class", "msgContainer");
  line.innerHTML = '<p class="written">' + msg + '</p>';
  chat.appendChild(line);
  chat.scrollTop = chat.scrollHeight;
}

function recieve(msg) {
  let line = document.createElement('div');
  line.setAttribute("class", "msgContainer");
  line.innerHTML = '<p class="recieved">' + msg + '</p>';
  chat.appendChild(line);
  chat.scrollTop = chat.scrollHeight;
}

function changeStatus(newStatus) {
  status.innerHTML = '<p id="statusValue">' + newStatus + '</p>'
}

<<<<<<< 7925420d10ecf453f84675af2388c4774b90c34d
const ws = new WebSocket('ws://35.189.111.33/chat');
=======
const ws = new WebSocket('ws://192.168.0.105/chat');
>>>>>>> Styled status bar

ws.onopen = () => {
  changeStatus('Online');
};

ws.onclose = () => {
  changeStatus('Waiting for connection...');
  write = null;
};

ws.onmessage = (event) => {
  recieve(event.data);
};
