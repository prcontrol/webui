<template>
  <div class="overlay-on-select" >
    <div class="overlay-container">
    <h2>Experiment anlegen</h2>
    <form @submit.prevent="handleInputSubmit">
      <div class="arrange-content">
      <div class="left-content">
      <div class="input-container">
        <label for="laufende-nr">Laufende Nr.</label>
        <input tid="uid" v-model="formData.uid" type="number" required >
      </div>
      <div class="input-container">
        <label for="start-date">Datum (Experiment Beginn)</label>
        <input id="date" v-model="formData.date" type="date" required >
      </div>
      <div class="input-container">
        <label for="hardware-config">Konfiguration der Hardware (Version oder laufende Nummer)</label>
        <input id="config_file" v-model="formData.config_file" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front">LED vorne (Laufende Nr. der LED)</label>
        <input id="led_front" v-model="formData.led_front" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-intensity">LED Intensität vorne</label>
        <input id="led_front_intensity" v-model="formData.led_front_intensity" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-distance-to-vial">Abstand LED vorne zu Vial (cm) </label>
        <input id="led_front_distance_to_vial" v-model="formData.led_front_distance_to_vial" type="number" required >
      </div>
      </div>

      <div class="right-content">
      <div class="input-container">
        <label for="led-front-belichtungsdauer">Belichtungsdauer LED vorne (min) </label>
        <input id="led_front_exposure_time" v-model="formData.led_front_exposure_time" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back">LED hinten (Laufende Nr. der LED) </label>
        <input id="led_back" v-model="formData.led_back" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-intensity">LED Intensität hinten</label>
        <input id="led_back_intensity" v-model="formData.led_back_intensity" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-distance-to-vial">Abstand LED hinten zu Vial (cm)  </label>
        <input id="led_back_distance_to_vial" v-model="formData.led_back_distance_to_vial" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-belichtungsdauer">Belichtungsdauer LED vorne (min) </label>
        <input id="led_back_exposure_time" v-model="formData.led_back_exposure_time" type="number" required >
      </div>
      <div class="input-container">
        <label for="pos-thermocouple">Position des Thermocouples </label>
        <input id="position_thermocouple" v-model="formData.position_thermocouple" type="text" required>
      </div>
      <div class="input-container">
        <label for="time-points-sample-taking">Ereignis zu Zeitpunkt X</label>
        <input id="time_points_sample_taking" v-model="formData.time_points_sample_taking" type="text" required>
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
import { defineComponent, ref, onMounted, onBeforeUnmount} from 'vue';
import axios from 'axios';

export default defineComponent({
   name: 'AddExperiment',
   emits: ['close-form'],

   setup(_,{emit}){
      const showForm = ref(false);
      const formData = ref({
        uid: '',
        date: '',
        config_file: '',
        led_front: '',
        led_front_intensity: '',
        led_front_distance_to_vial: '',
        led_front_exposure_time: '',
        led_back: '',
        led_back_intensity: '',
        led_back_distance_to_vial: '',
        led_back_exposure_time: '',
        time_points_sample_taking: '',
        position_thermocouple: '',
      });

      const closeForm = () => {
        //showForm.value = false;
        emit('close-form');
      };

      const resetForm = () => {
        Object.keys(formData.value).forEach((key) => {
        formData.value[key] = '';
        });
      };

      const submitForm = async () => {
        if (!formData.value.uid) {
         alert("Bitte das Feld 'Laufende Nr.' Ausfüllen."); // Sicherheitsabfrage
         return;
        }

        const jsonFile = new Blob([JSON.stringify(formData.value)], {
           type: 'application/json',
        });

        const uploadJSON = new FormData();
        uploadJSON.append('file', jsonFile, "formData.json");
        //Console output of JSON data
        console.log("JSON-Inhalt:", JSON.stringify(formData.value, null, 2));
        axios.post('upload_experiment_template', uploadJSON, {
          headers: {
           'Content-Type': 'multipart/form-data',
          }
        }).catch((err) => {
          console.log(`Fehler beim hochladen: ${err}`)
        })

        closeForm();
      };
      const handleEsc = (event: KeyboardEvent) => {
      // Schließt das Dropdown nur, wenn die ESC-Taste gedrückt wird
      if(event.key === 'Escape') {
        closeForm();  // Funktion hier korrekt aufrufen
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleEsc);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleEsc);
    });
      return {
        showForm,
        formData,
        closeForm,
        resetForm,
        submitForm,
      };
    },
});
</script>

<style scoped>

  .overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  width: 880px;
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
  padding-left: 17px;
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
  padding-top: 20px;
}

</style>
