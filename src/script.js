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
  status.innerHTML = '<p>' + newStatus + '</p>'
}

const ws = new WebSocket('ws://192.168.43.44/chat');

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
