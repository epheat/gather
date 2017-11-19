<!-- Simon Says frontend Vue component -->
<!-- g a t h e r -->

<template>
  <div class="component-container">
    {{ message }}
    <button v-if="mayStartGame" @click="startGame">Start game!</button>

    <div :style="simonButtonStyle" class="simon-button" @click="pressButton"></div>

    <!-- <button @click="debug">debug</button> -->

    <div v-if="losted">You losted.</div>


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
.simon-button {
  margin: 0 auto;
  max-width: 250px;
  height: 250px;
  background-color: green;
  cursor: pointer;

  transition: background-color 0.05s;
}
.white {
  background-color: rgb(255, 252, 0);
}
</style>
