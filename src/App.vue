<template>
  <div id="app">
    <StatusHeader />
    <div class="headline-container">
      <h1 class="headline">Reactor Controller</h1>
      <SubmitButton/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusHeader from './components/StatusHeader.vue';
import SubmitButton from './components/SubmitButton.vue';

export default defineComponent({
  name: 'App',
  components: {
    StatusHeader,
    SubmitButton,
  },
});
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000000;
    margin-top: 10px;
  }
  .headline-container{
    display: flex;
    align-items: center; /* Vertikale Zentrierung von h1 und SubmitBar */
    gap: 100px; /*Abstand zwischen der Überschrift und den Buttons */
    margin-bottom: 20px; /* Optional: Abstand zum Inhalt darunter */
  }
  .headline{
    font-size: 65px;
  }
</style>
