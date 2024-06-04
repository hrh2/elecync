const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const connect = require('./db/connect')
const signupRoute = require('./controllers/Signup')
const loginRoute = require('./controllers/Login')
const meterRoute = require('./controllers/Meter')

connect()
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
app.use('/auth/signup',signupRoute)
app.use('/auth/login',loginRoute)
app.use('/meter',meterRoute)

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.emit('all', dataStore);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


// POST endpoint for posting data
// POST endpoint for posting data
app.post('/data', (req, res) => {
    try {
        const newData = req.body;
        // Assuming newData is the sensor data
        
        dataStore.push(newData);
        console.log('New data received:', newData);
        io.emit('new_data', newData); // emit new_data event
        return res.status(201).send(newData);
    } catch (error) {
        return res.status(500).json(error.message);
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
