<template>
    <div>
      <!-- Datei-Auswahl-Button -->
      <input type="file" id="file-input" @change="onFileSelected" style="display: none;" ref="fileInput" />
      <button class="add-button" @click="triggerFileSelection">+</button>
      
    </div>

    <div class="overlay-on-select" v-if="selectedFile">
        <div class="overlay-container"> 
            <h2>Selected File:</h2>
            <h4>{{selectedFile.name }}</h4>
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
  
  export default defineComponent({
    name: 'SubmitButton',
    setup() {
      const selectedFile = ref<File | null>(null);
      const triggerFileSelection = () => {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.click();
        }
      };
      // Datei wird ausgewählt
      const onFileSelected = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          selectedFile.value = target.files[0]; // Speichere die ausgewählte Datei
        }
      };
      // Datei absenden
      const submitFile = () => {
        if (selectedFile.value) {
          const formData = new FormData();
          formData.append('file', selectedFile.value);
          // Beispiel: Datei an Backend senden
          fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Upload erfolgreich:', data);
            })
            .catch((error) => {
              console.error('Fehler beim Hochladen:', error);
            });
        }
       };
       const closeForm = () => {
        selectedFile.value = null; // Setze die Datei auf null, um das Overlay auszublenden
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

  p {
    font-size: 16px;
    margin: 10px 0;
  }
  .overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Leicht verblasster Hintergrund */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Überlagert den Inhalt */
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
  