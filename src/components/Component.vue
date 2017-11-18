<!-- basic layout for a Vue component -->
<!-- g a t h e r -->

<template>
  <div class="component-container">
    {{ hello }}
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: [],
  // in Vue components, data must be a function
  data: function() {
    return {
      hello: "world"
    }
  },
  // component methods
  methods: {

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
