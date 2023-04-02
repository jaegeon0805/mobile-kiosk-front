<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <v-card-title class="primary--text font-weight-black">
          비밀번호 변경
        </v-card-title>
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors, valid }"
                    name="비밀번호"
                    rules="required"
                  >
                    <v-text-field
                      v-model="oldPassword"
                      type="password"
                      label="기존 비밀번호"
                      :error-messages="errors"
                      :success="valid"
                      autocomplete="false"
                      clearable
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors, valid }"
                    name="새로운 비밀번호"
                    vid="password"
                    rules="required|password"
                  >
                    <v-text-field
                      v-model="newPassword"
                      type="password"
                      label="새로운 비밀번호"
                      :error-messages="errors"
                      :success="valid"
                      autocomplete="false"
                      clearable
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors, valid }"
                    name="비밀번호 확인"
                    rules="required|confirmed:password"
                  >
                    <v-text-field
                      v-model="passwordCheck"
                      type="password"
                      label="비밀번호 확인"
                      :error-messages="errors"
                      :success="valid"
                      autocomplete="false"
                      clearable
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </validation-observer>
          </v-form>
        </v-card-text>
        <SheetButton
          :sheet.sync="sheet"
          @save="changePassword"
          save-btn-title="수정"
        />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { ref } from "vue";
import { patchApi } from "@/utils/apis";
import { useConfirmStore } from "@/stores/confirm";
import SheetButton from "@/views/components/sheet/SheetButton.vue";

const { confirmUpdate } = useConfirmStore();

const props = defineProps<{
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
}>();

const { sheet } = useVModels(props, emits);

const oldPassword = ref("");
const newPassword = ref("");
const passwordCheck = ref("");

async function changePassword() {
  const isValid = await observer.value?.validate();
  if (!isValid) {
    return;
  }

  confirmUpdate(async () => {
    const response = await patchApi("my-profile/password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    if (response.success) {
      sheet.value = false;
    }
  });
}

const observer = ref();
</script>
