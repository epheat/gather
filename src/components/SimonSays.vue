<!-- Simon Says frontend Vue component -->
<!-- g a t h e r -->

<template>
  <div class="component-container">
    <p id="game-ID">Share this code with your friends: {{gameID}}</p>
    <p id="game-message">{{ message }}</p>
    <button id="start-game" class="button-style-1" v-if="mayStartGame" @click="startGame">Start game!</button>

    <div :style="simonButtonStyle" class="simon-button" @click="pressButton"></div>

    <!-- <button @click="debug">debug</button> -->

    <div id="losted" v-if="losted"><h1>You losted.</h1></div>


  </div>
</template>

<script>

import io from "socket.io-client";
import axios from "axios";
var socket = io('/gather');

export default {
  // props are local variables that receive changes from the parent element
  props: ["gameID", "nickname"],
  // in Vue components, data must be a function
  data: function() {
    return {
      color: { red: 0, green: 0, blue: 0 },
      mayStartGame: false,
      message: "Waiting for other players...",
      flashing: false,
      seat: 0,
      playing: false,
      losted: false
    }
  },
  mounted: function() {
    socket.on('message', data => {
      console.log('Incoming message:', data);
      this.mayStartGame = false;
    });
    socket.on('mayStart', data => {
      this.mayStartGame = true;
    });
    socket.on('flash', data => {
      this.flash();
    });
    socket.on('color', color => {
      this.color = color;
      this.message = "";
      this.playing = true;
    });
    socket.on('lose', data => {
      this.losted = true;
      this.playing = false;
    });
    socket.emit('room', {'gameID': this.gameID, 'nick': this.nickname}, seat => {
      this.seat = seat;
    });

  },
  // component methods
  methods: {
    startGame: function() {
      this.mayStartGame = false;
      this.playing = true;
      socket.emit('start', this.gameID);
    },
    flash: function() {
      this.flashing = true;
      setTimeout( () => {
        this.flashing = false;
      }, 100);
    },
    pressButton: function() {
      if (this.playing) {
        this.flash();
        socket.emit('press', {gameID: this.gameID, seat: this.seat} );
      }
    },
    debug: function() {
      this.flash();
    },
  },
  // computed properties are recalculated any time its dependencies are updated
  computed: {
    simonButtonStyle: function() {
      if (this.flashing) {
        return {
          backgroundColor: 'rgb(235, 255, 0)'
        }
      } else {
        return {
          backgroundColor: `rgb(${this.color.red}, ${this.color.green}, ${this.color.blue})`
        }
      }
    }
  }
}
</script>

<style>
.component-container {

}
#game-title, #game-message, #game-ID {
  position: absolute;
  color: white;
  padding: 50px;
}
#game-message {
  margin-top: 65px;
}
#game-ID{
  margin-top: -20px;
}
.simon-button {
  height: 250px;
  background-color: green;
  cursor: pointer;
  height: 100vh;
  transition: background-color 0.05s;
}
.white {
  background-color: rgb(255, 252, 0);
}
#start-game {
  position: absolute;
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
#losted {
  position: absolute;
  color: white;
  left: 5%;
  bottom: 5%;
}
</style>
