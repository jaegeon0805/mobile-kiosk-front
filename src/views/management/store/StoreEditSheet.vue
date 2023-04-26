<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="점포" :is-new="isNew" />
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="점포명"
                    rules="required|nameWithSpace"
                  >
                    <v-text-field
                      v-model="value.name"
                      label="점포명"
                      :error-messages="errors"
                      autocomplete="false"
                      counter="20"
                      clearable
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="점포 설명"
                    rules="max:255"
                  >
                    <v-textarea
                      v-model="value.description"
                      label="점포 설명"
                      :error-messages="errors"
                      autocomplete="false"
                      counter="255"
                      clearable
                      outlined
                      no-resize
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </validation-observer>
            <v-row class="px-3">
              <v-checkbox
                v-model="value.availableFlag"
                label="오픈"
                class="font-weight-black"
                dense
              />
            </v-row>
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
  (e: "created", v: Store): void;
  (e: "updated", v: Store): void;
}>();

const { value, sheet, loading, isNew } = useEdit<Store>(props, emits);

async function save() {
  const isValid = await observer.value?.validate();
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
    const response = await postApi<Store>(
      `stores?memberId=${member.value.id}`,
      value.value
    );
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
      emits("created", response.result);
    }
  });
}

async function update(): Promise<void> {
  confirmUpdate(async () => {
    loading.value = true;
    const response = await putApi<Store>(
      `stores/${value.value.id}`,
      value.value
    );
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
      emits("updated", response.result);
    }
  });
}

const observer = ref();
</script>
