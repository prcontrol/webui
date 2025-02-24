<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <!-- Toggle Button -->
    <button class="button-class" @click="showDropdown = !showDropdown"><i class="fa fa-upload"></i></button>

    <!-- Dropdown Menu -->
    <div class="overlay-on-select" v-if="showDropdown">
      <div class="overlay-container">
        <label for="formSelector" class="form-header">Upload configuration file</label>
        <div class="boarder-to-header">
          <!-- Dropdown Select -->
          <select class="dropdown-select" id="formSelector" v-model="selectedForm" @change="handleDropdownChange">
            <option value="">Select configuration to upload...</option>
            <option value="led">LED</option>
            <option value="config">Configuration</option>
            <option value="experiment">Experiment</option>
          </select>
        </div>
        <div class="close-button">
          <button @click="closeDropdown">Close</button>
        </div>
      </div>
    </div>

    <!-- File Input (Hidden) -->
    <input
      type="file"
      ref="fileInput"
      class="hidden-file-input"
      @change="handleFileUpload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'SubmitButton',
  setup() {
    const showDropdown = ref(false);
    const selectedForm = ref('');
    const fileInput = ref<HTMLInputElement | null>(null);

    // Close dropdown
    const closeDropdown = () => {
      showDropdown.value = false;
    };

    // Trigger file input when a valid option is selected
    const handleDropdownChange = () => {
      if (selectedForm.value) {
        fileInput.value?.click(); //  trigger the file input
      }
    };

    // Handle file upload with axios
    const handleFileUpload = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input?.files?.[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Determine route
        let route = '';
        if (selectedForm.value === 'led') route = 'led';
        if (selectedForm.value === 'config') route = 'config';
        if (selectedForm.value === 'experiment') route = 'exp_tmp';

        try {
          const response = await axios.post(route, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Upload successful:', response.data);
        } catch (error) {
          if (axios.isAxiosError(error)){
            console.error(error.message)
          }
          else{
            console.error(error)
          }
        } finally {
          // Reset selectedForm and close the dropdown
          selectedForm.value = '';
          closeDropdown();
        }
      }
    };

    return {
      showDropdown,
      selectedForm,
      fileInput,
      closeDropdown,
      handleDropdownChange,
      handleFileUpload,
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
  height: 200px;
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
  content: "Upload Config";
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

.close-button {
  justify-content: center;
  margin-top: 40px;
}
</style>
