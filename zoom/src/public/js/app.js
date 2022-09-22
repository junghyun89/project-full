const socket = io();

const welcome = document.querySelector('#welcome');
const nameForm = welcome.querySelector('#nickname');
const roomNameForm = welcome.querySelector('#roomName');
const room = document.querySelector('#room');

let roomName;
room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleNameSubmit(e) {
  e.preventDefault();
  const input = nameForm.querySelector('input');
  const value = input.value;
  socket.emit('nickname', value);
  input.value = '';
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector('#msg input');
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = '';
  });
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = roomNameForm.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

nameForm.addEventListener('submit', handleNameSubmit);
roomNameForm.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user) => {
  addMessage(`${user} joined!`);
});

socket.on('bye', (left) => {
  addMessage(`${left} left`);
});

socket.on('new_message', addMessage);
