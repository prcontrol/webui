<!-- src/components/Lane.vue -->
<template>
    <div class="lane-layout">
      <h2 class="lane-title">{{ title }}</h2>
      <!-- Inhalte können hier hinzugefügt werden -->
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'ReactorLane',
    props: {
      title: {
        type: String as PropType<string>,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .lane-layout {
    position: relative;
    width: 13cm; /* Breite festlegen */
    height: 16.9cm; /* Höhe festlegen */
    background-color: rgba(211, 211, 211, 0.6); /* Hellgrau und leicht transparent */
    border-radius: 10px; /* Abgerundete Ecken */
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
  </style>
  