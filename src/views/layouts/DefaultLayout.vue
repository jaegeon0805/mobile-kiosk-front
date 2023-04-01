<template>
  <div class="d-flex flex-grow-1">
    <v-navigation-drawer app v-model="navigation" color="#101827">
      <!-- Add your navigation drawer content here -->
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-card
        flat
        rounded="lg"
        class="d-flex flex-grow-1 align-center pl-2 pr-4 py-3 mt-10"
      >
        <v-app-bar-nav-icon @click.stop="navigation = !navigation" />
        <v-spacer />
        <ProfileMenu />
      </v-card>
    </v-app-bar>

    <v-main class="mt-10">
      <v-container class="pa-4" fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer app inset>
      <v-spacer />
      <div class="text-overline">
        <span> Mobile-Kiosk </span>
      </div>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProfileMenu from "@/views/components/toolbar/AppBarMenu.vue";

const navigation = ref(true);
</script>
