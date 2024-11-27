<template>
  <div id="app">
    <StatusHeader />
    <div class="content">
      <div class="headline-container">
        <h1 class="headline">Reactor Controller</h1>
        <div class="file-container">
          <div class="align-file-container">
            <AddExperiment/>
            <SubmitButton/>
          </div>
        </div>
      </div>
      <div class="lanes-container">
        <ReactorLane title="Lane 1"/>
        <ReactorLane title="Lane 2"/>
        <ReactorLane title="Lane 3"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusHeader from './components/StatusHeader.vue';
import SubmitButton from './components/SubmitButton.vue';
import ReactorLane from './components/ReactorLane.vue';
import AddExperiment from './components/AddExperiment.vue'

export default defineComponent({
  name: 'App',
  components: {
    StatusHeader,
    SubmitButton,
    ReactorLane,
    AddExperiment,
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
  .content{
    padding: 20px;
  }
  .headline-container{
    display: flex;
    align-items: center; /* Vertikale Zentrierung von h1 und SubmitBar */
    gap: 100px; /*Abstand zwischen der Überschrift und den Buttons */
    margin-bottom: 20px; /* Optional: Abstand zum Inhalt darunter */
  }
  .headline{
    font-size: 65px;
    margin: 0;
  }
  .file-container{
    position: absolute;
    right: 0;
    margin-right: 50px;
    margin-top: 20px; /*verschiebt den file-container nach unten*/
  }
  .lanes-container {
    display: flex;
    gap: 20px; /* Abstand zwischen den Lanes */
    justify-content: center;
    margin-top: 20px;
}
.align-file-container{
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>
