const express = require('express');
const Performance = require("./models/userModel");
const userRoutes = require('./routes/userRoutes');
const dbConnect = require("./config/dbConnect");
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

dbConnect();

// Set up WebSocket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow requests from this origin
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
  console.log('A client connected');

  // Emit 'dataChange' event whenever there's a change in the database
  const changeStream = Performance.watch();

  changeStream.on('change', (change) => {
    console.log('Database change detected');
    socket.emit('dataChange');
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

app.use('/api/user', userRoutes);

server.listen(PORT, () => {
  console.log("Server is listening on ", PORT);
});
