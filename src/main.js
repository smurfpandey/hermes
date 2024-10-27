import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faTrain } from '@fortawesome/free-solid-svg-icons';

import './assets/index.css';
import App from './App.vue';

library.add([faArrowRight, faCalendar, faClock, faTrain]);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
