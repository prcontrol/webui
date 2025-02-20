<template>
<!--get a specific valaue: pcr_data.reactor_box.ambient_light-->
  <header class="status-header">
    <div class="status-item">
        <span class="status-label">PHOTO-BOX: {{  photoBoxStatus }}</span>
    </div>
    <div class="status-item">
        <span class="status-label">POWER-BOX: {{ powerBoxStatus}}</span>
    </div>
    <div class="status-item">
        <span class="status-label">TEMPERATURE: {{pcr_data.reactor_box_state.ambient_temperature}}°C</span>
    </div>
    <div class="status-item">
        <span class="status-label">UV-INDEX: {{ pcr_data.reactor_box_state.uv_index}}</span>
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { pcr_data, register_pcr_data } from '@/dataStore';


export default defineComponent({
  name: 'StatusHeader',

  setup(){

    register_pcr_data()

    const photoBoxStatus = computed(() => {
      return pcr_data.reactor_box_connected ? 'Online' : 'Offline';
    });

    const powerBoxStatus = computed(() => {
      return pcr_data.power_box_connected ? 'Online' : 'Offline';
    });

    return{
      pcr_data,
      photoBoxStatus,
      powerBoxStatus
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
