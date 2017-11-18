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
      <div class="row games-container">
        <div class="game col-xs-6 col-sm-4 col-md-3" v-for="(game, index) in games">
          <h3>{{ game.name }}</h3>
          <button @click="newGame(index)">New Game</button>
        </div>
      </div>
    </div>

    <div id="gamePlayer">
      <h1>{{ gameComponent }}</h1>
      <component :is="gameComponent"></component>
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
        { name: "simon says", gameType: "SimonSays" },
        { name: "pictionary telephone", gameType: "" },
        { name: "random", gameType: "" }
      ]
    }
  },

  methods: {
    newGame: function(index) {
      // use axios to make a newGame http request to the backend
      axios.post('/newGame', { nickname: this.nickname, gameType: this.games[index].gameType, numPlayers: 4 })
      .then( response => {
        console.log(response.data);
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
.game {
  background-color: grey;
  height: 100px;
  display: inline-block;
}
.game h3 {
  margin-top: 2px;
}

</style>
