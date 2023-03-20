<template>
  <v-card class="elevation-6">
    <v-card-text>
      <h4 class="text-center">계정에 로그인하세요.</h4>
      <h6 class="text-center grey--text">
        아직 회원이 아니시라면 회원가입을 클릭해 주세요.
      </h6>

      <v-card-text class="pa-0 mt-10">
        <v-form>
          <validation-observer ref="observer">
            <validation-provider
              v-slot="{ errors, valid }"
              name="Email"
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
                prepend-inner-icon="mdi-account-outline"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors, valid }"
              name="Password"
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
                prepend-inner-icon="mdi-lock-outline"
              />
            </validation-provider>
            <v-btn color="primary" block :loading="loading" @click="submit"
              >로그인</v-btn
            >
          </validation-observer>
        </v-form>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { postApi } from "@/utils/apis";
import { Token } from "@/definitions/types";
import { useMemberStore } from "@/stores/member";
import { routerReplace } from "@/utils/utils";

const { isSignedIn, saveToken } = useMemberStore();

const email = ref("");
const password = ref("");
const loading = ref(false);

async function submit(): Promise<void> {
  const inValid = await observer.value?.validate();
  if (!inValid) {
    return;
  }

  loading.value = true;
  const response = await postApi<Token>("sign-in", {
    email: email.value,
    password: password.value,
  });

  if (response.success && response.result) {
    saveToken(response.result);
    await routerReplace("/");
  }
  loading.value = false;
}

onMounted(async () => {
  if (isSignedIn) {
    await routerReplace("/");
    return;
  }
});

const observer = ref();
</script>
