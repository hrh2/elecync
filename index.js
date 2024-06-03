const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let dataStore = [];

app.use(express.json());
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('all',dataStore)
    socket.on('new_message', (new_data) => {
        dataStore.push(new_data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// POST endpoint for posting data
app.post('/data', (req, res) => {
    const newData = req.body;
    // Assuming newData is the sensor data
    dataStore.push(newData);
    console.log('New data received:', newData);
    res.status(201).send('Data received');
});

// GET endpoint for retrieving data
app.get('/data', (req, res) => {
    res.json(dataStore);
});

// Swagger Options

// const specs = swaggerJsdoc(require('./app.js'));
app.use('/', swaggerUi.serve, swaggerUi.setup(require('./app')));

const PORT = process.env.PORT || 5039;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
