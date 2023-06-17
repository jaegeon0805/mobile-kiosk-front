<template>
  <v-card class="elevation-6">
    <v-card-text>
      <h4 class="text-center">계정에 로그인하세요.</h4>
      <h6 class="text-center grey--text">
        아직 회원이 아니시라면
        <router-link class="primary--text" to="sign-up">회원가입</router-link>을
        클릭해 주세요.
      </h6>

      <v-card-text class="pa-0 mt-6">
        <v-form>
          <validation-observer ref="observer">
            <validation-provider
              v-slot="{ errors, valid }"
              name="이메일"
              rules="required|email"
            >
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                :error-messages="errors"
                :success="valid"
                autocomplete="false"
                clearable
                prepend-inner-icon="mdi-email-outline"
                @keyup.enter="submit"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors, valid }"
              name="비밀번호"
              rules="required"
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
                @keyup.enter="submit"
              />
            </validation-provider>
            <span
              v-if="errorMessage"
              class="d-flex text-left error-message mb-2"
            >
              이메일 또는 비밀번호를 잘못 입력했습니다.<br />입력하신 내용을
              다시 확인해주세요.
            </span>
            <v-btn color="primary" block :loading="loading" @click="submit"
              >로그인</v-btn
            >
          </validation-observer>
        </v-form>
        <span class="font-weight-black hr-sect">간편 로그인</span>
        <div class="d-flex justify-center">
          <v-img
            :src="require('/src/assets/img/google-logo.png')"
            class="social-button mr-2"
            @click="socialLogin(PROVIDER_TYPE.GOOGLE)"
          />
          <v-img
            :src="require('/src/assets/img/naver-logo.png')"
            class="social-button"
            @click="socialLogin(PROVIDER_TYPE.NAVER)"
          />
        </div>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { postApi } from "@/utils/apis";
import { Token } from "@/definitions/types";
import { useMemberStore } from "@/stores/member";
import { routerReplace } from "@/utils/commands";
import { useAlertStore } from "@/stores/alert";
import { useStoreStore } from "@/stores/store";
import { PROVIDER_TYPE } from "@/definitions/enums";
import envs from "@/constants/envs";

const { saveToken } = useMemberStore();
const { fetchStoreList } = useStoreStore();
const { toastClose } = useAlertStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref(false);

async function submit(): Promise<void> {
  const isValid = await observer.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    loading.value = true;
    const response = await postApi<Token>(
      "sign-in",
      {
        email: email.value,
        password: password.value,
      },
      false
    );

    if (response.success && response.result) {
      toastClose();
      await saveToken(response.result);
      await fetchStoreList();
      await routerReplace("/");
    } else {
      errorMessage.value = true;
    }
  } finally {
    loading.value = false;
  }
}

function socialLogin(providerType: string) {
  window.location.href = `${
    envs.API_HOST
  }oauth2/authorization/${providerType.toLowerCase()}?redirect_uri=${
    envs.FRONT_URL
  }oauth/redirect`;
}

const observer = ref();
</script>
