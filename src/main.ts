import Vue from "vue";
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import pinia from "./stores";

new Vue({
    pinia,
    vuetify,
    render: (h) => h(App)
}).$mount('#app');