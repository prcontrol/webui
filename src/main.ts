import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import AddLed from './components/AddLed.vue';
import { LED } from './configTypes';
import { upload_led } from './apiBindings';

// not sure if this is the right way to do it...
if(process.env.VUE_APP_PRCONTROL_API_URL == undefined) {
  alert("VUE_APP_PRCONTROL_API_URL not set!");
}
axios.defaults.baseURL = process.env.VUE_APP_PRCONTROL_API_URL;
export const wsUrl = process.env.VUE_APP_PRCONTROL_API_URL.replace(/^http/, 'ws');

const websocket = new WebSocketService(wsUrl);
export const ws_observables =  websocket.observables;

createApp(App).mount('#app');


const led: LED = {
  uid: 0,
  name: '',
  max_current_ma: 0,
  min_wavelength: 0,
  max_wavelength: 0,
  color: '',
  fwhm: 0,
  max_of_emission: 0,
  soldered_by_on: '',
  defect: false,
  emission_spectrum: '',
  misc: ''
};

upload_led(led).catch((err) => console.log(err));
