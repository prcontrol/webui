<template>
  <button class="add-experiment-button" @click="showForm = !showForm">Tinkerforge</button>

  <!-- Form overlay, visible only when showForm is true -->
  <div class="overlay-on-select" v-if="showForm">
    <div class="overlay-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="uid">Laufende Nr.:</label>
          <input id="uid" v-model="formData.uid" type="number" required />
        </div>
        <div class="form-field">
          <label for="name">Name:</label>
          <input id="name" v-model="formData.name" type="text" required />
        </div>
        <div class="form-field">
          <label for="version">Version:</label>
          <input id="version" v-model="formData.version" type="number" required />
        </div>
        <div class="form-field">
          <label for="defective">Defekt:</label>
          <input id="defective" v-model="formData.defective" type="checkbox" required />
        </div>
        <div class="form-field">
          <label for="date-bought">Gekauft am:</label>
          <input id="date_bought" v-model="formData.date_bought" type="date" required />
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
  name: 'AddTinkerforgeParts',
  setup() {
    const showForm = ref(false);
    const formData = ref({
      uid: 0,
      name: '',
      version: 0,
      defective: false,
      date_bought: '',
    });

    // Handle form submission and create a JSON file
    const submitForm = () => {
      const jsonFile = new Blob([JSON.stringify(formData.value)], {
          type: 'application/json',
        });

      const uploadJSON = new FormData();
      uploadJSON.append('file', jsonFile, 'formData.json');

      axios.post('upload_bricklet', uploadJSON, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).catch((err) => {
        console.log(`Fehler beim hochladen: ${err}`)
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
      submitForm,
      closeForm,
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
