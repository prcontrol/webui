<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <!-- Toggle Button -->
    <button class="button-class" @click="showDropdown = !showDropdown"><i class="fa fa-download"></i></button>

    <!-- Dropdown Menu -->
    <div class="overlay-on-select" v-if="showDropdown">
      <div class="overlay-container">
        <label for="formSelector" class="form-header">Export file</label>
        <div class="boarder-to-header">
          <!-- Dropdown Select -->
          <select class="dropdown-select" id="formSelector" v-model="selectedForm" @change="loadFiles">
            <option value="" disabled>Select from category...</option>
            <option value="led">LED</option>
            <option value="config">Configuration</option>
            <option value="experiment">Experiment</option>
            <option value="exp_tmp">Experiment Template</option>
            <option value="bricklet">Tinkerforge Bricklet</option>
          </select>
        </div>

        <!-- Close Button for Dropdown -->
        <div class="button-container">
          <button @click="closeDropdown">Close</button>
        </div>
      </div>
    </div>

    <!-- File List Popup (if files available after selection) -->
    <div v-if="showFileSelection" class="file-list-popup">
      <div class="popup-container">
        <label for="fileSelector" class="form-header">Select Files</label>

        <!-- Scrollable File List -->
        <div class="file-list">
          <ul>
            <li v-for="file in availableFiles" :key="file.uid">
              <input type="checkbox" :value="file.uid" v-model="selectedFiles" />
              <span class="file-details">{{ file.uid }} - {{ file.description }}</span>
            </li>
          </ul>
        </div>

        <!-- Download and Close Buttons -->
        <div class="button-container">
          <button @click="downloadSelectedFiles">Download</button>
          <button @click="closeFileList">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ExportButton',
  setup() {

    type fileType = {
      uid: number
      description: string
    }

    const showDropdown = ref(false);
    const selectedForm = ref('');
    const availableFiles = ref<fileType[]>([]);
    const selectedFiles = ref<number[]>([]);
    const showFileSelection = ref(false);

    // Close dropdown
    const closeDropdown = () => {
      showDropdown.value = false;
      selectedForm.value = '';
      availableFiles.value = [];
      selectedFiles.value = [];
      showFileSelection.value = false;
    };
    const closeFileList = () => {
      showFileSelection.value = false;
      showDropdown.value = true;  // Show the dropdown again
    };

    const loadFiles = async () => {
      selectedFiles.value = [];
      availableFiles.value = [];

      if (!selectedFiles.value){
        showFileSelection.value = false;
        return;
      }
      const response = await axios.get(`list_${selectedForm.value}`);
      availableFiles.value = response.data.results;

      if (availableFiles.value.length > 0){
        showFileSelection.value = true;
      } else {
        showFileSelection.value = false;
      }
    }

    const downloadSelectedFiles = () => {
      if (!selectedFiles.value.length){
        alert("No file selected");
        return;
      }
      //get the file/s from backend
      selectedFiles.value.forEach(async (uid) => {
        const response = await axios.get(`${selectedForm.value}`, {
          params: {uid},
          responseType: "blob",
        });
        const jsonFile = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(jsonFile);

          // Download-Link
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${selectedForm.value}_${uid}.json`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url)
      });
    };


    return {
      showDropdown,
      selectedForm,
      selectedFiles,
      availableFiles,
      showFileSelection,
      loadFiles,
      downloadSelectedFiles,
      closeDropdown,
      closeFileList,
    };
  },
});
</script>

<style scoped>
.hidden-file-input {
  display: none; /* Keeps the file input hidden */
}

.overlay-on-select {
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

.overlay-container {
  background-color: white;
  padding: 20px;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  min-height: 200px;
}

.form-header {
  margin-left: 5px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.dropdown-select {
  width: 100%;
  padding: 15px;
  margin-left: 10px;
  font-size: 17px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 10px;
  max-width: 400px;
}

.boarder-to-header {
  padding-top: 40px;
  align-items: center;
}

.button-class {
  background-color: white;
  color: rgb(0, 0, 0);
  border: none;
  font-size: 20px;
}

.button-class:hover::after{
  content: "Download Center";
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-6%);
  background-color: #919191;
  color: #fff;
  padding: 5px 15px;
  font-size: 10px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  border: none;
}

.file-list-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  min-height: 200px;
}

.file-list {
  max-height: 200px;  /* Maximum height for scrolling */
  overflow-y: auto;   /* Enable vertical scrolling */
}

.file-list ul {
  list-style-type: none;
  padding: 0;
}

.file-list li {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.file-list input {
  margin-right: 10px;
}

.file-details {
  font-size: 16px;
  color: #333;
}

.selected-files ul {
  list-style-type: none;
  padding: 0;
}

.selected-files li {
  margin: 5px 0;
  font-size: 16px;
  color: #333;
}

.file-details {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}
</style>
