<template>
  <v-card-title class="primary--text font-weight-black">
    {{ titleText }}
  </v-card-title>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  hideSuffix?: boolean;
  isNew?: boolean;
}>();

const titleText = computed((): string => {
  return props.hideSuffix
    ? props.title
    : `${props.title} ${props.isNew ? "생성" : "수정"}`;
});
</script>
