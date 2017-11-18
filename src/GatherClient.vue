<template>
  <div id="app">
    <div id="game-selector" v-if="!playingGame">
      <h1>Gather</h1><hr>
      <p>
        Provide a nickname:
        <input type="text" v-model="nickname"></input>
      </p>
      <p>
        Join an existing game:
        <input type="text" v-model="gameID"></input>
        <button @click="joinGame()">Join</button>
      </p>
      <h2>Or start a new game:</h2>
      <p>
        Search Game:
        <input type="text" id="searchGame" v-model="searchTerm"></input>
      </p>
      <div class="row games-container">
        <div class="game-container col-xs-12 col-sm-6 col-md-4" v-for="(game, index) in filteredGameList">
          <div class="game">
            <h3>{{ game.name }}</h3>
            <b>Number of players</b>
            <select id="numPlayers">
              <option value=2>2</option>
              <option value=3>3</option>
              <option value=4>4</option>
              <option value=5>5</option>
              <option value=6>6</option>
            </select>
            <br>
            <button @click="newGame(index)">New Game</button>
          </div>
        </div>
      </div>
    </div>

    <div id="gamePlayer">
      <h1>{{ gameComponent }}</h1>
      <component :is="gameComponent" :gameID="gameID"></component>
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
        { name: "Simon Says", gameType: "SimonSays" },
        { name: "Pictionary Telephone", gameType: "" },
        { name: "Go Fish", gameType: "" },
        { name: "Poker", gameType: "" },
        { name: "Roullete", gameType: "" }
      ],
      searchTerm: ""
    }
  },

  methods: {
    newGame: function(index) {
      // use axios to make a newGame http request to the backend
      axios.post('/newGame', { nickname: this.nickname, gameType: this.games[index].gameType, numPlayers: 4 })
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
        return game.name.includes(this.searchTerm);
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

.game {
  background-color: grey;
  height: 250px;
}
.game h3 {
  margin-top: 2px;
}

</style>
