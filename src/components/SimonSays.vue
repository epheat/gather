<!-- Simon Says frontend Vue component -->
<!-- g a t h e r -->

<template>
  <div class="component-container">
    {{ message }}
    <button v-if="mayStartGame" @click="startGame">Start game!</button>

    <div :style="simonButtonStyle" class="simon-button" @click="pressButton"></div>

    <button @click="debug">debug</button>
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
      flashing: false
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
    })
    socket.emit('room', {'gameID': this.gameID, 'nick': this.nickname});
  },
  // component methods
  methods: {
    startGame: function() {
      this.mayStartGame = false;
      socket.emit('start', this.gameID);
    },
    flash: function() {
      this.flashing = true;
      setTimeout( () => {
        this.flashing = false;
      }, 200);
    },
    pressButton: function() {
      socket.emit('press');
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
  max-width: 200px;
  height: 200px;
  background-color: green;

  transition: background-color 0.2s;
}
.white {
  background-color: rgb(255, 252, 0);
}
</style>
