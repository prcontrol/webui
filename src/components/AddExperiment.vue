<template>
  <!--Add experiments by filling out a form -->
  <button class="add-experiment-button" @click="showForm = !showForm">Form</button>
  <div class="overlay-on-select" v-if="showForm">
    <div class="overlay-container">
    <form @submit.prevent="handleInputSubmit">
      <div class="arrange-content">
      <div class="left-content">
      <div class="input-container">
        <label for="laufende-nr">Laufende Nr.</label>
        <input tid="field1" v-model="formData.field1" type="number" required >
      </div>
      <div class="input-container">
        <label for="labjournal-entry">Laborjournal Eintrag</label>
        <input id="field2" v-model="formData.field2" type="text" required >
      </div>
      <div class="input-container">
        <label for="start-date">Datum (Experiment Beginn)</label>
        <input id="field3" v-model="formData.field3" type="date" required >
      </div>
      <div class="input-container">
        <label for="hardware-config">Konfiguration der Hardware (Version oder laufende Nummer)</label>
        <input id="field4" v-model="formData.field4" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front">LED vorne (Laufende Nr. der LED)</label>
        <input id="field5" v-model="formData.field5" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-intensity">LED Intensität vorne</label>
        <input id="field6" v-model="formData.field6" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-intensity-percent">LED vorne Intensität (%) </label>
        <input id="field7" v-model="formData.field7" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-distance-to-vial">Abstand LED vorne zu Vial (cm) </label>
        <input id="field8" v-model="formData.field8" type="number" required >
      </div>
      </div>
      <!-- weiter ab hier -->
       <div class="right-content">
      <div class="input-container">
        <label for="led-front-belichtungsdauer">Belichtungsdauer LED vorne (min) </label>
        <input id="field9" v-model="formData.field9" type="time" required >
      </div>
      <div class="input-container">
        <label for="led-back">LED hinten (Laufende Nr. der LED) </label>
        <input id="field10" v-model="formData.field10" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-intensity">LED Intensität hinten</label>
        <input id="field11" v-model="formData.field11" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-intensity-percent">LED hinten Intensität (%) </label>
        <input id="field12" v-model="formData.field12" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-distance-to-vial">Abstand LED hinten zu Vial (cm)  </label>
        <input id="field13" v-model="formData.field13" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-belichtungsdauer">Belichtungsdauer LED vorne (min) </label>
        <input id="field14" v-model="formData.field14" type="time" required >
      </div>
      <div class="input-container">
        <label for="pos-thermocouple">Position des Thermocouples </label>
        <input id="field15" v-model="formData.field15" type="text" required>
      </div>
      <div class="input-container">
        <label for="size-probe">Größe Probengefäß (mL)</label>
        <input id="field16" v-model="formData.field16" type="number" required >
      </div>
      <div class="input-container">
        <label for="parallel-experiments">Parallele Experimente (Laufende Nr.) </label>
        <input id="field17" v-model="formData.field17" type="text" required >
      </div>
      </div>
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
import axios from 'axios';

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

    resetForm(){
      Object.keys(this.formData).forEach((key) => {
      this.formData[key] = '';
      });
    },

    async submitForm(){
      if (!this.formData.field1) {
        alert("Bitte das Feld 'Laufende Nr.' Ausfüllen."); // Sicherheitsabfrage
        return;
      }

      const jsonFile = new Blob([JSON.stringify(this.formData)], {
          type: 'application/json',
        });

      const uploadJSON = new FormData();
      uploadJSON.append('file', jsonFile, "formData.json");
      //replace path with backend path
      axios.post('some_path', uploadJSON, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).catch((err) => {
        console.log(`Fehler beim hochladen: ${err}`)
      })


      closeForm();
    }
   }
});
</script>

<style scoped>
  .add-experiment-button{
    background-color: white;
    color: rgb(0, 0, 0);
    border: none;
    font-size: 20px;
  }

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
  width: 800px;
  height: auto;
}

.left-content, .right-content {
  flex: 1; /* Gleiche Breite für beide Inhalte */
}

.left-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Abstand zwischen den Feldern */
}

.right-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Abstand zwischen den Feldern */
}
.arrange-content{
  display: flex;
  flex-direction: row;
  gap: 20px; /* Abstand zwischen den Spalten */

}


/* Container für ein einzelnes Eingabefeld und Label */
.input-container {
  display: flex;
  flex-direction: column; /* Label oben, Input unten */
  align-items: flex-start; /* Links ausrichten */
  margin-bottom: 5px; /* Abstand zwischen den Feldern */
}

.input-container label {
  font-size: 15px; /* Schriftgröße des Labels */
  margin-bottom: 5px; /* Abstand zwischen Label und Input */
  text-align: left; /* Links ausgerichtet */
}

.input-container input,
.input-container select {
  width: 100%; /* Eingabefelder passen sich der verfügbaren Breite an */
  max-width: auto; /* Optional: maximale Breite */
  box-sizing: border-box; /* Padding in die Gesamtbreite einbeziehen */
}

.form-buttons{
  display: flex;
  justify-content: center;
  gap: 20px;
  background-color: white;
  border: none;
}

</style>
