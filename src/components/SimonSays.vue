<!-- Simon Says frontend Vue component -->
<!-- g a t h e r -->

<template>
  <div class="component-container">
    {{ message }}
    <button v-if="mayStartGame" @click="startGame">Start game!</button>

    <div id="simon-button"></div>
  </div>
</template>

<script>

import io from "socket.io-client";
import axios from "axios";
var socket = io('/gather');

export default {
  // props are local variables that receive changes from the parent element
  props: ["gameID"],
  // in Vue components, data must be a function
  data: function() {
    return {
      color: { red: 0, green: 0, blue: 0 },
      mayStartGame: false,
      message: "Waiting for other players..."
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

    });
    socket.emit('room', this.gameID);
  },
  // component methods
  methods: {
    startGame: function() {
      this.mayStartGame = false;
      socket.emit('start', this.gameID);
    }
  },
  // computed properties are recalculated any time its dependencies are updated
  computed: {

  }
}
</script>

<style>
.component-container {

}
</style>
