<template>
  <v-slide-y-transition>
    <v-app-bar
      v-show="showAppBar"
      fixed
      elevation="0"
      color="white"
      height="48px"
      width="100%"
    >
      <span class="text-subtitle-1 font-weight-bold">
        {{ title }}
      </span>
      <v-spacer />
      <v-icon>mdi-cart-outline</v-icon>
    </v-app-bar>
  </v-slide-y-transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  title?: string;
}>();

const showAppBar = ref(false);

function handleScroll() {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  showAppBar.value = scrollPosition > 48;
}

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
