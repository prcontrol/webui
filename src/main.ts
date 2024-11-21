import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// not sure if this is the right way to do it...
if(process.env.VUE_APP_PRCONTROL_API_URL == undefined) {
  alert("VUE_APP_PRCONTROL_API_URL not set!");
}
axios.defaults.baseURL = process.env.VUE_APP_PRCONTROL_API_URL;
createApp(App).mount('#app');
