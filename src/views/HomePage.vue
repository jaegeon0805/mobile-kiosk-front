<template>
  <div>
    <span>{{ profile }} : Home Page..</span>
  </div>
</template>

<script setup lang="ts">
import { getApi } from "@/utils/apis";
import { onMounted, ref } from "vue";

const profile = ref("");

onMounted(async () => {
  const response = await getApi<string>("profile/test");
  if (response.success) {
    profile.value = response.result;
  }
});
</script>
