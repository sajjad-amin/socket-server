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

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './App/Views');

app.use('/', HomeRouter);
app.use('/auth', AuthRouter);
app.use('/dashboard', DashboardRouter);

io.on('connection', (socket) => {
    socket.on('saws', (msg) => {
        io.emit('saws', msg);
    });
});

server.listen(port, () => {
    console.log('listening on port ' + port);
});