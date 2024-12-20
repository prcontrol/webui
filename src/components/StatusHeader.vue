<template>
<!--Status Anzeigen hardcodet zum Veranschaulichen: später Werte von Backend abrufen-->
  <header class="status-header">
    <div class="status-item">
        <span class="status-label">PHOTO-BOX: {{  backendStatus === 1 ? 'Online' : 'Offline'  }}</span>
    </div>
    <div class="status-item">
        <span class="status-label">POWER-BOX: {{  }}</span>
    </div>
    <div class="status-item">
        <span class="status-label">TEMPERATURE: {{ statusData.ambient_light }}°C</span>
    </div>
    <div class="status-item">
        <span class="status-label">UV-INDEX: {{ statusData.uv_index }}</span>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, } from 'vue';
import { genPcrData } from '@/dataStore';
import axios from 'axios';

export default defineComponent({
  name: 'StatusHeader',

  setup(){
    const reactorState = genPcrData();
    const statusData = reactorState.reactor_box;

    const backendStatus = ref<number>(0);

    axios.get('/')
      .then(() => {
        backendStatus.value = 1; // Backend erreichbar
      })
      .catch(() => {
        backendStatus.value = 0; // Backend nicht erreichbar
      });

    return{
      statusData,
      backendStatus,
    };
  },
});
</script>

<style scoped>
.status-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: black;
    border-bottom: 1.5px solid #adadad;
}
.status-item{
    display: flex;
    text-decoration-color:black;
    align-items: center;
    margin-right: 10px;
}
.status-label {
    margin-right: 5px;
}
.status-green{
    color: green;
}
</style>
