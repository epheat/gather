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
        <input type="text"></input>
        <button>Join</button>
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
// import other game frontends here

export default {
  name: 'app',
  data () {
    return {
      nickname: "",
      playingGame: false,
      gameComponent: "",
      games: [
        { name: "simon says", component: "SimonSays" },
        { name: "pictionary telephone", component: "" },
        { name: "random", component: "" }
      ]
    }
  },

  methods: {
    newGame: function(index) {
      // TODO: use axios to make a newGame http request to the backend
      axios.post('/newGame', { nickname: this.nickname, game: this.games[index].name })
      .then( response => {
        console.log(response.data);
        this.gameComponent = this.games[index].component;
        this.playingGame = true;
      })
      .catch( error => {
        console.log(error);
      })
    }
  },

  components: {
    'SimonSays': SimonSays
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
