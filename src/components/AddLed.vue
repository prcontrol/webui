<template>
  <!-- Form overlay, visible only when showForm is true -->
  <div class="overlay-on-select">
    <div class="overlay-container">
      <h2>Create LED</h2>
      <form >
        <div class="arrange-content">
        <div class="left-content">
        <div class="form-field">
          <label for="uid">Unique Identifier:</label>
          <input id="uid" v-model="formData.uid" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="name">Name:</label>
          <input id="name" v-model="formData.name" type="text" required />
        </div>
        <div class="form-field">
          <label for="fwhm">FWHM (full width at half maximum):</label>
          <input id="fwhm" v-model="formData.fwhm" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="max-of-emission">Maximum of emission:</label>
          <input id="max_of_emission" v-model="formData.max_of_emission" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="min-wavelength">Minimal wavelength:</label>
          <input id="min_wavelength" v-model="formData.min_wavelength" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="max-wavelength">Maximum wavelength:</label>
          <input id="max_wavelength" v-model="formData.max_wavelength" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="color">Color:</label>
          <input id="color" v-model="formData.color" type="text" required />
        </div>
        <div class="form-field">
          <label for="max-current">Maximum current (mA):</label>
          <input id="max_current" v-model="formData.max_current" :placeholder="'int'" type="text" required />
        </div>
        </div>

        <div class="right-content">
        <div class="form-field">
          <label for="manufacturer-id">Manufacturer ID:</label>
          <input id="manufacturer_id" v-model="formData.manufacturer_id" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="order_id">Order ID:</label>
          <input id="order_id" v-model="formData.order_id" :placeholder="'int'" type="number" required />
        </div>
        <div class="form-field">
          <label for="date-soldering">Date soldering:</label>
          <input id="date_soldering" v-model="formData.date_soldering" type="date" required />
        </div>
        <div class="form-field">
          <label for="soldered-by">Soldered by:</label>
          <input id="soldered_by" v-model="formData.soldered_by" type="text" required />
        </div>
        <div class="form-field">
          <label for="operating-time">Operating time (h):</label>
          <input id="operating_time" v-model="formData.operating_time" :placeholder="'float'" type="number" required />
        </div>
        <div class="form-field">
          <label for="defect">Defect:</label>
          <input id="defect" v-model="formData.defect" type="text" :placeholder="'true or false'" required />
        </div>
        <div class="form-field">
          <label for="emission-spectrum">Emission spectrum:</label>
          <input id="emission_spectrum" v-model="formData.emission_spectrum" type="text" required />
        </div>
        <div class="form-field">
          <label for="emission-spectrum-recorded-on">Emission spectrum recorded on:</label>
          <input id="emission_spectrum_recorded_on" v-model="formData.emission_spectrum_recorded_on" type="date" required />
        </div>
        </div>
        </div>
      </form>

        <!-- Submit and Close Buttons -->
      <div class="form-buttons">
        <button @click="submitForm">Submit</button>
        <button @click="closeForm">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AddLed',
  emits: ['close-form'],
  setup(_,{emit}) {
    const formData = ref({
      uid: '',
      name: '',
      fwhm: '',
      max_of_emission: '',
      min_wavelength: '',
      max_wavelength: '',
      color: '',
      max_current: '',
      manufacturer_id: '',
      order_id: '',
      date_soldering: '',
      soldered_by: '',
      operating_time: '',
      defect: '',
      emission_spectrum: '',
      emission_spectrum_recorded_on:'',
    });


    const closeForm = () => {
      emit('close-form');
    };


    // Handle form submission and create a JSON file
    const submitForm = () => {
      if (!formData.value.max_wavelength) {
         alert("Missing required field 'Maximum wavelength'");
         return;
        }

      formData.value.emission_spectrum = JSON.parse(formData.value.emission_spectrum);

      const jsonFile = new Blob([JSON.stringify(formData.value)], {
          type: 'application/json',
        });

      const uploadJSON = new FormData();
      uploadJSON.append('json_file', jsonFile, 'formData.json');

      axios.post('led', uploadJSON, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).catch((err) => {
        console.log(`Fehler beim hochladen: ${err}`)
      })

      closeForm();
    };

    const handleEsc = (event: KeyboardEvent) => {
      if(event.key === 'Escape') {
        closeForm();
      }
      };

      onMounted(() => {
        window.addEventListener('keydown', handleEsc);
      });

      onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEsc);
      });

    return {
      formData,
      submitForm,
      closeForm,
    };
  },
});
</script>

<style scoped>

.overlay-on-select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* Überlagert den Inhalt */
}
.overlay-container {
  background-color: white;
  padding: 20px;
  padding-left: 10px;
  padding-right: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 880px;
  height: auto;
}

.left-content, .right-content {
  flex: 1; /* Gleiche Breite für beide Inhalte */
}

.left-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Abstand zwischen den Feldern */
}

.right-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Abstand zwischen den Feldern */
}
.arrange-content{
  display: flex;
  flex-direction: row;
  gap: 20px; /* Abstand zwischen den Spalten */

}
.form-field {
  display: flex;
  flex-direction: column; /* Label oben, Input unten */
  align-items: flex-start; /* Links ausrichten */
  margin-bottom: 5px; /* Abstand zwischen den Feldern */
  padding-left: 17px;
}

.form-field label {
  font-size: 15px; /* Schriftgröße des Labels */
  margin-bottom: 5px; /* Abstand zwischen Label und Input */
  text-align: left; /* Links ausgerichtet */
}

.form-field input,
.form-field select {
  width: 100%; /* Eingabefelder passen sich der verfügbaren Breite an */
  max-width: auto; /* Optional: maximale Breite */
  box-sizing: border-box; /* Padding in die Gesamtbreite einbeziehen */
}

.form-buttons{
  display: flex;
  justify-content: center;
  gap: 20px;
  background-color: white;
  border: none;
  padding-top: 20px;
}
</style>
