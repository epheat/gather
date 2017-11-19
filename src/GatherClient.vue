<template>
  <div id="app">
    <div id="game-selector" v-if="!playingGame">
      <h1>Gather</h1><hr>
      <p>
        Provide a Nickname:
        <input type="text" placeholder="Username (Required)" v-model="nickname"></input>
      </p>
      <p>
        Join an Existing Game:
        <input type="text" placeholder="Game ID" v-model="gameID"></input>
        <button @click="joinGame()">Join</button>
      </p>
      <h2>Or Start a New Game:</h2>
      <p>
        Search Game:
        <input type="text" id="searchGame" placeholder="Search Game" v-model="searchTerm"></input>
      </p>
      <div class="games-container">
        <div class="game-container col-xs-12 col-sm-6 col-md-4" v-for="(game, index) in filteredGameList">
          <div class="game" :style='"background: url(" + game.img + ") #000; background-size: 100%;"'>
            <h3>{{ game.name }}</h3>
            <b>Number of players</b>
            <select id="numPlayers" v-model="game.numPlayers">
              <option value=2>2</option>
              <option value=3>3</option>
              <option value=4>4</option>
              <option value=5>5</option>
              <option value=6>6</option>
            </select>
            <br>
            <button class="button-style-1" @click="newGame(index)">New Game</button>
          </div>
        </div>
      </div>
    </div>

    <div id="gamePlayer">
      <h1>{{ gameComponent }}</h1>
      <component :is="gameComponent" :gameID="gameID" :nickname="nickname"></component>
    </div>

  </div>
</template>

<script>

import axios from 'axios';
import SimonSays from './components/SimonSays.vue';
import PictionaryTelephone from './components/PictionaryTelephone.vue';
// import other game frontends here

export default {
  name: 'app',
  data () {
    return {
      nickname: "",
      playingGame: false,
      gameComponent: "",
      gameID: "",
      games: [
        { name: "Simon Says", gameType: "SimonSays", numPlayers: 2, img: 'simon.png' },
        { name: "Pictionary Telephone", gameType: "", numPlayers: 2, img: 'pictionary.png' },
        { name: "Go Fish", gameType: "", numPlayers: 2, img: 'gofish.png' },
        { name: "Poker", gameType: "", numPlayers: 2, img: 'poker.png' },
        { name: "Roulette", gameType: "", numPlayers: 2, img: 'roulette.png' },
        { name: "Blackjack", gameType: "", numPlayers: 2, img: 'blackjack.png' }
      ],
      searchTerm: ""
    }
  },

  methods: {
    newGame: function(index) {
      // use axios to make a newGame http request to the backend
      console.log(this.games[index].numPlayers)
      axios.post('/newGame', { nickname: this.nickname, gameType: this.games[index].gameType, numPlayers: this.games[index].numPlayers })
      .then( response => {
        console.log(response.data);
        this.gameID = response.data;
        this.gameComponent = this.games[index].gameType;
        this.playingGame = true;
      })
      .catch( error => {
        console.log(error);
      })
    },
    joinGame: function() {
      // use axios to make a joinGame http request to the backend
      axios.post('/joinGame', { gameID: this.gameID, nickname: this.nickname })
      .then( response => {
        console.log(response.data);
        this.gameComponent = response.data;
        this.playingGame = true;
      })
      .catch( error => {
        console.log(error);
      })
    }
  },

  computed: {

    // whenever you start searching for a game, in real time it reduces down to the game you've searched for
    filteredGameList: function() {
      return this.games.filter(game => {
        var gameName = game.name.toLowerCase() // disregard capitalization filter results
        return gameName.includes(this.searchTerm);
      })
    }
  },

  components: {
    'SimonSays': SimonSays,
    'PictionaryTelephone': PictionaryTelephone
  }
}
</script>

<style scoped>
#app {
  text-align: center;
}
.games-container {
  padding-top: 5px;
}

.game-container {
  padding: 5px; /* center everything in game square */
}

.game-container h3 {
  padding-top: 50px;
}

.button-style-1 {
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  color: #fff;
  background-color: #2ECC71;
  border-bottom: 4px solid #27AE60;
  transition: 300ms;
}
.button-style-1:hover, .button-style-1:focus {
  background-color: #2d72e2;
  border-bottom: 4px solid #2055aa;
  transform: scale(1.1);
  cursor: pointer;
}
.game {
  height: 250px;
  box-shadow: 1px 1px 10px #666;
  color: white;
}
select {
  color: black;
}

.game h3 {
  margin-top: 2px;
}

</style>
