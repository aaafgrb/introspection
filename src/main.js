import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./test.js"
import { createPinia } from 'pinia';

//import mitt from 'mitt';
//const emitter = mitt();
//app.config.globalProperties.emitter = emitter;

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
