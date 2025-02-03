<template>
  <div id="app">
    <StatusHeader />
    <div class="content">
      <div class="headline-container">
        <h1 class="headline">Reactor Controller</h1>
        <div class="file-container">
          <div class="align-file-container">
            <DropdownAddConf/>
            <SubmitButton/>
            <ExportButton/>
          </div>
        </div>
      </div>
      <div class="lanes-container">
        <!-- Pass laneNumber instead of title -->
        <ReactorLane
          v-for="(lane, index) in lanes"
          :key="index"
          :data="lane"
          :laneNumber="index + 1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusHeader from './components/StatusHeader.vue';
import SubmitButton from './components/SubmitButton.vue';
import ReactorLane from './components/ReactorLane.vue';
import DropdownAddConf from './components/DropdownAddConf.vue';
import ExportButton from './components/ExportButton.vue';

export default defineComponent({
  name: 'App',
  components: {
    StatusHeader,
    SubmitButton,
    ReactorLane,
    DropdownAddConf,
    ExportButton
  },
  data() {
    return {
      // Data for the three lanes
      lanes: [
        // Lane 1 (Active)
        {
          voltage1: 2.7,
          current1: 870,
          currentPercent1: 90,
          distance1: 5,
          temp1: 39.3,
          error1: 'Error',
          ledType1: 'Luxen CZ 455 nm',
          ledColor1: 'blue',
          sampleStatus: 'in progress',
          sampleTime: [0.75,0.5],
          experimentTime: 2,
          sampleName: 'Sample A',
          sampleVolume: 5,
          sampleTemp: 35.5,
          targetTemp: 35.5,
          sampleError: 'None',
          ledType2: 'Luxen CZ 530 nm',
          ledColor2: 'green',
          error2: 'Error',
          temp2: 35.5,
          distance2: 5,
          current2: 650,
          currentPercent2: 65,
          voltage2: 2.9,
        },
        // Lane 2 (Turned Off)
        {
          voltage1: 0,
          current1: 0,
          currentPercent1: 0,
          distance1: 0,
          temp1: 0,
          error1: 'None',
          ledType1: '',
          ledColor1: '',
          sampleStatus: '',
          sampleTime: [0],
          experimentTime: 0,
          sampleName: '',
          sampleVolume: 0,
          sampleTemp: 0,
          targetTemp: 0,
          sampleError: 'None',
          ledType2: '',
          ledColor2: '',
          error2: 'None',
          temp2: 0,
          distance2: 0,
          current2: 0,
          currentPercent2: 0,
          voltage2: 0,
        },
        // Lane 3 (Turned Off)
        {
          voltage1: 0,
          current1: 0,
          currentPercent1: 0,
          distance1: 0,
          temp1: 0,
          error1: 'None',
          ledType1: '',
          ledColor1: '',
          sampleStatus: '',
          sampleTime: [0],
          experimentTime: 0,
          sampleName: '',
          sampleVolume: 0,
          sampleTemp: 0,
          targetTemp: 0,
          sampleError: 'None',
          ledType2: '',
          ledColor2: '',
          error2: 'None',
          temp2: 0,
          distance2: 0,
          current2: 0,
          currentPercent2: 0,
          voltage2: 0,
        },
      ],
    };
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

.content {
  padding: 20px;
}

.headline-container {
  display: flex;
  align-items: center;
  gap: 100px;
  margin-bottom: 20px;
}

.headline {
  font-size: 65px;
  margin: 0;
}

.file-container {
  position: absolute;
  right: 0;
  margin-right: 50px;
  margin-top: 20px;
}

.lanes-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.align-file-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>
