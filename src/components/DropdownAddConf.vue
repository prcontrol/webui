<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <button class="button-class" @click="showDropdown = !showDropdown"><i class="fa fa-plus-square-o"></i></button>
    <div class="overlay-on-select" v-if="showDropdown">
    <div class="overlay-container" >
      <label for="formSelector" class="form-header">Create Configuration</label>
      <div class="boarder-to-header">
      <select class="dropdown-select" id="formSelector" v-model="selectedForm" @change="closeDropdown">
        <option value="">Select configuration to create...</option>
        <option value="addConfig">Hardware Configuration</option>
        <option value="addLed">LED</option>
        <option value="addExperiment">Experiment</option>
      </select>
    </div>
    <div class="close-button">
      <button @click="closeDropdown">Close</button>
    </div>
    </div>
    </div>

    <div v-if="selectedForm === 'addConfig'">
      <AddConfig @close-form="closeForm"/>
    </div>
    <div v-if="selectedForm === 'addLed'" >
      <AddLed @close-form="closeForm"/>
    </div>
    <div v-if="selectedForm === 'addExperiment'">
      <AddExperiment @close-form="closeForm"/>
    </div>
  </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import AddExperiment from './AddExperiment.vue';
  import AddLed from './AddLed.vue';
  import AddConfig from './AddConfig.vue';

  export default defineComponent({
    name: 'DropdownAddConf',
    components: {
      AddExperiment,
      AddLed,
      AddConfig,
    },
    setup(){
      const showDropdown = ref(false);
      const selectedForm = ref('');

      const closeDropdown = () => {
        showDropdown.value = false;

      };
      const closeForm = () => {
        selectedForm.value = '';
      };

      return {
      showDropdown,
      selectedForm,
      closeDropdown,
      closeForm,
    };
    },
  });
  </script>

<style scoped>
.overlay-on-select{
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
.overlay-container{
  background-color: white;
  padding: 20px;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 200px;
}
.form-header{
  margin-left: 5px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}
.dropdown-select{
  width: 100%;
  padding: 15px;
  margin-left: 10px;
  font-size: 17px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 10px;
  max-width: 400px;
}
.boarder-to-header{
  padding-top: 40px;
  align-items: center;
}
.button-class{
  background-color: white;
  color: rgb(0, 0, 0);
  border: none;
  font-size: 20px;
}
.button-class:hover::after{
  content: "Create Config";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-70%);
  background-color: #919191;
  color: #fff;
  padding: 5px 15px;
  font-size: 10px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
}
.close-button{
  justify-content: center;
  margin-top: 40px;
}
</style>

