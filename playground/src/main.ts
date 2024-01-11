import { createApp } from 'vue';
import './assets/style.scss';
import App from './App.vue';

import { a, b } from '@/utils/foo';
import { barA, barB } from '@/utils/bar';
console.log('in main.ts: a', a, 'b', b, 'barA', barA, 'barB', barB);

createApp(App).mount('#app');
