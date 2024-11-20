<template>
  <h1>HelloWorld</h1>
  <head class="status-header">
    <div class="status-item">
        <span class="ststus-label">PHOTO-BOX:</span>
    </div>
    <div class="status-item">
        <span class="ststus-label">STROM-BOX:</span>
    </div>
    <div class="status-item">
        <span class="ststus-label">TEMPERATUR:</span>
    </div>
    <div class="status-item">
        <span class="ststus-label">UV-INDEX:</span>
    </div>
  </head>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatusHeader',
});
</script>

<style scoped>
    h1{
        display: flex;
    }
</style>
