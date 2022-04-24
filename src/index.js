const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app =  express()

const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')


app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket Connection');

    socket.emit('Messages','Welcome!');
    socket.broadcast.emit('Messages','A new user has joined!');

    socket.on('newMessage',(message)=>{
        io.emit('Messages',message)
    })
    socket.on('sendLocation',(coords)=>{
        io.emit('Messages',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })
    socket.on('disconnect',()=>{
        io.emit('Messages','A user has left')
    })
    
})

server.listen(port,()=>{
    console.log('Server is up on port '+port);
})