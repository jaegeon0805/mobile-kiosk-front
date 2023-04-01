<template>
  <v-app>
    <component :is="currentLayout">
      <router-view />
    </component>
    <GlobalAlert />
    <GlobalConfirm />
  </v-app>
</template>

<script setup lang="ts">
import DefaultLayout from "@/views/layouts/DefaultLayout.vue";
import { computed } from "vue";
import AuthLayout from "@/views/layouts/AuthLayout.vue";
import router from "@/router";
import GlobalAlert from "@/views/components/dialog/GlobalAlert.vue";
import GlobalConfirm from "@/views/components/dialog/GlobalConfirm.vue";

const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
};
const currentLayout = computed(
  () =>
    router.app.$route.name !== null &&
    layouts[router.app.$route.meta?.layout || "default"]
);
</script>
