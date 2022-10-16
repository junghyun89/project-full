const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

router.post('/room', async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
      members: req.session.color,
    });
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    if (newRoom.password) {
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/user', async (req, res, next) => {
  try {
    await User.create({
      socket: req.body.socket,
      name: req.body.name,
      room: req.body.room,
    });
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(`/user`, async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.query.name });
    res.send({ socket: user.socket });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete(`/user`, async (req, res, next) => {
  try {
    await User.remove({ name: req.query.name });
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room/:id/owner', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    res.send({ owner: room.owner });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room/:id/users', async (req, res, next) => {
  try {
    const users = await User.find({ room: req.params.id }, 'name');
    res.send(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      return res.redirect(`/?error=존재하지 않는 방입니다.`);
    }
    // 강퇴당한 사람인지
    if (room.password && room.password !== req.query.password) {
      return res.redirect(`/?error=비밀번호가 틀렸습니다.`);
    }
    const { rooms } = io.of('/chat').adapter;
    if (
      rooms &&
      rooms[req.params.id] &&
      room.max <= rooms[req.params.id].length
    ) {
      return res.redirect(`/?error=허용 인원을 초과했습니다.`);
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    const users = await User.find({ room: req.params.id }, 'name');
    const owner = room.owner;

    return res.render('chat', {
      room,
      title: room.title,
      chats: chats,
      user: req.session.color,
      number:
        (rooms && rooms[req.params.id] && rooms[req.params.id].length + 1) || 1,
      users:
        (rooms && rooms[req.params.id] && rooms[req.params.id].length + 1) === 1
          ? owner
          : users,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.patch('/room/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ room: req.params.id });
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id },
      {
        owner: user.name,
      },
      {
        new: true,
      }
    );
    res.send(room.owner);
    req.app.get('io').of('/room').emit('leaveRoom', room.owner);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    await User.remove({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
