function Card(index) {
  this.suit = Math.floor(index / 13);
  this.value = (index % 13) + 1;
  this.img = suit + value + ".png"; // TODO: change this probably
}

function Deck() {
  this.cards = [];
  for (var i=0; i<52; i++) {
    this.cards.push(new Card(i));
  }
  this.draw = function() {
    return this.cards.pop();
  }
}

function Hand() {
  this.cards = [];

  this.addCard = function(card) {
    this.cards.push(card);
  }
  this.discard = function(index) {
    this.cards.splice(index, 1);
  }
}
