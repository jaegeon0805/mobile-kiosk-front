<template>
  <div class="d-flex flex-grow-1">
    <v-navigation-drawer app v-model="navigation" color="#101827">
      <StoreSelectMenu />
      <v-divider class="menu-color" />
      <NavMenu />
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
      <v-container class="pa-4 fill-height" fluid>
        <v-card class="fill-height pa-2" flat style="width: 100%">
          <slot />
        </v-card>
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
import { onMounted, onUnmounted, ref } from "vue";
import ProfileMenu from "@/components/layout/AppBarMenu.vue";
import StoreSelectMenu from "@/components/layout/StoreSelectMenu.vue";
import NavMenu from "@/components/layout/NavMenu.vue";
import { useSocketStore } from "@/stores/socket";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const { initializeWebSocket, disconnect } = useSocketStore();
const { uuid } = storeToRefs(useMemberStore());

const navigation = ref(true);

onMounted(() => {
  initializeWebSocket(uuid.value);
});

onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
.menu-color {
  background-color: #292f3d;
}
</style>
