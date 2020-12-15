var app = require('express')(8000);
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');

app.use("/application",express.static('public'));

http.listen(8000, () => console.log(`Server listening on port: 8000`));

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        console.log("New user ", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
})
