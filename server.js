// g a t h e r

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Create an app using Express framework
var app = express();

// Tell express to use the body-parser middleware and to parse extended bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = 8080;
var server = app.listen(port, function () {
  console.log("gather is listening for HTTP requests on port " + port + ".")
});

// global array of ongoing games
var games = [];

// serve all files in the public directory
app.use(express.static(path.join(__dirname, 'public')));

var io = require('socket.io')(server);
var gatherSocket = io.of('/gather');

gatherSocket.on('connection', socket => {

  socket.on('room', room => {
    socket.join(room);

    console.log("Client ID " + socket.id + " connected to room " + room + ".");
  })

  socket.on('start', gameID => {
    // start the game
    for (var i=0; i<games.length; i++) {
      if (games[i].gameID == gameID) {
        
        games[i].start();
      }
    }
  })

})



function Game(gameType, ownerNick, ownerIP, numPlayers) {
  this.gameType = gameType;
  this.timestamp = Date.now();
  this.gameID = generateID(4);
  this.numPlayers = numPlayers;
  this.players = [{ 'nick': ownerNick, 'ip': ownerIP }];
  // TODO: as long as a game exists with that gameID, keep regenerating IDs

  this.mayStart = function() {
    gatherSocket.in(this.gameID).emit('mayStart');
  }

  this.start = function() {
    if (this.gameType == "SimonSays") {
      console.log("starting game...");
      gatherSocket.in(this.gameID).emit('message', "Beginning the game!");
    } else if (this.gameType == "PictionaryTelephone") {

    }
  }
}
const ALLOWED_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateID(length) {
  var id = "";
  for (var i=0; i<length; i++) {
    var randomCharacterIndex = Math.floor(Math.random() * ALLOWED_CHARACTERS.length);
    id += ALLOWED_CHARACTERS.substring(randomCharacterIndex, randomCharacterIndex+1);
  }
  return id;
}



app.post('/newGame', function(request, response) {
  var game = new Game(request.body.gameType, request.body.nickname, request.connection.remoteAddress, request.body.numPlayers);

  games.push(game);

  response.send(game.gameID);
})

app.post('/joinGame', function(request, response) {
  var gameID = request.body.gameID;
  var nick = request.body.nickname;
  var ip = request.connection.remoteAddress;

  // search for that gameID in currently running games
  for (var i=0; i<games.length; i++) {

    if (games[i].gameID == gameID) {
      if (games[i].players.length < games[i].numPlayers) {
        // add the player to the game
        games[i].players.push({ 'nick': nick, 'ip': ip });
        // send to the client which game is associated with that id
        response.send(games[i].gameType);
        // if this was the final player, start the game
        if (games[i].players.length == games[i].numPlayers) {
          // TODO: allow the game to start
          console.log("emmitting maystart in " + games[i].gameID);
          games[i].mayStart();
        }
      } else {
        response.send('Game full.');
      }
    }
  }

})
