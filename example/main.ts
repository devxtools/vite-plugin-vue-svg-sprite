// example/main.ts
import { createApp } from 'vue';
import App from './app.vue';

import router from './router';

// 挂载 Vue 应用
const VueApp = createApp(App);
VueApp.use(router);
VueApp.mount('#app');