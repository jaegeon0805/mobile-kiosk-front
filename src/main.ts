import Vue from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import pinia from "@/stores";
import router from "@/router";
import "@/plugins/vee-validate";
import draggable from "vuedraggable";

// eslint-disable-next-line vue/multi-word-component-names
Vue.component("draggable", draggable);

new Vue({
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
