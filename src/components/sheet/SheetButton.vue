<template>
  <v-card-actions>
    <v-row class="px-6 py-4 justify-end">
      <v-btn
        color="primary"
        class="mr-1 px-6"
        :outlined="saveBtn"
        :loading="loading"
        @click="sheet = false"
        >{{ closeBtnTitle }}
      </v-btn>
      <v-btn
        v-if="saveBtn"
        class="px-6"
        color="primary"
        :loading="loading"
        @click="emits('save')"
      >
        {{ saveBtnTitle }}
      </v-btn>
    </v-row>
  </v-card-actions>
</template>

<script setup lang="ts">
import { useVModels } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    sheet: boolean;
    loading?: boolean;
    saveBtnTitle?: string;
    closeBtnTitle?: string;
    saveBtn?: boolean;
  }>(),
  {
    loading: false,
    saveBtnTitle: "저장",
    closeBtnTitle: "취소",
    saveBtn: true,
  }
);

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
  (e: "save"): void;
}>();

const { sheet } = useVModels(props, emits);
</script>
