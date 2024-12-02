<template>
  <!-- Form overlay, visible only when showForm is true -->
  <div class="overlay-on-select">
    <div class="overlay-container">
      <h2>LED anlegen</h2>
      <form @submit.prevent="handleSubmit">
        <div class="arrange-content">
        <div class="left-content">
        <div class="form-field">
          <label for="uid">Laufende Nr.:</label>
          <input id="uid" v-model="formData.uid" type="number" required />
        </div>
        <div class="form-field">
          <label for="fwhm">FWHM (full width at half maximum):</label>
          <input id="fwhm" v-model="formData.fwhm" type="number" required />
        </div>
        <div class="form-field">
          <label for="max-ofemission">Emissionsmaximum:</label>
          <input id="max_of_emission" v-model="formData.max_of_emission" type="number" required />
        </div>
        <div class="form-field">
          <label for="min-wavelength">Minimale Wellenlänge:</label>
          <input id="min_wavelength" v-model="formData.min_wavelength" type="number" required />
        </div>
        <div class="form-field">
          <label for="max-wavelength">Maximale Wellenlänge:</label>
          <input id="max_wavelength" v-model="formData.max_wavelength" type="number" required />
        </div>
        <div class="form-field">
          <label for="color">Farbe:</label>
          <input id="color" v-model="formData.color" type="text" required />
        </div>
        <div class="form-field">
          <label for="max-current">Farbe:</label>
          <input id="max_current" v-model="formData.max_current" type="text" required />
        </div>
        <div class="form-field">
          <label for="max-current">Maximaler STrom (mA):</label>
          <input id="max_current" v-model="formData.max_current" type="number" required />
        </div>
        </div>

        <div class="right-content">
        <div class="form-field">
          <label for="manufacturer-id">Hersteller-Nr.:</label>
          <input id="manufacturer_id" v-model="formData.manufacturer_id" type="number" required />
        </div>
        <div class="form-field">
          <label for="order_id">Bestell-Nr.:</label>
          <input id="order_id" v-model="formData.order_id" type="number" required />
        </div>
        <div class="form-field">
          <label for="date-soldering">Gelötet am:</label>
          <input id="date_soldering" v-model="formData.date_soldering" type="date" required />
        </div>
        <div class="form-field">
          <label for="soldered-by">Gelötet von:</label>
          <input id="soldered_by" v-model="formData.soldered_by" type="text" required />
        </div>
        <div class="form-field">
          <label for="operating-time">Kumulative Betriebszeit in Stunden:</label>
          <input id="operating_time" v-model="formData.operating_time" type="number" required />
        </div>
        <div class="form-field">
          <label for="defect">Defekt (true / false):</label>
          <input id="defect" v-model="formData.defect" type="text" required />
        </div>
        <div class="form-field">
          <label for="emission-spectrum">Emissionsspektrum:</label>
          <input id="emission_spectrum" v-model="formData.emission_spectrum" type="text" required />
        </div>
        <div class="form-field">
          <label for="emission-spectrum-recorded-on">Emissionsspektrum aufgenommen am:</label>
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
      whm: '',
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

    const handleEsc = (event: KeyboardEvent) => {
      // Schließt das Dropdown nur, wenn die ESC-Taste gedrückt wird
      if(event.key === 'Escape') {
        closeForm();  // Funktion hier korrekt aufrufen
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
