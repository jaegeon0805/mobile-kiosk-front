<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <v-card-title class="primary--text font-weight-black">
          프로파일 수정
          <v-spacer />
          <TagChip
            value="회원 탈퇴"
            color="error"
            class="font-weight-black"
            @click="deleteMe"
          />
        </v-card-title>
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="이메일"
                    disabled
                    :value="myProfile.email"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="권한"
                    disabled
                    :value="myProfile.role === 'ROLE_USER' ? '일반' : '어드민'"
                  />
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="이름"
                    rules="required|name"
                  >
                    <v-text-field
                      label="이름"
                      v-model="myProfile.name"
                      :error-messages="errors"
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
          @save="changeName"
          save-btn-title="수정"
        />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { onBeforeMount, ref } from "vue";
import { Member } from "@/definitions/entities";
import { defaultMember } from "@/definitions/defaults";
import TagChip from "@/components/button/TagChip.vue";
import { deleteApi, patchApi } from "@/utils/apis";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { useConfirmStore } from "@/stores/confirm";
import { routeSignInPage } from "@/utils/commands";
import SheetButton from "@/components/sheet/SheetButton.vue";

const { saveMyProfile } = useMemberStore();
const { confirmDelete, confirmUpdate } = useConfirmStore();
const { member } = storeToRefs(useMemberStore());

const props = defineProps<{
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
}>();

const { sheet } = useVModels(props, emits);

const myProfile = ref<Member>(defaultMember());

async function changeName() {
  const isValid = await observer.value?.validate();
  if (!isValid) {
    return;
  }

  confirmUpdate(async () => {
    const response = await patchApi("my-profile/name", {
      name: myProfile.value.name,
    });
    if (response.success) {
      await saveMyProfile();
      myProfile.value = { ...member.value };
      sheet.value = false;
    }
  });
}

async function deleteMe() {
  confirmDelete(async () => {
    const response = await deleteApi("my-profile", false);

    if (response.success) {
      await routeSignInPage();
    }
  });
}

onBeforeMount(async () => {
  myProfile.value = { ...member.value };
});
const observer = ref();
</script>
