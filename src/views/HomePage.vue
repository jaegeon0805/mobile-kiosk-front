<template>
  <div>
    test {{ profile }}
    <span>{{ profile }}</span>
  </div>
</template>

<script setup lang="ts">
import { getApi } from "@/utils/apis";
import { onMounted, ref } from "vue";

const profile = ref("");

onMounted(async () => {
  const response = await getApi<string>("profile");
  if (response.success) {
    profile.value = response.data;
  }
});
</script>
