import Vue from "vue";
import {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import ko from "vee-validate/dist/locale/ko.json";

localize({
  ko,
});

localize("ko");

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

Vue.config.productionTip = false;
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
