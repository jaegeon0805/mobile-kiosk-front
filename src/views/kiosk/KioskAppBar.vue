<template>
  <div>
    <v-slide-y-transition>
      <v-app-bar
        v-show="!shouldShowAppBar && transparentAppBar && !showAppBar"
        fixed
        elevation="0"
        color="transparent"
        height="50px"
        width="100%"
      >
        <v-icon
          v-if="backSpaceButton"
          class="mr-2"
          color="white"
          @click="router.back()"
        >
          mdi-arrow-left
        </v-icon>
        <v-spacer />
        <v-icon color="white">mdi-cart-outline</v-icon>
      </v-app-bar>
    </v-slide-y-transition>

    <v-slide-y-transition>
      <v-app-bar
        :app="shouldShowAppBar"
        v-show="shouldShowAppBar || showAppBar"
        fixed
        elevation="0"
        color="white"
        height="50px"
        width="100%"
      >
        <v-icon v-if="backSpaceButton" class="mr-2" @click="router.back()">
          mdi-arrow-left
        </v-icon>
        <span class="text-subtitle-1 font-weight-bold text-ellipsis">
          {{ title }}
        </span>
        <v-spacer />
        <v-icon>mdi-cart-outline</v-icon>
      </v-app-bar>
    </v-slide-y-transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import router from "@/router";

withDefaults(
  defineProps<{
    shouldShowAppBar?: boolean;
    transparentAppBar?: boolean;
    title?: string;
    backSpaceButton?: boolean;
  }>(),
  {
    title: "",
  }
);

const showAppBar = ref(false);

function handleScroll() {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  showAppBar.value = scrollPosition > 50;
}

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
