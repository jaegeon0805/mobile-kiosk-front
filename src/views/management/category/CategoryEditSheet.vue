<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="카테고리" :is-new="isNew" />
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="카테고리 이름"
                    rules="required|max:20"
                  >
                    <v-text-field
                      v-model="value.name"
                      label="카테고리 이름"
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
                    name="카테고리 설명"
                    rules="max:255"
                  >
                    <v-textarea
                      v-model="value.description"
                      label="카레고리 설명"
                      :error-messages="errors"
                      autocomplete="false"
                      counter="255"
                      clearable
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </validation-observer>
            <v-row class="px-3">
              <v-checkbox
                v-model="value.availableFlag"
                label="활성"
                class="font-weight-black"
                dense
              />
              <span class="ml-2 mt-2">
                비활성 시 판매 페이지에 노출되지 않습니다.
              </span>
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
import { storeToRefs } from "pinia";
import { useStoreStore } from "@/stores/store";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { Category, Store } from "@/definitions/entities";
import { useEdit } from "@/compositions/useEdit";

const { confirmCreate, confirmUpdate } = useConfirmStore();
const { selectedStore } = storeToRefs(useStoreStore());
const { fetchStoreList } = useStoreStore();

const props = defineProps<{
  value: Category;
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "input", v: Store): void;
  (e: "update:sheet", v: boolean): void;
  (e: "created"): void;
  (e: "updated"): void;
}>();

const { value, sheet, loading, isNew } = useEdit<Category>(props, emits);

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
    const response = await postApi(
      `categories?storeId=${selectedStore.value.id}`,
      value.value
    );
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
      emits("created");
    }
  });
}

async function update(): Promise<void> {
  confirmUpdate(async () => {
    loading.value = true;
    const response = await putApi(`categories/${value.value.id}`, value.value);
    loading.value = false;

    if (response.success) {
      await fetchStoreList();
      sheet.value = false;
      emits("updated");
    }
  });
}

const observer = ref();
</script>
