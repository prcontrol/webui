<template>
  <div class="lane-container">
    <div class="lane-number">Lane {{ laneNumber }}</div>

    <div v-if="isTurnedOff" class="turned-off-message">Turned Off</div>

    <template v-else>
      <div class="header">
        <div>{{ data.voltage1 }} V</div>
        <div>{{ data.current1 }} mA ({{ data.currentPercent1 }} %)</div>
      </div>

      <div class="led-info">
        <div>{{ data.distance1 }} cm</div>
        <div class="temperature" :class="{ error: data.error1 !== 'None' }">
          {{ data.temp1 }} °C
        </div>
        <div v-if="data.error1 !== 'None'" class="error-message">{{ data.error1 }}</div>
        <div>{{ data.ledType1 }} ({{ data.ledColor1 }})</div>
      </div>

      <div class="sample-info">
        <div class="sample-header">
          <span>Sample in</span>
          <div class="progress-bar-container">
            <div v-if="currentSampleIndex < data.sampleTime.length || isLastSampleVisible" class="progress-bar-row">
              <div class="progress-bar">
                <div class="progress" :style="{ width: progressBarWidthSample }">
                  <span class="progress-text">{{ remainingTimeSample }}</span>
                </div>
              </div>
              <button
                class="confirm-button"
                v-if="remainingTimeSample === 'Ready' && !isLastSampleVisible"
                @click="confirmSample"
              >✔️</button>
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
          <div v-if="sampleError !== 'None'" class="sample-error">{{ sampleError }}</div>
        </div>
      </div>

      <div class="led-info">
        <div>{{ data.ledType2 }} ({{ data.ledColor2 }})</div>
        <div v-if="data.error2 !== 'None'" class="error-message">{{ data.error2 }}</div>
        <div class="temperature" :class="{ error: data.error2 !== 'None' }">
          {{ data.temp2 }} °C
        </div>
        <div>{{ data.distance2 }} cm</div>
      </div>

      <div class="footer">
        <div>{{ data.voltage2 }} V</div>
        <div>{{ data.current2 }} mA ({{ data.currentPercent2 }} %)</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, computed } from 'vue';

export default defineComponent({
  name: 'ReactorLane',
  props: {
    laneNumber: { type: Number, required: true },
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
        sampleTime: number[];
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
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    };

    const remainingTimeSample = ref<string>('');
    const progressBarWidthSample = ref<string>('100%');
    const currentSampleIndex = ref<number>(0);
    const isLastSampleVisible = ref<boolean>(false);
    let sampleInterval: ReturnType<typeof setInterval> | null = null;

    const startSampleCountdown = (index: number) => {
      if (index >= props.data.sampleTime.length) return;

      const totalSeconds = props.data.sampleTime[index] * 60;
      let currentSeconds = totalSeconds;

      remainingTimeSample.value = formatTime(currentSeconds);
      progressBarWidthSample.value = '100%';

      sampleInterval = setInterval(() => {
        if (currentSeconds > 0) {
          currentSeconds -= 1;
          remainingTimeSample.value = formatTime(currentSeconds);
          progressBarWidthSample.value = `${(100 * (totalSeconds - currentSeconds)) / totalSeconds}%`;
        } else {
          clearInterval(sampleInterval!);
          remainingTimeSample.value = 'Ready';
          if (index === props.data.sampleTime.length - 1) {
            isLastSampleVisible.value = true; // Keep the last progress bar visible
          }
        }
      }, 1000);
    };

    const confirmSample = () => {
      if (sampleInterval) clearInterval(sampleInterval);
      if (currentSampleIndex.value < props.data.sampleTime.length - 1) {
        currentSampleIndex.value++;
        startSampleCountdown(currentSampleIndex.value);
      } else {
        isLastSampleVisible.value = true; // Keep last progress bar visible
      }
    };

    const remainingTimeExperiment = ref<string>('');
    const progressBarWidthExp = ref<string>('100%');

    const startExperimentCountdown = (totalMinutes: number) => {
      const totalSeconds = totalMinutes * 60;
      let currentSeconds = totalSeconds;

      const interval = setInterval(() => {
        if (currentSeconds > 0) {
          currentSeconds -= 1;
          remainingTimeExperiment.value = formatTime(currentSeconds);
          progressBarWidthExp.value = `${(100 * (totalSeconds - currentSeconds)) / totalSeconds}%`;
        } else {
          clearInterval(interval);
          remainingTimeExperiment.value = 'finished';
        }
      }, 1000);
    };

    onMounted(() => {
      if (props.data.sampleTime.length > 0) {
        startSampleCountdown(0);
      }
      if (props.data.experimentTime > 0) {
        startExperimentCountdown(props.data.experimentTime);
      }
    });

    const sampleError = computed(() => {
      const { sampleTemp, targetTemp } = props.data;
      return sampleTemp > targetTemp ? 'Vial Overheated!' : sampleTemp < targetTemp ? 'Too Cold!' : 'None';
    });

    return {
      remainingTimeSample,
      progressBarWidthSample,
      remainingTimeExperiment,
      progressBarWidthExp,
      isTurnedOff,
      sampleError,
      confirmSample,
      currentSampleIndex,
      isLastSampleVisible,
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
  position: relative;
  /* Required for absolute positioning of lane number */
}

.lane-number {
  position: absolute;
  top: 10px;
  left: 10px;
  /* Positioned in the upper left corner */
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.turned-off-message {
  font-size: 20px;
  font-weight: bold;
  color: #666;
  margin-top: 50px;
  /* Center the message vertically */
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
  margin-bottom: 10px;
  /* Added space between lines */
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
  justify-content: flex-start;
  /* Align text to the left */
  text-align: left;
  /* Align text to the left */
  padding-left: 12px;
  /* Add some padding to the left */
}

.progress-text {
  font-size: 12px;
  color: white;
  white-space: nowrap;
  position: absolute;
  width: 100%;
  text-align: left;
  /* Align text to the left */
  padding-left: 12px;
  /* Add some padding to the left */
}

.sample-error {
  font-size: 12px;
  color: red;
  margin-top: 5px;
}
.progress-bar-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.confirm-button {
  width: 20px;
  height: 20px;
  font-size: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #45a049;
}
</style>
