<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="지점" :is-new="isNew" />
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors, valid }"
                    name="지점 이름"
                    rules="required|max:20"
                  >
                    <v-text-field
                      v-model="value.name"
                      label="지점 이름"
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
        <SheetButton :sheet.sync="sheet" :loading="loading" @save="save" />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { postApi, putApi } from "@/utils/apis";
import { useConfirmStore } from "@/stores/confirm";
import SheetButton from "@/components/sheet/SheetButton.vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { useStoreStore } from "@/stores/store";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { Store } from "@/definitions/entities";
import { useEdit } from "@/compositions/useEdit";

const { confirmCreate, confirmUpdate } = useConfirmStore();
const { member } = storeToRefs(useMemberStore());
const { fetchStoreList } = useStoreStore();

const props = defineProps<{
  value: Store;
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "input", v: Store): void;
  (e: "update:sheet", v: boolean): void;
}>();

const { value, sheet, loading, isNew } = useEdit<Store>(props, emits);

async function save() {
  const isValid = observer.value?.validate();
  if (!isValid) {
    return;
  }

  if (isNew.value) {
    await create();
  } else {
    await update();
  }
}

async function create(): Promise<void> {
  confirmCreate(async () => {
    loading.value = true;
    const response = await postApi("stores", {
      member: member.value,
      name: value.value.name,
    });
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
    }
  });
}

async function update(): Promise<void> {
  loading.value = true;
  confirmUpdate(async () => {
    const response = await putApi(`stores/${value.value.id}`, {
      name: value.value.name,
    });
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
    }
  });
}

const observer = ref();
</script>
