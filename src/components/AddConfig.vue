<template>
  <div class="overlay-on-select" >
    <div class="overlay-container">
    <h2>Konfiguration anlegen</h2>
    <form>
      <div class="arrange-content">
      <div class="left-content">
      <div class="input-container">
        <label for="laufende-nr">Laufende Nr.:</label>
        <input tid="uid" v-model="formData.uid" type="number" required >
      </div>
      <div class="input-container">
        <label for="tinkerforge-bricklets">Wähle Tinkerforge Bricklet:</label>
        <select v-model="formData.bricklet">
         <option v-for="bricklet in bricklets" :key="bricklet.uid" :value="bricklet.uid">
          {{ bricklet.name }}
        </option>
       </select>
      </div>
      <div class="input-container">
        <label for="software-version">Software version: </label>
        <input id="software_version" v-model="formData.software_version" type="text" required >
      </div>
      <div class="input-container">
        <label for="date">Datum:</label>
        <input id="date" v-model="formData.date" type="date" required >
      </div>
      <div class="input-container">
        <label for="default-distance-led-vial">Standartwert für den Abstand der LEDs zu Vial (cm):</label>
        <input id="default_distance_led_vial" v-model="formData.default_distance_led_vial" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-position-thermocouple">Standartwert für die Position des Thermocouples:</label>
        <input id="default_position_thermocouple" v-model="formData.default_position_thermocouple" type="text" required >
      </div>
      </div>

      <div class="right-content">
      <div class="input-container">
        <label for="default-pwm-channels">Standartwerte für die PWM-Kanäle des Servo Bricklets</label>
        <input id="default_pwm_channels" v-model="formData.default_pwm_channels" type="text" required >
      </div>
      <div class="input-container">
        <label for="configuration-io-channels">Konfiguration der OUT- & IN-Kanäle der I/O-16 Bricklets:</label>
        <input id="configuration_io_channels" v-model="formData.configuration_io_channels" type="text" required >
      </div>
      <div class="input-container">
        <label for="default-temperature-threshold">Standartwerte für die Temperatur-Werte:</label>
        <input id="default_temperature_threshold" v-model="formData.led_back_intensity" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-uv-threshold">Standartwert für den UV-Index:</label>
        <input id="default_uv_threshold" v-model="formData.default_uv_threshold" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-sensor-query-interval">Standartwert für die Abfragegeschwindigkeit der Sensorik (sec):</label>
        <input id="default_sensor_query_interval" v-model="formData.default_sensor_query_interval" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-reaction-vessel-volume">Standartwert für das Volumen des Reaktionsgefäßes:</label>
        <input id="default_reaction_vessel_volume" v-model="formData.default_reaction_vessel_volume" type="number" required>
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
   name: 'AddConfig',
   emits: ['close-form'],

   setup(_,{emit}){
      const formData = ref({
        uid: '',
        tinkerforge_bricklets: '', //list of tinkerforge bricklets
        software_version: '',
        date: '',
        default_distance_led_vial: '',
        default_position_thermocouple: '',
        default_pwm_channels: '', //list of floats
        configuration_io_channels: '',
        default_temperature_threshold: '',
        default_uv_threshold: '',
        default_sensor_query_interval: '',
        default_reaction_vessel_volume: '',

      });

      const closeForm = () => {
        emit('close-form'); //Mutterkomponente ist DropdownAddConf.vue
      };

      const submitForm = async () => {

        const jsonFile = new Blob([JSON.stringify(formData.value)], {
           type: 'application/json',
        });

        const uploadJSON = new FormData();
        uploadJSON.append('file', jsonFile, "formData.json");
        //Console output of JSON data
        console.log("JSON-Inhalt:", JSON.stringify(formData.value, null, 2));
        axios.post('config', uploadJSON, { //Placeholder mit route ersetzen
          headers: {
           'Content-Type': 'multipart/form-data',
          }
        }).catch((err) => {
          console.log(`Fehler beim hochladen: ${err}`)
        })

        closeForm();
      };


      const bricklets = ref<unknown[]>([]);
      const loadBricklets = async () => {
        const response = await axios.get('list_bricklet');
        const data = response.data.result;
        bricklets.value = data;
      };



      const handleEsc = (event: KeyboardEvent) => {
      // Schließt das Dropdown nur, wenn die ESC-Taste gedrückt wird
      if(event.key === 'Escape') {
        closeForm();  // Funktion hier korrekt aufrufen
      }
      };

      onMounted(() => {
        window.addEventListener('keydown', handleEsc);
        loadBricklets();
      });

      onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEsc);
      });

      return {
        formData,
        closeForm,
        submitForm,
        bricklets,
        loadBricklets,
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
