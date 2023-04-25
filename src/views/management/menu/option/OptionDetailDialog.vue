<template>
  <v-dialog v-model="sheet" width="600px">
    <v-card class="d-flex flex-column overflow-hidden">
      <v-card-title class="text-subtitle-1 font-weight-black primary--text"
        >옵션 {{ isNew ? "등록" : "수정" }}</v-card-title
      >
      <v-card-text>
        <v-form>
          <validation-observer ref="observer">
            <v-row dense>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="옵션명"
                  rules="required|max:20"
                >
                  <v-text-field
                    v-model="value.name"
                    label="옵션명"
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
                  name="금액"
                  rules="required"
                >
                  <v-text-field
                    v-model="value.price"
                    label="금액"
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

      <v-card-actions class="pa-0">
        <div class="dialog-button cancel-button" @click="sheet = false">
          취소
        </div>
        <div class="dialog-button confirm-button" @click="save">저장</div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import "cropperjs/dist/cropper.css";
import { OptionDetail, OptionGroup } from "@/definitions/entities";
import { useEdit } from "@/compositions/useEdit";
import { postApi, putApi } from "@/utils/apis";
import { ref } from "vue";
import { useConfirmStore } from "@/stores/confirm";

const { confirmCreate, confirmUpdate } = useConfirmStore();

const props = defineProps<{
  value: OptionDetail;
  sheet: boolean;
  optionGroup: OptionGroup;
}>();

const emits = defineEmits<{
  (e: "input", v: OptionDetail): void;
  (e: "update:sheet", v: boolean): void;
  (e: "created", v: OptionDetail): void;
  (e: "updated", v: OptionDetail): void;
}>();

const { value, sheet, loading, isNew } = useEdit<OptionDetail>(props, emits);

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
    const response = await postApi<OptionDetail>(
      `option-details?optionGroupId=${props.optionGroup.id}`,
      value.value
    );
    loading.value = false;

    if (response.success) {
      sheet.value = false;
      emits("created", response.result);
    }
  });
}

async function update(): Promise<void> {
  confirmUpdate(async () => {
    loading.value = true;
    const response = await putApi<OptionDetail>(
      `option-details/${value.value.id}`,
      value.value
    );
    loading.value = false;

    if (response.success) {
      sheet.value = false;
      emits("updated", response.result);
    }
  });
}

const observer = ref();
</script>

<style scoped>
.cropper img {
  width: 100%;
}

.dialog-button {
  display: inline-block;
  width: 50%;
  height: 65px;
  line-height: 65px;
  text-align: center;
  cursor: pointer;
}

.cancel-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 400;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background-color: #2196f3;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #1976d2;
}
</style>
