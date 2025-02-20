<template>
  <div class="overlay-on-select" >
    <div class="overlay-container">
    <h2>Create Experiment Template</h2>
    <form>
      <div class="arrange-content">
      <div class="left-content">
      <div class="input-container">
        <label for="laufende-nr">Unique Identifier:</label>
        <input tid="uid" v-model="formData.uid" type="number" :placeholder="'int'" required >
      </div>
      <div class="input-container">
        <label for="name">Name:</label>
        <input tid="name" v-model="formData.name" type="text" :placeholder="'string'" required >
      </div>
      <div class="input-container">
        <label for="start-date">Date:</label>
        <input id="date" v-model="formData.date" type="date" required >
      </div>
      <div class="input-container">
        <label for="hardware-config">Hardware Configuration:</label>
        <select v-model="formData.config_file" id="configDropdown">
          <option value="" disabled selected>Chose hardware configuration ...</option>
          <option v-for="config in configs" :key="config.uid" :value="config.uid">
            {{config.uid}} - {{ config.description }}
          </option>
      </select>
      </div>
      <div class="input-container">
        <label for="active-lane">Active lane:</label>
        <input id="active_lane" v-model="formData.active_lane" :placeholder="'int'" type="number" required>
      </div>
      <div class="input-container">
        <label for="led-front">LED front:</label>
        <select v-model="formData.led_front" id="ledFrontDropdown">
          <option value="" disabled selected>Chose LED ...</option>
          <option v-for="led in leds" :key="led.uid" :value="led.uid">
            {{led.uid }} - {{ led.description }}
          </option>
      </select>
      </div>
      <div class="input-container">
        <label for="led-front-intensity">LED front intensity:</label>
        <input id="led_front_intensity" v-model="formData.led_front_intensity" :placeholder="'int'" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-distance-to-vial">LED front distance to vial (cm):</label>
        <input id="led_front_distance_to_vial" v-model="formData.led_front_distance_to_vial" :placeholder="'float'" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-front-belichtungsdauer">LED front exposure time (min):</label>
        <input id="led_front_exposure_time" v-model="formData.led_front_exposure_time" :placeholder="'float'" type="number" required >
      </div>
      </div>

      <div class="right-content">
      <div class="input-container">
        <label for="led-back">LED back: </label>
        <select v-model="formData.led_back" id="ledBackDropdown">
          <option value="" disabled selected>Chose LED ...</option>
          <option v-for="led in leds" :key="led.uid" :value="led.uid">
            {{led.uid }} - {{ led.description }}
          </option>
        </select>
      </div>
      <div class="input-container">
        <label for="led-back-intensity">LED back intensity:</label>
        <input id="led_back_intensity" v-model="formData.led_back_intensity" :placeholder="'int'" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-distance-to-vial">LED back distance to vial (cm):</label>
        <input id="led_back_distance_to_vial" v-model="formData.led_back_distance_to_vial" :placeholder="'float'" type="number" required >
      </div>
      <div class="input-container">
        <label for="led-back-belichtungsdauer">LED back exposure time (min):</label>
        <input id="led_back_exposure_time" v-model="formData.led_back_exposure_time" :placeholder="'float'" type="number" required >
      </div>
      <div class="input-container">
        <label for="pos-thermocouple">Position Thermocouple:</label>
        <input id="position_thermocouple" v-model="formData.position_thermocouple" type="text" :placeholder="'string'"  required>
      </div>
      <div class="input-container">
        <label for="time-points-sample-taking">Time points sample taking:</label>
        <input id="time_points_sample_taking" v-model="formData.time_points_sample_taking" type="text" :placeholder="'int array: [1,10,...]'" required>
      </div>
      <div class="input-container">
        <label for="size_sample">Sample size:</label>
        <input id="size_sample" v-model="formData.active_lane" :placeholder="'float'" type="number" required>
      </div>
      <div class="input-container">
        <label for="measurement-interval">Measurement interval:</label>
        <input id="measurement_interval" v-model="formData.active_lane" :placeholder="'float'" type="number" required>
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
import axios from 'axios'

export default defineComponent({
   name: 'AddExperiment',
   emits: ['close-form'],

   setup(_,{emit}){

      const formData = ref({
        uid: '',
        name: '',
        date: '',
        config_file: '',
        active_lane: '',
        led_front: '',
        led_front_intensity: '',
        led_front_distance_to_vial: '',
        led_front_exposure_time: '',
        led_back: '',
        led_back_intensity: '',
        led_back_distance_to_vial: '',
        led_back_exposure_time: '',
        time_points_sample_taking: '',
        size_sample: '',
        measurement_interval: '',
        position_thermocouple: '',
      });


      const closeForm = () => {
        emit('close-form'); //Mothercomponent is DropdownAddConf.vue
      };

      const submitForm = async () => {
        if (!formData.value.uid ) {
         alert("Missing required fields 'Unique Identifier'");
         return;
        }

        //get the config and led values for selected uid
        const responseConfig = await axios.get('config', {params:{uid: formData.value.config_file}});
        formData.value.config_file = responseConfig.data;

        const responseLedFront = await axios.get('led', {params: {uid: formData.value.led_front}});
        formData.value.led_front = responseLedFront.data;

        const responseLedBack = await axios.get('led', {params:{uid: formData.value.led_back}});
        formData.value.led_back = responseLedBack.data;

        formData.value.time_points_sample_taking = JSON.parse(formData.value.time_points_sample_taking);

        const jsonFile = new Blob([JSON.stringify(formData.value)], {
           type: 'application/json',
        });

        const uploadJSON = new FormData();
        uploadJSON.append('json_file', jsonFile, "formData.json");
        //Console output of JSON data
        console.log("JSON-Inhalt:", JSON.stringify(formData.value, null, 2));
        axios.post('exp_tmp', uploadJSON, {
          headers: {
           'Content-Type': 'multipart/form-data',
          }
        }).catch((err) => {
          console.log(`Fehler beim Hochladen: ${err.response ? err.response.data : err}`)
        })
        closeForm();
      };

      //handle config file fetching
      type configType = {
        uid: number
        description: string
      }

      const configs = ref<configType[]>([]);
      const loadConfigFiles = async () => {
        const response = await axios.get('list_config');
        console.log(response);
        const data = response.data.results;
        configs.value = data;
      };

      const leds = ref<configType[]>([]) //maybe change type name
      const loadLeds = async () => {
        const response = await axios.get('list_led');
        console.log(response);
        const data = response.data.results;
        leds.value = data;
      };

      const handleEsc = (event: KeyboardEvent) => {
      if(event.key === 'Escape') {
        closeForm();
      }
      };

      onMounted(() => {
        window.addEventListener('keydown', handleEsc);
        loadConfigFiles();
        loadLeds();
      });

      onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEsc);
      });

      return {
        formData,
        closeForm,
        submitForm,
        loadConfigFiles,
        loadLeds,
        configs,
        leds,
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
