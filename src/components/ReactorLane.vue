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
        <div class="led-time">
          <div class="led-time-progress">
            <span>LED 1 Time:</span>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div class="progress" :style="{ width: progressBarWidthLed1 }">
                  <span class="progress-text">{{ remainingTimeLed1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <button class="confirm-button" v-if="remainingTimeSample === 'Ready' && !isLastSampleVisible"
                @click="confirmSample">✔️</button>
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
        <div class="led-time-progress">
          <span>LED 2 Time:</span>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressBarWidthLed2 }">
                <span class="progress-text">{{ remainingTimeLed2 }}</span>
              </div>
            </div>
          </div>
        </div>
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
        ledTime1: number;
        ledColor1: string;
        sampleTime: number[];
        experimentTime: number;
        sampleName: string;
        sampleVolume: number;
        sampleTemp: number;
        targetTemp: number;
        ledTime2: number;
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
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}h ${m}m ${s}s`;
    };

    const remainingTimeSample = ref<string>('');
    const progressBarWidthSample = ref<string>('100%');
    const currentSampleIndex = ref<number>(0);
    const isLastSampleVisible = ref<boolean>(false);
    const paused = ref<boolean>(false); // Track if timers are paused

    let sampleInterval: ReturnType<typeof setInterval> | null = null;
    let experimentInterval: ReturnType<typeof setInterval> | null = null;
    let led1Interval: ReturnType<typeof setInterval> | null = null;
    let led2Interval: ReturnType<typeof setInterval> | null = null;

    const startSampleCountdown = (index: number) => {
      if (index >= props.data.sampleTime.length) return;

      const totalSeconds = props.data.sampleTime[index] * 60;
      let currentSeconds = totalSeconds;

      remainingTimeSample.value = formatTime(currentSeconds);
      progressBarWidthSample.value = '100%';

      sampleInterval = setInterval(() => {
        if (!paused.value && currentSeconds > 0) {
          currentSeconds -= 1;
          remainingTimeSample.value = formatTime(currentSeconds);
          progressBarWidthSample.value = `${(100 * (totalSeconds - currentSeconds)) / totalSeconds}%`;
        } else if (currentSeconds === 0) {
          if(sampleInterval)clearInterval(sampleInterval);
          remainingTimeSample.value = 'Ready';
          if (index === props.data.sampleTime.length - 1) {
            isLastSampleVisible.value = true; // Keep the last progress bar visible
          }
          paused.value = true; // Pause all timers
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
      paused.value = false; // Resume all timers

      // Restart all timers
      startExperimentCountdown(experimentSeconds.value - experimentElapsedSeconds.value);
      startLed1Countdown(led1Seconds.value - led1ElapsedSeconds.value);
      startLed2Countdown(led2Seconds.value - led2ElapsedSeconds.value);
    };

    const experimentSeconds = ref<number>(0);
    const experimentElapsedSeconds = ref<number>(0);
    const remainingTimeExperiment = ref<string>('');
    const progressBarWidthExp = ref<string>('100%');

    const startExperimentCountdown = (totalSeconds: number) => {
      let currentSeconds = totalSeconds;

      experimentInterval = setInterval(() => {
        if (!paused.value && currentSeconds > 0) {
          currentSeconds -= 1;
          experimentElapsedSeconds.value += 1;
          remainingTimeExperiment.value = formatTime(currentSeconds);
          progressBarWidthExp.value = `${(100 * (experimentSeconds.value - currentSeconds)) / experimentSeconds.value}%`;
        } else if (currentSeconds === 0) {
          if(experimentInterval)clearInterval(experimentInterval);
          remainingTimeExperiment.value = 'finished';
        }
      }, 1000);
    };

    const led1Seconds = ref<number>(0);
    const led1ElapsedSeconds = ref<number>(0);
    const remainingTimeLed1 = ref<string>('');
    const progressBarWidthLed1 = ref<string>('100%');

    const startLed1Countdown = (totalSeconds: number) => {
      let currentSeconds = totalSeconds;

      led1Interval = setInterval(() => {
        if (!paused.value && currentSeconds > 0) {
          currentSeconds -= 1;
          led1ElapsedSeconds.value += 1;
          remainingTimeLed1.value = formatTime(currentSeconds);
          progressBarWidthLed1.value = `${(100 * (led1Seconds.value - currentSeconds)) / led1Seconds.value}%`;
        } else if (currentSeconds === 0) {
          if(led1Interval)clearInterval(led1Interval);
          remainingTimeLed1.value = 'finished';
        }
      }, 1000);
    };

    const led2Seconds = ref<number>(0);
    const led2ElapsedSeconds = ref<number>(0);
    const remainingTimeLed2 = ref<string>('');
    const progressBarWidthLed2 = ref<string>('100%');

    const startLed2Countdown = (totalSeconds: number) => {
      let currentSeconds = totalSeconds;

      led2Interval = setInterval(() => {
        if (!paused.value && currentSeconds > 0) {
          currentSeconds -= 1;
          led2ElapsedSeconds.value += 1;
          remainingTimeLed2.value = formatTime(currentSeconds);
          progressBarWidthLed2.value = `${(100 * (led2Seconds.value - currentSeconds)) / led2Seconds.value}%`;
        } else if (currentSeconds === 0) {
          if(led2Interval)clearInterval(led2Interval);
          remainingTimeLed2.value = 'finished';
        }
      }, 1000);
    };

    onMounted(() => {
      if (props.data.sampleTime.length > 0) {
        startSampleCountdown(0);
      }
      const experimentTime = Math.max(props.data.ledTime1, props.data.ledTime2);
      experimentSeconds.value = experimentTime * 60;
      if (experimentTime > 0) {
        startExperimentCountdown(experimentSeconds.value);
      }
      led1Seconds.value = props.data.ledTime1 * 60;
      if (props.data.ledTime1 > 0) {
        startLed1Countdown(led1Seconds.value);
      }
      led2Seconds.value = props.data.ledTime2 * 60;
      if (props.data.ledTime2 > 0) {
        startLed2Countdown(led2Seconds.value);
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
      remainingTimeLed1,
      progressBarWidthLed1,
      remainingTimeLed2,
      progressBarWidthLed2,
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
}

.lane-number {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.turned-off-message {
  font-size: 20px;
  font-weight: bold;
  color: #666;
  margin-top: 50px;
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
  text-align: left;
  padding-left: 12px;
}

.progress-text {
  font-size: 12px;
  color: white;
  white-space: nowrap;
  position: absolute;
  width: 100%;
  text-align: left;
  padding-left: 12px;
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

.led-time {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.led-time-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.led-time-progress span {
  font-size: 12px;
}
</style>
