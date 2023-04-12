import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";
import "@/assets/scss/_index.scss";
import ko from "vuetify/src/locale/ko";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  lang: {
    locales: { ko },
    current: "ko",
  },
});
