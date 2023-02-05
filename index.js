require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const { Server } = require("socket.io");
const { readFileSync } = require("fs");
const port = process.env.PORT || 20232;
const HomeRouter = require('./App/Routes/HomeRouter');
const AuthRouter = require('./App/Routes/AuthRouter');
const DashboardRouter = require('./App/Routes/DashboardRoute');
const EventController = require('./App/Controllers/EventController');
let server = null;

if(process.env.SSL_ENABLED === "true"){
    server = https.createServer({
        key: readFileSync(process.env.SSL_KEY),
        cert: readFileSync(process.env.SSL_CERT)
    },app);
}else{
    server = http.createServer(app);
}

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    let clientEventName = '';
    socket.on('socket_client_config', async (config) => {
        let event = await EventController.matchEvent(config) || {};
        if(Object.keys(event).length > 0){
            clientEventName = config.event_name;
            socket.on(config.event_name, (msg) => {
                io.emit(config.event_name, msg);
            });
        }
    });
    io.on('disconnect', () => {
        socket.removeAllListeners('socket_client_config');
        if(clientEventName !== ''){
            socket.removeAllListeners(clientEventName);
        }
    });
});

app.set('view engine', 'ejs');
app.set('views', './App/Views');
app.set('socketIO', io);

app.use(cors());
app.use('/', HomeRouter);
app.use('/auth', AuthRouter);
app.use('/dashboard', DashboardRouter);

server.listen(port, () => {
    console.log('listening on port ' + port);
});