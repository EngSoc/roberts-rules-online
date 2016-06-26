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
var FOR = 'For';
var AGAINST = 'Against';
var ABSTAIN = 'Abstain';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname + '/app/index.html'));
});

app.put('/api/v1/queue', function(req, res) {
  console.log(req.body);
  client.rpush(req.body.queue, req.body.name);
  emitAll();
  res.sendStatus(200);
});

app.delete('/api/v1/:queue/:username', function(req, res) {
  console.log(req.body);
  client.lrem(req.params.queue, 0, req.params.username);
  emitAll();
  res.sendStatus(200);
});

app.get('/api/v1/meeting', function(req, res) {
  var values = {};
  Promise.props({
    clarification: client.lrangeAsync(CLARIFICATION, 0, -1),
    newPoint: client.lrangeAsync(NEW_POINT, 0, -1),
    directPoint: client.lrangeAsync(DIRECT_POINT, 0, -1),
    for: client.lrangeAsync(FOR, 0, -1),
    against: client.lrangeAsync(AGAINST, 0, -1),
    abstain: client.lrangeAsync(ABSTAIN, 0, -1)
  })
  .then(function(result) {
    values[CLARIFICATION] = result.clarification;
    values[NEW_POINT] = result.newPoint;
    values[DIRECT_POINT] = result.directPoint;
    values[FOR] = result.for;
    values[AGAINST] = result.against;
    values[ABSTAIN] = result.abstain;
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
