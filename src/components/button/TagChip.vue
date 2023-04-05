<template>
  <v-chip
    :color="color"
    :text-color="textColor"
    label
    small
    class="mr-1"
    @click="$emit('click')"
  >
    <v-icon v-if="icon" left small>{{ icon }}</v-icon>
    {{ value }}
  </v-chip>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string;
    color?: string;
    textColor?: string;
    icon?: string;
  }>(),
  {
    color: "primary",
    textColor: "",
    icon: "",
  }
);

defineEmits<{
  (e: "click"): void;
}>();
</script>
