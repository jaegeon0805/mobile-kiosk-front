import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";
import "@/assets/scss/_index.scss";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        background: "#ffffff",
        surface: "#f2f5f8",
        primary: "#009688",
        secondary: "#4a4a4a",
        accent: "#ffca28",
        error: "#d32f2f",
        info: "#1976d2",
        success: "#2e7d32",
        warning: "#f57c00",
      },
    },
  },
});
