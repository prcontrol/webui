<template>
<!--get a specific valaue: pcr_data.reactor_box.ambient_light-->
  <header class="status-header">
    <div class="status-item">
        <span class="status-label">PHOTO-BOX: {{  backendStatus === 1 ? 'Online' : 'Offline'  }}</span>
    </div>
    <div class="status-item">
        <span class="status-label">POWER-BOX: {{ }}</span>
    </div>
    <div class="status-item">
        <span class="status-label">TEMPERATURE: {{pcr_data.reactor_box_state.ambient_temperature}}°C</span>
    </div>
    <div class="status-item">
        <span class="status-label">UV-INDEX: {{ }}</span>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { pcr_data, register_pcr_data } from '@/dataStore';
import axios from 'axios';


export default defineComponent({
  name: 'StatusHeader',

  setup(){

    register_pcr_data()

    //just to test connection (not real reactor state)
    const backendStatus = ref<number>(0);
    axios.get('/')
      .then(() => {
        backendStatus.value = 1;
      })
      .catch(() => {
        backendStatus.value = 0;
      });


    return{
      pcr_data,
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
