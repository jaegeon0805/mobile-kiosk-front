<template>
  <v-card class="elevation-6">
    <v-card-text>
      <h4 class="text-center">회원가입에 필요한 정보를 입력해주세요.</h4>
      <h6 class="text-center grey--text">
        이미 회원이라면
        <a class="primary--text" @click="routerPush('sign-in')">로그인</a>을
        클릭해 주세요.
      </h6>

      <v-card-text class="pa-0 mt-6">
        <v-form>
          <validation-observer ref="observer">
            <validation-provider
              v-slot="{ errors, valid }"
              name="이메일"
              vid="email"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                :error-messages="emailError || errors"
                :success="valid"
                autocomplete="false"
                prepend-inner-icon="mdi-email-outline"
                :loading="emailChecking"
                clearable
                @input="checkEmail"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors, valid }"
              name="비밀번호"
              vid="password"
              rules="required|password"
            >
              <v-text-field
                v-model="password"
                type="password"
                label="Password"
                outlined
                dense
                :error-messages="errors"
                :success="valid"
                autocomplete="false"
                clearable
                prepend-inner-icon="mdi-lock-outline"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors, valid }"
              name="비밀번호 확인"
              rules="required|confirmed:password"
            >
              <v-text-field
                v-model="passwordCheck"
                type="password"
                label="Check PW"
                outlined
                dense
                :error-messages="errors"
                :success="valid"
                autocomplete="false"
                clearable
                prepend-inner-icon="mdi-lock-check-outline"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors, valid }"
              name="이름"
              rules="required"
            >
              <v-text-field
                v-model="name"
                label="Name"
                outlined
                dense
                :error-messages="errors"
                :success="valid"
                autocomplete="false"
                clearable
                prepend-inner-icon="mdi-account-outline"
              />
            </validation-provider>
            <v-btn color="primary" block :loading="loading" @click="submit"
              >회원가입</v-btn
            >
          </validation-observer>
        </v-form>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getApi, postApi } from "@/utils/apis";
import { Token } from "@/definitions/types";
import { useMemberStore } from "@/stores/member";
import { routerPush, routerReplace } from "@/utils/utils";
import validator from "validator";
import { useDebounceFn } from "@vueuse/core";

const { saveToken } = useMemberStore();

const email = ref("");
const password = ref("");
const passwordCheck = ref("");
const name = ref("");
const existsEmail = ref(false);
const emailChecking = ref(false);
const loading = ref(false);

const emailError = computed((): string | undefined => {
  return existsEmail.value
    ? "이미 사용중이거나 탈퇴한 아이디입니다."
    : undefined;
});

async function submit(): Promise<void> {
  const inValid = await observer.value?.validate();
  if (!inValid || existsEmail.value) {
    return;
  }

  loading.value = true;
  const response = await postApi<Token>("sign-up", {
    email: email.value,
    password: password.value,
    name: name.value,
  });

  if (response.success && response.result) {
    saveToken(response.result);
    await routerReplace("/");
  }
  loading.value = false;
}

function checkEmail() {
  if (!validator.isEmail(email.value)) {
    return;
  }
  debouncedCheckEmail();
}

const debouncedCheckEmail = useDebounceFn(async () => {
  loading.value = true;
  emailChecking.value = true;
  const response = await getApi<boolean>(
    `members/exists-email?email=${email.value}`
  );
  if (response.success) {
    existsEmail.value = response.result;
  }
  emailChecking.value = false;
  loading.value = false;
}, 500);

const observer = ref();
</script>
