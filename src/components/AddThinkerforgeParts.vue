<template>
  <button class="add-experiment-button" @click="showForm = !showForm">Tinkerforge</button>

  <!-- Form overlay, visible only when showForm is true -->
  <div class="overlay-on-select" v-if="showForm">
    <div class="overlay-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="field1">Laufende Nr.:</label>
          <input id="field1" v-model="formData.field1" type="number" required />
        </div>
        <div class="form-field">
          <label for="field2">Name:</label>
          <input id="field2" v-model="formData.field2" type="text" required />
        </div>
        <div class="form-field">
          <label for="field3">Version:</label>
          <input id="field3" v-model="formData.field3" type="number" required />
        </div>
        <div class="form-field">
          <label for="field4">Defekt:</label>
          <input id="field4" v-model="formData.field4" type="checkbox" required />
        </div>
        <div class="form-field">
          <label for="field5">Gekauft am:</label>
          <input id="field5" v-model="formData.field5" type="date" required />
        </div>

        <!-- Submit and Close Buttons -->
        <button type="submit">Absenden</button>
        <button @click.prevent="closeForm">Close</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AddThinkerforgeParts',
  setup() {
    const showForm = ref(false);

    // Form data structure
    const formData = ref({
      field1: 0,
      field2: '',
      field3: 0,
      field4: false,
      field5: '',
    });

    // Handle form submission and create a JSON file
    const handleSubmit = () => {
      const jsonFile = new Blob([JSON.stringify(this)], {
          type: 'application/json',
        });

      const uploadJSON = new FormData();
      uploadJSON.append('file', jsonFile, '${this.formData.field1}.json');

      axios.post('upload_experiment_config', uploadJSON, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })


      // Close the form after submission
      closeForm();
    };

    // Close the form (hide the overlay)
    const closeForm = () => {
      showForm.value = false;
    };

    return {
      showForm,
      formData,
      handleSubmit,
      closeForm
    };
  },
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f0f0f0;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  -webkit-appearance: none; /* Safari, Chrome */
  appearance: none; /* Remove arrows */
}

.overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-container {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 350px;
}

button {
  margin-top: 15px;
  padding: 10px;
  background-color: #d3d3d3; /* Light grey background */
  color: black; /* Black text for contrast */
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #b0b0b0; /* Slightly darker grey on hover */
}

button:last-of-type {
  background-color: #d3d3d3; /* Light grey background for close button */
}

button:last-of-type:hover {
  background-color: #b0b0b0; /* Slightly darker grey on hover */
}
</style>
