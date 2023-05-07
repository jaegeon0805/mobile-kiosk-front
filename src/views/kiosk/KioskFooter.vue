<template>
  <v-slide-y-transition>
    <v-footer app color="white" height="70px" elevation="3">
      <v-btn
        block
        large
        :disabled="disabled"
        color="primary"
        class="font-weight-black text-body-1"
        @click="emits('click')"
      >
        <slot />
      </v-btn>
    </v-footer>
  </v-slide-y-transition>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>();
const emits = defineEmits<{ (e: "click"): void }>();
</script>
