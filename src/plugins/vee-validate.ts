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

extend("password", (password) => {
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{4,20}$/;

  if (passwordRegex.test(password)) {
    return true;
  }
  return "4~20자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
});

Vue.config.productionTip = false;
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
