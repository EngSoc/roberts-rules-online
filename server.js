var express = require('express');

var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname + '/app/index.html'));
});

http.listen(port, function() {
  console.log('Listening on *:3000');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('message', function(msg) {
    console.log('Received : ' + msg);
    emitAll();
  });
});

function emitAll() {
  io.emit('message', 'A message was received');
}

module.exports = app;
