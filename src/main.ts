import Vue from "vue";
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'

new Vue({
    vuetify,
    render: (h) => h(App)
}).$mount('#app');