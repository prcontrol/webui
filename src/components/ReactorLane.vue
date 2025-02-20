<template>
  <div class="lane-layout">
    <h2 class="lane-title">Lane {{ laneNumber }}</h2>

    <div v-if="selectedExperiment">
      <!-- Lane design here -->

      <div class="header">
        <div class="voltage-box">{{ getVoltageByLaneAndPosition(laneNumber, "back") }} V</div>
        <div class="current-box">{{ getCurrentByLaneAndPosition(laneNumber, "back") }} mA ({{  }} %)</div>
      </div>

      <div class="led-info">
        <div class="led-vial-distance">{{ selectedExperiment.led_back_distance_to_vial }} cm </div>
        <div class="led-status"> {{ getLedByLane(laneNumber, "back") ? "Connection to LED lost" : "Connected" }}</div>
        <div class="led-description" :style="{ borderColor: getLedBorderColor(selectedExperiment.led_back.color) }">
          {{ selectedExperiment.led_back.name }} - ({{ selectedExperiment.led_back.color }})
        </div>
      </div>

      <div class="sample-info">
        <div class="sample-time">Sample in: {{ }}</div>
        <div class="remaining-time"> Remaining time: {{  }}</div>
        <div class="middle-bar">
            <span class="text"> {{selectedExperiment.config_file.default_reaction_vessel_volume}} mL Vial</span>
            <span class="temperature"> {{getLaneIrTemperature(laneNumber)}} °C</span>
            <div class="badge">{{ laneNumber }}</div>
        </div>
      </div>

      <div class="corr-temp">Corr. Temp.: {{ }} °C</div>

      <div class="led-info">
        <div class="led-description" :style="{ borderColor: getLedBorderColor(selectedExperiment.led_front.color) }" >
          {{ selectedExperiment.led_front.name }} - ({{ selectedExperiment.led_front.color }})
        </div>
        <div class="led-status"> {{ getLedByLane(laneNumber, "front_and_vial") ? "Connection to LED lost" : "Connected" }}</div>
        <div class="led-vial-distance">{{ selectedExperiment.led_front_distance_to_vial }} cm </div>
      </div>

      <div class="footer">
        <div class="voltage-box">{{ getVoltageByLaneAndPosition(laneNumber, "front") }} V</div>
        <div class="current-box">{{ getCurrentByLaneAndPosition(laneNumber, "front") }} mA ({{}} %)</div>
      </div>

      <div class="ctrl-buttons">
        <div class="ctrl-top" >
          <button v-if="!isExperimentRunning" @click="startExperiment" class="start-btn">Start</button>
          <button v-if="selectedExperiment" @click="cancelExperiment" class="cancle-button">Cancel</button>
        </div>
        <div class="ctrl-bottom" >
          <button class="pause-btn" @click="togglePauseResume" :disabled="!isExperimentRunning">
            {{ isPaused ? 'Continue' : 'Pause' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Dropdown Button (only if no experiment is loaded) -->
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
              <span class="file-details">{{ experiment.uid }} - {{ experiment.description }}</span>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { ExperimentTemplate, fileType } from '@/ownTypes';
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
  setup(props) {

    register_pcr_data()

    const showDropdown = ref(false);
    const experiments = ref<fileType[]>([]);
    const selectedUid = ref<number | null>(null);
    const selectedExperiment = ref<ExperimentTemplate | null>(null);
    const isExperimentRunning = ref(false);
    const isPaused = ref(false);

    // fetch the experiment templates
    const fetchExperiments = async () => {
      try {
        const response = await axios.get('list_exp_tmp');
        experiments.value = response.data.results ?? [];
      } catch (error) {
        console.error("Error loading experiments:", error);
      }
    };

    // selects the experiment by its uid
    const loadExperiment = async () => {
      if (!selectedUid.value) return;
      try {
        const response = await axios.get('exp_tmp', { params: { uid: selectedUid.value } });
        selectedExperiment.value = response.data;
        showDropdown.value = false;
      } catch (error) {
        console.error("Error loading selected experiment:", error);
      }
    };

    const closeDropdown = () => {
      showDropdown.value = false;
    };

    const startExperiment = async () => {
      if (!selectedExperiment.value) return;

      //Userinput as long as there is no input field in the ExperimentTemplate for lab notebook entry
      const labNotebookEntry = prompt("Enter Lab Notebook Entry:");
      if (!labNotebookEntry) {
        alert("Lab Notebook Entry Required!");
        return;
      }
      try {
        const response = await axios.get('start_experiment', {
          params: {
            lane: props.laneNumber - 1,
            template: selectedExperiment.value.uid,
            lab_notebook_entry: labNotebookEntry,
          },
        });
        if (response.status === 200){
          alert("Experiment started!")
          isExperimentRunning.value = true;
        }
      } catch (error) {
        console.error("Fehler beim Starten des Experiments:", error);
        alert("Experiment could not be started")
        console.log("lane:", props.laneNumber - 1, "template:", selectedExperiment.value.uid);
      }
    };

    const togglePauseResume = async () => {
      if (!selectedExperiment.value) return;

      try {
        if (isPaused.value) {
          const response = await axios.get('resume_experiment', {
            params: {
              lane: props.laneNumber - 1
            }
          });
          if (response.status === 200) {
            isPaused.value = false;
            alert("Experiment resumed!");
          }
        } else {
          const response = await axios.get('pause_experiment', {
            params: {
              lane: props.laneNumber - 1
            }
          });
          if (response.status === 200) {
            isPaused.value = true;
            alert("Experiment paused!");
          }
        }
      } catch (error) {
        console.error("Fehler bei der Aktion:", error);
      }
    };

    const cancelExperiment = async () => {
      if (!selectedExperiment.value) return;

      if (isExperimentRunning.value){
        try{
          const response = await axios.get('cancel_experiment', {
            params: {
              lane: props.laneNumber - 1
            }
          });
          if (response.status === 200){
            isExperimentRunning.value = false;
            isPaused.value = false;
            selectedExperiment.value = null;
            alert("Experiment canceled!");
          }
        } catch (error) {
          console.error("Fehler beim canceln:", error);
        }
      } else {
        selectedExperiment.value = null;
        alert("OK removes experiment!");
      }
    }

    // example function to have string interpolation in vue templates
    // to display websocket data depending on the lane number
    // workaround: no string interpolation in vue templates
    const getLaneIrTemperature = (laneNum: number) => {
      if (laneNum === undefined) return "N/A";
      const key = `lane_${laneNum}_ir_temp`;
      return pcr_data.reactor_box_state[key as keyof typeof pcr_data.reactor_box_state];
    }

    // pos specified as back/ front
    const getVoltageByLaneAndPosition = (laneNum: number | undefined, pos: string) => {
      if (laneNum === undefined) return "N/A";
      const key = `voltage_lane_${laneNum}_${pos}`;
      return pcr_data.power_box_state[key as keyof typeof pcr_data.power_box_state];
    }

    const getCurrentByLaneAndPosition = (laneNum: number | undefined, pos: string) => {
      if (laneNum === undefined) return "N/A";
      const key = `current_lane_${laneNum}_${pos}`;
      return pcr_data.power_box_state[key as keyof typeof pcr_data.power_box_state];
    }

    // pos specified as back/ front_and_vial
    const getLedByLane = (laneNum: number | undefined, pos: string) => {
      if (laneNum === undefined) return "N/A";
      const key = `led_in_lane_${laneNum}_${pos}`;
      pcr_data.power_box_state[key as keyof typeof pcr_data.power_box_state];
    }

    const getLedBorderColor = (colorValue: string): string => {
      if (!colorValue) return 'grey';
      const normalized = colorValue.toLowerCase();
      if (['rot', 'red'].includes(normalized)) return 'red';
      if (['grün', 'green'].includes(normalized)) return 'green';
      if (['blau', 'blue'].includes(normalized)) return 'blue';
      if (['gelb', 'yellow'].includes(normalized)) return 'yellow';
      if (['ultraviolett', 'ultraviolet', 'uv'].includes(normalized)) return 'violet';
      return 'grey';
    };

    const sampleActive = computed(() => {
      const laneKey = `sample_lane_${props.laneNumber}`;
      return pcr_data[laneKey as keyof typeof pcr_data] === true;
    });


    onMounted(fetchExperiments);

    return {
      showDropdown,
      experiments,
      selectedUid,
      selectedExperiment,
      loadExperiment,
      closeDropdown,
      pcr_data,
      getLaneIrTemperature,
      getVoltageByLaneAndPosition,
      getCurrentByLaneAndPosition,
      getLedByLane,
      togglePauseResume,
      cancelExperiment,
      isExperimentRunning,
      isPaused,
      startExperiment,
      getLedBorderColor,
      sampleActive
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

.voltage-box,
.current-box {
  width: 150px;               /* Gleiche Breite */
  height: 20px;               /* Gleiche Höhe */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  border-radius: 4px;
}

.header,
.footer {
  width: 300px;               /* Gesamte Breite für Header/Footer */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;                  /* Abstand zwischen den Boxen */
  margin: 10px auto;          /* Zentrieren + etwas Margin */


}

.led-info {
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0; /* Abstand zu Elementen darüber und darunter */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px; /* Abstand zwischen den einzelnen Items */
}

.sample-info {
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0; /* Abstand nach oben/unten */
}

.middle-bar {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  padding: 5px 10px;
  border: 2px solid #003f87;
  background-color: #f0f0f0;
  position: relative;
  font-family: Arial, sans-serif;
}

.text {
  font-size: 14px;
  color: black;
}
.temperature {
  font-size: 14px;
  color: #003f87;
  font-weight: bold;
}
.badge {
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  background-color: gray;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 18px;
}

.corr-temp {
  margin: 10px 0;
  font-weight: bold;
}

/* Control-Buttons unten mit Abstand */
.ctrl-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: auto;      /* Schiebt die Buttons an das untere Ende der Lane */
  margin-bottom: 5px;   /* Abstand zum unteren Rand */
  justify-content: center;
}

.ctrl-top {
  display: flex;
  gap: 10px;
}

.ctrl-buttons button {
  width: 100px;      /* Gleiche Breite für alle Buttons (Start/Cancel/Pause) */
  height: 35px;      /* Einheitliche Höhe */
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
}

.led-vial-distance,
.led-status,
.led-description {
  border: 1px solid #ccc;
  padding: 5px;
  margin: 3px 0;
}

.led-description {
  border: 2px solid; /* Die Farbe wird dynamisch gesetzt */
  border-radius: 4px;
  padding: 5px;
  text-align: center;
}

.sample-time,
.remaining-time{
  font-weight: bold;
  padding: 5px;
  text-align: left;
}

</style>
