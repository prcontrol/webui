<template>
  <div class="lane-container">
    <!-- Lane Number in the Upper Left Corner -->
    <div class="lane-number">Lane {{ laneNumber }}</div>

    <!-- If the lane is turned off, display a message -->
    <div v-if="isTurnedOff" class="turned-off-message">
      Turned Off
    </div>

    <!-- If the lane is active, display the data -->
    <template v-else>
      <!-- Header for LED 1 -->
      <div class="header">
        <div>{{ data.voltage1 }} V</div>
        <div>{{ data.current1 }} mA ({{ data.currentPercent1 }} %)</div>
      </div>

      <!-- LED 1 Information -->
      <div class="led-info">
        <div>{{ data.distance1 }} cm</div>
        <div class="temperature" :class="{ error: data.error1 !== 'None' }">
          {{ data.temp1 }} °C
        </div>
        <div v-if="data.error1 !== 'None'" class="error-message">{{ data.error1 }}</div>
        <div>{{ data.ledType1 }} ({{ data.ledColor1 }})</div>
      </div>

      <!-- Sample Information -->
      <div class="sample-info">
        <div class="sample-header">
          <span>Sample in</span>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressBarWidthSample }">
                <span class="progress-text">{{ remainingTimeSample }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="experiment-ends">
          <span>Experiment Ends:</span>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressBarWidthExp }">
                <span class="progress-text">{{ remainingTimeExperiment }}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          {{ data.sampleVolume }} mL {{ data.sampleName }}
          <div class="temperature" :class="{ error: sampleError !== 'None' }">
            {{ data.sampleTemp }} °C
          </div>
          <div>Corr. Temp.: {{ data.targetTemp }} °C</div>
          <!-- Display sample error if temperature doesn't match -->
          <div v-if="sampleError !== 'None'" class="sample-error">
            {{ sampleError }}
          </div>
        </div>
      </div>

      <!-- LED 2 Information -->
      <div class="led-info">
        <div>{{ data.ledType2 }} ({{ data.ledColor2 }})</div>
        <div v-if="data.error2 !== 'None'" class="error-message">{{ data.error2 }}</div>
        <div class="temperature" :class="{ error: data.error2 !== 'None' }">
          {{ data.temp2 }} °C
        </div>
        <div>{{ data.distance2 }} cm</div>
      </div>

      <!-- Footer for LED 2 -->
      <div class="footer">
        <div>{{ data.voltage2 }} V</div>
        <div>{{ data.current2 }} mA ({{ data.currentPercent2 }} %)</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, computed, Ref } from 'vue';

export default defineComponent({
  name: 'ReactorLane',
  props: {
    laneNumber: {
      type: Number,
      required: true,
    },
    data: {
      type: Object as PropType<{
        voltage1: number;
        current1: number;
        currentPercent1: number;
        distance1: number;
        temp1: number;
        error1: string;
        ledType1: string;
        ledColor1: string;
        sampleStatus: string;
        sampleTime: number;
        experimentTime: number;
        sampleName: string;
        sampleVolume: number;
        sampleTemp: number;
        targetTemp: number;
        sampleError: string;
        ledType2: string;
        ledColor2: string;
        error2: string;
        temp2: number;
        distance2: number;
        current2: number;
        currentPercent2: number;
        voltage2: number;
      }>,
      required: true,
    },
  },
  setup(props) {
    // Check if the lane is turned off (all critical values are 0 or empty)
    const isTurnedOff = computed(() => {
      return (
        props.data.voltage1 === 0 &&
        props.data.current1 === 0 &&
        props.data.currentPercent1 === 0 &&
        props.data.voltage2 === 0 &&
        props.data.current2 === 0 &&
        props.data.currentPercent2 === 0
      );
    });

    const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}h ${m}m ${s}s`;
    };

    const remainingTimeSample = ref(formatTime(props.data.sampleTime * 60));
    const progressBarWidthSample = ref('100%');
    const remainingTimeExperiment = ref(formatTime(props.data.experimentTime * 60));
    const progressBarWidthExp = ref('100%');

    const startCountdown = (
      totalMinutes: number,
      remainingTime: Ref<string>,
      progressBarWidth: Ref<string>
    ) => {
      const totalSeconds = totalMinutes * 60;
      let currentSeconds = totalSeconds;

      const interval = setInterval(() => {
        if (currentSeconds > 0) {
          currentSeconds -= 1;
          remainingTime.value = formatTime(currentSeconds);
          progressBarWidth.value = `${100 - (currentSeconds / totalSeconds) * 100}%`;
        } else {
          clearInterval(interval);
          remainingTime.value = 'Ready';
        }
      }, 1000);
    };

    onMounted(() => {
      if (props.data.sampleTime > 0) {
        startCountdown(props.data.sampleTime, remainingTimeSample, progressBarWidthSample);
      }
      if (props.data.experimentTime > 0) {
        startCountdown(props.data.experimentTime, remainingTimeExperiment, progressBarWidthExp);
      }
    });

    // Computed property to check if the sample temperature matches the target temperature
    const sampleError = computed(() => {
      const sampleTemp = props.data.sampleTemp;
      const targetTemp = props.data.targetTemp;

      if (sampleTemp > targetTemp) {
        return 'Overheated!';
      } else if (sampleTemp < targetTemp) {
        return 'Too Cold!';
      } else {
        return 'None';
      }
    });

    return {
      remainingTimeSample,
      progressBarWidthSample,
      remainingTimeExperiment,
      progressBarWidthExp,
      isTurnedOff,
      sampleError,
    };
  },
});
</script>

<style scoped>
.lane-container {
  width: 13cm;
  height: 16.9cm;
  background-color: rgba(211, 211, 211, 0.6);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 10px;
  position: relative; /* Required for absolute positioning of lane number */
}

.lane-number {
  position: absolute;
  top: 10px;
  left: 10px; /* Positioned in the upper left corner */
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.turned-off-message {
  font-size: 20px;
  font-weight: bold;
  color: #666;
  margin-top: 50px; /* Center the message vertically */
}

.header,
.footer {
  text-align: center;
  font-size: 14px;
}

.led-info,
.sample-info {
  text-align: center;
  font-size: 12px;
}

.temperature {
  font-size: 18px;
  font-weight: bold;
}

.temperature.error {
  color: red;
}

.error-message {
  font-size: 12px;
  color: red;
}

.sample-header,
.experiment-ends {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px; /* Added space between lines */
}

.progress-bar-container {
  display: flex;
  align-items: center;
  width: 150px;
}

.progress-bar {
  width: 100px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #76c7c0;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align text to the left */
  text-align: left; /* Align text to the left */
  padding-left: 12px; /* Add some padding to the left */
}

.progress-text {
  font-size: 12px;
  color: white;
  white-space: nowrap;
  position: absolute;
  width: 100%;
  text-align: left; /* Align text to the left */
  padding-left: 12px; /* Add some padding to the left */
}

.sample-error {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
</style>
