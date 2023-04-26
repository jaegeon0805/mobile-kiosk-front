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
  return "영문자, 숫자, 특수문자로 4~20자를 입력하세요.";
});

extend("name", (name) => {
  const nameRegex = /^[a-zA-Z0-9가-힣]{1,20}$/;

  if (nameRegex.test(name)) {
    return true;
  }
  return "한글, 영문자, 숫자로 1~20자를 입력하세요.";
});

extend("nameWithSpace", (name) => {
  const nameRegex = /^(?! )[a-zA-Z0-9가-힣 ]{1,20}(?<! )$/;

  if (nameRegex.test(name)) {
    return true;
  }
  return "한글, 영문자, 숫자, 공백으로 1~20자를 입력하세요. (공백은 맨 앞뒤에 사용할 수 없습니다.) ";
});

extend("nameWithSymbol", (name) => {
  const nameRegex = /^(?! )[a-zA-Z0-9가-힣()+ ]{1,20}(?<! )$/;

  if (nameRegex.test(name)) {
    return true;
  }
  return "한글, 영문자, 숫자, 공백, '(', ')', '+'로 1~20자를 입력하세요. (공백은 맨 앞뒤에 사용할 수 없습니다.) ";
});

extend("price", (price) => {
  const actualPrice = parseInt(price.replace(/\D/g, ""));

  if (!isNaN(actualPrice) && actualPrice <= 1000000000) {
    return true;
  }
  return "금액은 10억을 넘길 수 없습니다.";
});

Vue.config.productionTip = false;
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
