import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();

app.use('/api/auth', authRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', userRoutes);

app.listen(8800, () => {
  console.log('API working!');
});
