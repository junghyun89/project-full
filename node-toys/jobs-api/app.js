require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./src/db/connect');

//routers
const authRouter = require('./src/routes/auth');
const jobsRouter = require('./src/routes/jobs');

// error handler
const notFoundMiddleware = require('./src/middleware/not-found');
const errorHandlerMiddleware = require('./src/middleware/error-handler');

app.use(express.json());

// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};
start();
