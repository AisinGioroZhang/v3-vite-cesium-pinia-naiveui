import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from "pinia";
import router from "./router";
import 'vfonts/Lato.css'     // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体

const app = createApp(App)
const pinia =createPinia() 
app.use(pinia)
app.use(router)
app.mount("#app");

