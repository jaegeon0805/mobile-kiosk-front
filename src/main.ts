import Vue from "vue";
import "@/style.css";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import pinia from "@/stores";
import router from "@/router";
import "@/plugins/vee-validate";

new Vue({
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
