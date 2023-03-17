<template>
  <div>
    <v-navigation-drawer app v-model="navigation">
      <!-- Add your navigation drawer content here -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="navigation = !navigation" />
    </v-app-bar>

    <v-main>
      <v-container fluid>
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

const navigation = ref(true);
</script>
