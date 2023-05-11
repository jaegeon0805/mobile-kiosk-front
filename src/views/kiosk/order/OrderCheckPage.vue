<template>
  <div>
    {{ test }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSpinnerStore } from "@/stores/loadingSpinner";
import { getApi } from "@/utils/apis";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";

const { load } = useSpinnerStore();
const { customerUuid } = storeToRefs(useKioskStore());

const test = ref([]);
onMounted(async () => {
  await load(async () => {
    const response = await getApi(
      `kiosk-orders?customerUuid=${customerUuid.value}`
    );

    if (response.success) {
      test.value = response.result;
    }
  });
});
</script>
