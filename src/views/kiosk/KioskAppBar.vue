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
          @click="routerPush(`/kiosk/${currentStore.id}`)"
        >
          mdi-arrow-left
        </v-icon>
        <v-spacer />
        <v-badge :content="cartItemCount" :value="cartItemCount" overlap>
          <v-icon color="white">mdi-cart-outline</v-icon>
        </v-badge>
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
        <v-icon
          v-if="backSpaceButton"
          class="mr-2"
          color="black"
          @click="routerPush(`/kiosk/${currentStore.id}`)"
        >
          mdi-arrow-left
        </v-icon>
        <span class="text-subtitle-1 font-weight-bold text-ellipsis">
          {{ title }}
        </span>
        <v-spacer />
        <v-badge :content="cartItemCount" :value="cartItemCount" overlap>
          <v-icon color="black">mdi-cart-outline</v-icon>
        </v-badge>
      </v-app-bar>
    </v-slide-y-transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import { routerPush } from "@/utils/commands";

const { currentStore, cartItemCount } = storeToRefs(useKioskStore());

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
