require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// imports
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const commuterRoutes = require('./routes/commuter');
const routeRoutes = require('./routes/route');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/driver', driverRoutes);
app.use('/api/v1/commuter', commuterRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// webSocket for real-time driver locations
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('driverLocation', (data) => {
    io.emit('updateJeepLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));