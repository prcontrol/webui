<template>
  <!--Add experiments by filling out a form -->
  <button class="add-experiment-button" @click="showForm = !showForm"> Test </button>
  <div class="overlay-on-select" v-if="showForm">
    <div class="overlay-container">
    <form @submit.prevent="handleInputSubmit">
      <div>
        <label for="laufende-nr">Laufende Nr.</label>
        <input tid="field1" v-model="formData.field1" type="number" required >
      </div>
      <div>
        <label for="labjournal-entry">Laborjournal Eintrag</label>
        <input id="field2" v-model="formData.field2" type="text" required >
      </div>
      <div>
        <label for="start-date">Datum (Experiment Beginn)</label>
        <input id="field3" v-model="formData.field3" type="date" required >
      </div>
      <div>
        <label for="hardware-config">Konfiguration der Hardware (Version oder laufende Nummer)</label>
        <input id="field4" v-model="formData.field4" type="number" required >
      </div>
      <div>
        <label for="led-front">LED vorne (Laufende Nr. der LED)</label>
        <input id="field5" v-model="formData.field5" type="number" required >
      </div>
      <div>
        <label for="led-front-intensity">LED Intensität vorne</label>
        <input id="field6" v-model="formData.field6" type="number" required >
      </div>
      <div>
        <label for="led-front-intensity-percent">LED vorne Intensität in % </label>
        <input id="field7" v-model="formData.field7" type="number" required >
      </div>
      <div>
        <label for="led-front-distance-to-vial">Abstand LED vorne zu Vial (cm) </label>
        <input id="field8" v-model="formData.field8" type="number" required >
      </div>
    </form>
    <div class="form-buttons">
      <button @click="submitForm">Submit</button>
      <button @click="closeForm">Close</button>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'AddExperiment',
   data(){
    return {
      showForm: false,
      formData: {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
      }
    };
   },
   methods: {
    closeForm(){
      this.showForm = false;
    },
    async submitForm(){
      const jsonFile = new Blob([JSON.stringify(this.formData)], {
          type: 'application/json',
        });

      const uploadJSON = new FormData();
      uploadJSON.append('file', jsonFile, '${this.formData.field1}.json');

      axios.post('upload_experiment_config', uploadJSON, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })


      this.showForm = false;
    }
   }
});
</script>

<style scoped>
  .overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Leicht verblasster Hintergrund */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* Überlagert den Inhalt */
}
.overlay-container {
  background-color: white;
  padding: 20px;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}
</style>
