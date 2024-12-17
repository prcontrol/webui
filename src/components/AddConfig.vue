<template>
  <div class="overlay-on-select" >
    <div class="overlay-container">
    <h2>Create Hardware Configuration</h2>
    <form>
      <div class="arrange-content">
      <div class="left-content">
      <div class="input-container">
        <label for="laufende-nr">Unique Identifier:</label>
        <input tid="uid" v-model="formData.uid" type="number" required >
      </div>
      <div class="input-container">
        <label for="name">Unique Identifier:</label>
        <input tid="name" v-model="formData.name" type="text" required >
      </div>
      <div class="input-container">
        <label for="tinkerforge-bricklets">Select Tinkerforge bricklet:</label>
        <select v-model="formData.tinkerforge_bricklets">
        <option value="" disabled selected>Chose bricklet ...</option>
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
        <label for="date">Date:</label>
        <input id="date" v-model="formData.date" type="date" required >
      </div>
      <div class="input-container">
        <label for="default-distance-led-vial">Default distance led to vial (cm):</label>
        <input id="default_distance_led_vial" v-model="formData.default_distance_led_vial" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-position-thermocouple">Default position of thermocouple:</label>
        <input id="default_position_thermocouple" v-model="formData.default_position_thermocouple" type="text" required >
      </div>
      </div>

      <div class="right-content">
      <div class="input-container">
        <label for="default-pwm-channels">Default PWM channels:</label>
        <input id="default_pwm_channels" v-model="formData.default_pwm_channels" type="text" required >
      </div>
      <div class="input-container">
        <label for="configuration-io-channels">Configuration IO channels (I/O-16 Bricklet):</label>
        <input id="configuration_io_channels" v-model="formData.configuration_io_channels" type="text" required >
      </div>
      <div class="input-container">
        <label for="default-temperature-threshold">Default temperature threshold:</label>
        <input id="default_temperature_threshold" v-model="formData.default_temperature_threshold" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-uv-threshold">Default UV threshold:</label>
        <input id="default_uv_threshold" v-model="formData.default_uv_threshold" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-sensor-query-interval">Default sensor query interval (sec):</label>
        <input id="default_sensor_query_interval" v-model="formData.default_sensor_query_interval" type="number" required >
      </div>
      <div class="input-container">
        <label for="default-reaction-vessel-volume">Default reaction vessel volume:</label>
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
        name: '',
        tinkerforge_bricklets: '', //list of tinkerforge bricklets returns the uid
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
        emit('close-form'); //Mothercomponent is DropdownAddConf.vue
      };

      const submitForm = async () => {
        if (!formData.value.date && !formData.value.default_distance_led_vial) {
         alert("Missing required fields 'Date' and 'Default distance led to vial'.");
         return;
        }

        const jsonFile = new Blob([JSON.stringify(formData.value)], {
           type: 'application/json',
        });

        const uploadJSON = new FormData();
        uploadJSON.append('file', jsonFile, "formData.json");
        //Console output of JSON data
        console.log("JSON-Inhalt:", JSON.stringify(formData.value, null, 2));
        axios.post('config', uploadJSON, {
          headers: {
           'Content-Type': 'multipart/form-data',
          }
        }).catch((err) => {
          console.log(`Fehler beim hochladen: ${err}`)
        })

        closeForm();
      };

      //fetch the bricklets from backend
      const bricklets = ref<any[]>([]);
      const loadBricklets = async () => {
        const response = await axios.get('list_bricklet');
        const data = response.data.result;
        bricklets.value = data;
      };

      //close form if ESC key pressed
      const handleEsc = (event: KeyboardEvent) => {
      if(event.key === 'Escape') {
        closeForm();
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
  flex: 1;
}
.left-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.right-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.arrange-content{
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
  padding-left: 17px;
}
.input-container label {
  font-size: 15px;
  margin-bottom: 5px;
  text-align: left;
}
.input-container input,
.input-container select {
  width: 100%;
  max-width: auto;
  box-sizing: border-box;
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
