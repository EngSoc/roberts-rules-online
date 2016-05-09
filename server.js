var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var redis = require('redis');
var client;
if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL);
} else {
  client = redis.createClient();
}
var bodyParser = require('body-parser')
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
Promise = bluebird.Promise;

client.on("error", function (err) {
    console.log("Error " + err);
});

var port = process.env.PORT || 3000;

var CLARIFICATION = 'Clarification';
var NEW_POINT = 'New Point';
var DIRECT_POINT = 'Direct Point';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname + '/app/index.html'));
});

app.put('/api/v1/queue', function(req, res) {
  console.log(req.body);
  client.sadd(req.body.queue, req.body.name);
  emitAll();
  res.sendStatus(200);
});

app.delete('/api/v1/:queue/:username', function(req, res) {
  console.log(req.body);
  client.srem(req.params.queue, req.params.username);
  emitAll();
  res.sendStatus(200);
});

app.get('/api/v1/meeting', function(req, res) {
  var values = {};
  Promise.props({
    clarification: client.smembersAsync(CLARIFICATION),
    newPoint: client.smembersAsync(NEW_POINT),
    directPoint: client.smembersAsync(DIRECT_POINT)
  })
  .then(function(result) {
    values[CLARIFICATION] = result.clarification;
    values[NEW_POINT] = result.newPoint;
    values[DIRECT_POINT] = result.directPoint;
    res.send(JSON.stringify(values));
  })
  .catch(function(err) {
    console.log(err);
  });
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
  io.emit('pull', 'should pull data');
}

module.exports = app;
