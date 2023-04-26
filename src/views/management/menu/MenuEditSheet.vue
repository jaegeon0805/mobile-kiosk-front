<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="메뉴" :is-new="isNew" />
        <v-card-text>
          <v-form>
            <validation-observer ref="observer">
              <v-row dense>
                <v-col cols="12" class="d-flex">
                  <ImageCropperDialog v-model="value.imageUrl" class="mr-4" />
                  <div class="flex-grow-1">
                    <validation-provider
                      v-slot="{ errors }"
                      name="메뉴명"
                      rules="required|nameWithSymbol"
                    >
                      <v-text-field
                        v-model="value.name"
                        label="메뉴명"
                        :error-messages="errors"
                        autocomplete="false"
                        counter="20"
                        clearable
                      />
                    </validation-provider>
                    <validation-provider
                      v-slot="{ errors }"
                      name="메뉴 설명"
                      rules="max:255"
                    >
                      <v-textarea
                        v-model="value.description"
                        class="mt-1"
                        label="메뉴 설명"
                        :error-messages="errors"
                        autocomplete="false"
                        counter="255"
                        clearable
                        outlined
                        no-resize
                      />
                    </validation-provider>
                  </div>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="메뉴 가격"
                    rules="required|price"
                  >
                    <v-text-field
                      v-model="displayPrice"
                      prefix="₩"
                      label="메뉴 가격"
                      :error-messages="errors"
                      autocomplete="false"
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
                class="font-weight-black mr-4"
                dense
              />
              <v-checkbox
                v-model="value.soldOutFlag"
                label="매진"
                class="font-weight-black"
                dense
              />
              <v-spacer />
              <span class="text-subtitle-2 error--text"
                >* 옵션은 메뉴를 생성 후 추가할 수 있습니다.</span
              >
            </v-row>
          </v-form>
        </v-card-text>
        <SheetButton :sheet.sync="sheet" :loading="loading" @save="save" />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { postApi, putApi } from "@/utils/apis";
import { useConfirmStore } from "@/stores/confirm";
import SheetButton from "@/components/sheet/SheetButton.vue";
import { useStoreStore } from "@/stores/store";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { useEdit } from "@/compositions/useEdit";
import { Category, Menu } from "@/definitions/entities";
import ImageCropperDialog from "@/components/uploader/ImageCropperDialog.vue";

const { confirmCreate, confirmUpdate } = useConfirmStore();
const { fetchStoreList } = useStoreStore();

const props = defineProps<{
  value: Menu;
  sheet: boolean;
  category: Category;
}>();

const emits = defineEmits<{
  (e: "input", v: Menu): void;
  (e: "update:sheet", v: boolean): void;
  (e: "created"): void;
  (e: "updated"): void;
}>();

const displayPrice = computed({
  get() {
    return Number(value.value.price).toLocaleString();
  },
  set(newValue) {
    const parsedValue = parseInt(newValue.replace(/\D/g, ""));
    value.value.price = isNaN(parsedValue) ? 0 : parsedValue;
  },
});

const { value, sheet, loading, isNew } = useEdit<Menu>(props, emits);

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
      `menus?categoryId=${props.category.id}`,
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
    const response = await putApi(`menus/${value.value.id}`, value.value);
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
