const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);
  const room = io.of('/room');
  const chat = io.of('/chat');

  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(
      socket.request,
      socket.request.res,
      next
    );
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', async (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?,+/, '');
    socket.join(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
      number: socket.adapter.rooms[roomId].length,
    });

    const signedCookie = req.signedCookies['connect.sid'];
    const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);
    await axios.post(`http://localhost:8005/user`, {
      socket: socket.id,
      name: req.session.color,
      room: roomId,
      headers: {
        Cookie: `connect.sid=s%3A${connectSID}`,
      },
    });
    console.log('사용자 생성 요청 성공');

    socket.on('disconnect', async () => {
      try {
        console.log('chat 네임스페이스 접속 해제');
        socket.leave(roomId);
        const currentRoom = socket.adapter.rooms[roomId];
        const userCount = currentRoom ? currentRoom.length : 0;

        const response = await axios.get(
          `http://localhost:8005/room/${roomId}/owner`,
          {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
          }
        );
        const owner = response.data.owner;
        if (req.session.color === owner) {
          return await axios.patch(`http://localhost:8005/room/${roomId}`, {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
            newOwner: '',
          });
        }
        if (userCount === 0) {
          await axios.delete(`http://localhost:8005/room/${roomId}`, {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
          });
          console.log('방 제거 요청 성공');
        } else {
          socket.to(roomId).emit('exit', {
            user: 'system',
            chat: `${req.session.color}님이 퇴장하셨습니다.`,
            number: socket.adapter.rooms[roomId].length,
          });
          await axios.delete(`http://localhost:8005/user`, {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
            params: {
              name: req.session.color,
            },
          });
          console.log('사용자 제거 요청 성공');
        }
      } catch (error) {
        console.error(error);
      }
    });
    socket.on('ban', async (data) => {
      try {
        const user = await axios.get(`http://localhost:8005/user`, {
          headers: {
            Cookie: `connect.sid=s%3A${connectSID}`,
          },
          params: {
            name: data.id,
          },
        });
        socket.to(user.data.socket).emit('ban');
      } catch (error) {
        console.error(error);
      }
    });
  });
};
