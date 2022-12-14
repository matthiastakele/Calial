// This file must be in the /api folder for Vercel to detect it as a serverless function
// Add this line at the top
import path from "path";
import type {Request, Response} from 'express';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as userValidator from '../server/user/middleware';
import {userRouter} from '../server/user/router';
import {freetRouter} from '../server/freet/router';
import {likeRouter} from '../server/like/router';
import {commentRouter} from '../server/comment/router';
import {followRouter} from '../server/follow/router';
import {circleRouter} from '../server/circle/router';
import {eventRouter} from '../server/event/router';
import MongoStore from 'connect-mongo';
import { Server } from "socket.io";

// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error('Please add the MongoDB connection SRV as \'MONGO_SRV\'');
}

const client = mongoose
  .connect(mongoConnectionUrl)
  .then(m => {
    console.log('Connected to MongoDB');
    return m.connection.getClient();
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
    throw new Error(err.message);
  });

mongoose.connection.on('error', err => {
  console.error(err);
});

// Initalize an express app
const app = express();

// Set the port
app.set('port', process.env.PORT || 3000);

// Log requests in the terminal
app.use(logger('dev'));

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({extended: false}));

// Initialize cookie session
// https://www.npmjs.com/package/express-session#options
app.use(session({
  secret: '61040', // Should generate a real secret
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: client,
    dbName: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10 // Minutes
  })
}));

// This makes sure that if a user is logged in, they still exist in the database
app.use(userValidator.isCurrentSessionUserExists);

// Add routers from routes folder
app.use('/api/users', userRouter);
app.use('/api/freets', freetRouter);
app.use('/api/likes', likeRouter);
app.use('/api/comments', commentRouter);
app.use('/api/follows', followRouter);
app.use('/api/circles', circleRouter);
app.use('/api/events', eventRouter);

// Add the following lines
const isProduction = process.env.NODE_ENV === 'production';
const vuePath = path.resolve(__dirname, "..", "client", isProduction ? "dist" : "public");
app.use(express.static(vuePath));
app.get("*", (req, res) => {
  res.sendFile(path.join(vuePath, "index.html"));
});

// // Catch all the other routes and display error message
// app.all('*', (req: Request, res: Response) => {
//   res.status(404).json({
//     error: 'Page not found'
//   });
// });

// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Express server running at http://localhost:${app.get('port') as number}`);
});

const io = new Server(server, { // create websocket endpoint so that server & client can talk to each other
  cors: {
      origin: "*",
      methods: ['GET', "POST"]
  }
}); 

const users : { [key: string]: string} = {}; // temporary array to save socketId-username pairs. In practice, use mongodb.

io.on("connection", (socket) => {
  console.log(`user ${socket.id} is connected.`);
  socket.broadcast.emit('join', {
    id: new Date().getTime(),
    text: "A new user joined.",
    username: "Server",
    userId: "",
  });
  users[socket.id] = "Anonymous";

  socket.on("join-room", data => {
    socket.join(data.roomName);
  });

  socket.on("leave-room", data => {
    socket.leave(data.roomName);
  });

  socket.on('message', data => {
    socket.to(data.roomName).emit('message:received', data);
  });

  socket.on('username', data => {
    users[data.userId] = data.newUsername;
    socket.broadcast.emit('username:received', data);
  });

  socket.on('disconnect', () => {
      console.log(`user ${socket.id} left.`);
      socket.broadcast.emit('leave', {
        id: new Date().getTime(),
        text: `User ${users[socket.id]} left.`,
        username: "Server",
        userId: "",
      });
  });
});