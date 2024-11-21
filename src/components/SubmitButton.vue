<template>
  <div>
    <!-- Datei-Auswahl-Button -->
    <label class="add-button" @click="triggerFileSelection" for="file-input">+</label>
    <input type="file" ref="fileInput" id="file-input" @change="onFileSelected" style="display: none;" accept=".json" />
  </div>
  <div class="overlay-on-select" v-if="selectedFile">
    <div class="overlay-container">
      <h2>Selected File:</h2>
      <h4>{{ selectedFile.name }}</h4>
      <div class="form-buttons">
        <!-- Absende-Button -->
        <button v-if="selectedFile" @click="submitFile">Submit</button>
        <button @click="closeForm">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'SubmitButton',
  setup() {
    const selectedFile = ref<File | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const closeForm = () => {
      selectedFile.value = null; // Setze die Datei auf null, um das Overlay auszublenden
    };

    // öffnet Dateiauswahlfenster
    const triggerFileSelection = () => {
      fileInput.value?.click();
    };

    // Datei wird ausgewählt
    const onFileSelected = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const [file] = target.files as FileList;
      if (!file) {
        alert('No file selected!');
        return;
      }
      selectedFile.value = file;
    };

    // Datei absenden beispielhaft
    // Funktioniert natürlich noch nicht
    /* TODO:
        - Axios statt fetch nutzen
    */
    const submitFile = () => {
      if (!selectedFile.value) {
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile.value);

      axios.post('upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then((response) => {
        console.log(`Upload erfolgreich ${response}`);
        closeForm();
      }).catch((err) => {
        console.log(`Fehler beim hochladen: ${err}`)
      })
    };
    return {
      selectedFile,
      triggerFileSelection,
      onFileSelected,
      submitFile,
      closeForm,
    };
  },
});
</script>

<style scoped>
button {
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button {
  font-size: 50px;
}

.add-button:hover::after {
  content: "Upload .json file";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #919191;
  color: #fff;
  padding: 5px 15px;
  font-size: 10px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
}

.overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Leicht verblasster Hintergrund */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* Überlagert den Inhalt */
}

/* Formular-Container */
.overlay-container {
  background-color: white;
  padding: 20px;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}
</style>
