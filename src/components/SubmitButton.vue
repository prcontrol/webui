<template>
    <div>
        <!-- Datei-Auswahl-Button -->
        <label class="add-button" @click="triggerFileSelection" for="file-input">+</label>
        <input type="file" ref="fileInput" 
            id="file-input"
            @change="onFileSelected" 
            style="display: none;" 
            accept=".json" />
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
        const fileInput = ref<HTMLInputElement | null>(null);

        //öffnet Dateiauswahlfenster
        const triggerFileSelection = () => {
            fileInput.value?.click() //Simuliert Mausklick auf input-Feld wenn fileInput.value nicht NULL oder undefined
        };

        // Datei wird ausgewählt
        const onFileSelected = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const [file] = target.files || []; // Array Destructuring, weil der Linter sonst meckert
            if (!file) {
                alert('No file selected!');
                return;
            }
            //Nur .json zulassen (höherer Schutz als rein im input tag)
            if (file.type !== 'application/json' && !file.name.endsWith('.json')){
                alert('Unvalid file selected. Only .json files are allowed');
                target.value = '';
                return;
            }
            selectedFile.value = file;
        };

        // Datei absenden beispielhaft 
        // Funktioniert natürlich noch nicht
        /* TODO:
            - URL als Umgebungsvariable einrichten 
            - Axios statt fetch nutzen 
        */ 
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
.add-button{
    font-size: 50px;
}
.add-button:hover::after{
    content: "Upload .json file";
    position:absolute;
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
 