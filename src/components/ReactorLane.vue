<!-- src/components/Lane.vue -->
<template>
  <div class="lane-layout">
    <h2 class="lane-title">Lane {{ laneNumber }}</h2>

    <!-- Experiment-Anzeige -->
    <div v-if="selectedExperiment">
      <!-- Hier weiteres lane design-->
      <p><strong>Experiment:</strong> {{ selectedExperiment.name }}</p>
      <p><strong>LED back intensity:</strong> {{ selectedExperiment.led_back_intensity}}°C</p>
      <p><strong>Lane {{ selectedExperiment.active_lane + 1 }} IR temperature: </strong>{{ getLaneIrTemperature(selectedExperiment.active_lane) }}</p>
      <button @click="closeExperiment">remove</button>
    </div>

    <!-- Dropdown Button (nur wenn kein Experiment geladen ist) -->
    <button v-if="!selectedExperiment" class="button-class" @click="showDropdown = !showDropdown">
     +
    </button>

    <!-- Dropdown Menu -->
    <div class="overlay-on-select" v-if="showDropdown">
      <div class="overlay-container">
        <label class="form-header">Experiments for Lane {{ laneNumber }}</label>

        <div v-if="experiments.length > 0" class="file-list">
          <ul>
            <li v-for="experiment in experiments" :key="experiment.uid">
              <input type="radio" :value="experiment.uid" v-model="selectedUid" />
              <span class="file-details">{{ experiment.uid }} - {{ experiment.name }}</span>
            </li>
          </ul>
        </div>
        <p v-else>No experiments available for this lane.</p>

        <!-- Buttons -->
        <div class="button-container">
          <button @click="loadExperiment">Load</button>
          <button @click="closeDropdown">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ExperimentTemplate } from '@/ownTypes';
import { register_pcr_data , pcr_data} from '@/dataStore';
import axios from 'axios';

export default defineComponent({
  name: 'ReactorLane',
  props: {
    laneNumber: {
      type: Number,
      required: true,
    },
  },
  setup() {

    register_pcr_data()

    const showDropdown = ref(false);
    const experiments = ref<ExperimentTemplate[]>([]);
    const selectedUid = ref<number | null>(null);
    const selectedExperiment = ref<ExperimentTemplate | null>(null);

    // fetch the experiment templates
    const fetchExperiments = async () => {
      try {
        const response = await axios.get('exp_tmp');
        experiments.value = response.data ?? [];
      } catch (error) {
        console.error("Error loading experiments:", error);
      }
    };

    // selects the experiment by its uid
    const loadExperiment = () => {
      if (!selectedUid.value) return;

      selectedExperiment.value = experiments.value.find(exp => exp.uid === selectedUid.value) || null;
      showDropdown.value = false;
    };

    const closeDropdown = () => {
      showDropdown.value = false;
    };

    const closeExperiment = () =>{
      alert("Warning! Experiment will be removed after clicking OK");
      selectedExperiment.value = null;
    }

    // example function to have string interpolation in vue templates
    // to display websocket data depending on the lane number
    // workaround: no string interpolation in vue templates
    const getLaneIrTemperature = (laneNum: number) => {
      const key = `lane_${laneNum + 1}_ir_temp`;
      return pcr_data.reactor_box_state[key as keyof typeof pcr_data.reactor_box_state];
    }

    onMounted(fetchExperiments);

    return {
      showDropdown,
      experiments,
      selectedUid,
      selectedExperiment,
      loadExperiment,
      closeDropdown,
      closeExperiment,
      pcr_data,
      getLaneIrTemperature
    };
  },
});
</script>


<style scoped>
.lane-layout {
  position: relative;
  width: 13cm;
  /* Breite festlegen */
  height: 16.9cm;
  /* Höhe festlegen */
  background-color: rgba(211, 211, 211, 0.6);
  /* Hellgrau und leicht transparent */
  border-radius: 10px;
  /* Abgerundete Ecken */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lane-layout .lane-title {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  margin: 0;
  color: #333;
}

.hidden-file-input {
  display: none; /* Keeps the file input hidden */
}

.overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
  width: 400px;
  height: auto;
}

.form-header {
  margin-left: 5px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.dropdown-select {
  width: 100%;
  padding: 15px;
  margin-left: 10px;
  font-size: 17px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 10px;
  max-width: 400px;
}

.boarder-to-header {
  padding-top: 40px;
  align-items: center;
}

.button-class::after:hover{
  color: rgb(0, 0, 0);
  border: none;
  background-color: transparent;
  font-size: 20px;

}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  border: none;
}

.file-list-popup {
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

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  height: auto;
}

.file-list {
  max-height: 200px;  /* Maximum height for scrolling */
  overflow-y: auto;   /* Enable vertical scrolling */
}

.file-list ul {
  list-style-type: none;
  padding: 0;
}

.file-list li {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.file-list input {
  margin-right: 10px;
}

.file-details {
  font-size: 16px;
  color: #333;
}

.selected-files ul {
  list-style-type: none;
  padding: 0;
}

.selected-files li {
  margin: 5px 0;
  font-size: 16px;
  color: #333;
}

.file-details {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}
</style>
