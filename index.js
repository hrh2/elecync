const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"],  // Allow GET and POST methods
        credentials: true
    }
});

let dataStore = [];

// Enable CORS for all routes
app.use(cors({
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"],  // Allow GET and POST methods
    credentials: true
}));

app.use(express.json());

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('all', dataStore);
    socket.on('new_message', (new_data) => {
        dataStore.push(new_data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// POST endpoint for posting data
app.get('/data/:data', (req, res) => {
    try {
        const {data}= req.params;
        // Assuming newData is the sensor data
        dataStore.push(data);
        console.log('New data received:', data);
        return res.status(201).send(data);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// GET endpoint for retrieving data
app.get('/data', async (req, res) => {
    try {
        return res.json(dataStore);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

// Swagger Options
app.use('/', swaggerUi.serve, swaggerUi.setup(require('./app')));

const PORT = process.env.PORT || 5039;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
