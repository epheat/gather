// g a t h e r

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// TODO: replace shortid with our own implementation for simpler, 4-character codes.
var shortid = require('shortid');
shortid.characters('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!?');

// Create an app using Express framework
var app = express();

// Tell express to use the body-parser middleware and to parse extended bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = 8080;
var server = app.listen(port, function () {
  console.log("gather is listening for HTTP requests on port " + port + ".")
});

// serve all files in the public directory
app.use(express.static(path.join(__dirname, 'public')));

var io = require('socket.io')(server);

app.post('/newGame', function(request, response) {
  var gameID = shortid.generate();
  var nick = request.body.nickname;
  var game = request.body.game;

  response.send(gameID);
})
