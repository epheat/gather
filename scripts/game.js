function Game() {
  this.gameID = generateID(4);
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
