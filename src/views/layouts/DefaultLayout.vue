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
        class="d-flex flex-grow-1 align-center pl-2 pr-6 py-3 mt-10"
      >
        <v-app-bar-nav-icon @click.stop="navigation = !navigation" />
        <v-spacer />
        <ProfileMenu />
        <NotificationIcon v-model="openNotification" />
      </v-card>
    </v-app-bar>

    <NotificationDrawer v-model="openNotification" />

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
import { useNotificationStore } from "@/stores/notification";
import NotificationDrawer from "@/components/notifcation/NotificationDrawer.vue";
import NotificationIcon from "@/components/notifcation/NotificationIcon.vue";

const { initializeWebSocket, disconnect } = useSocketStore();
const { fetchNotifications, notificationClear } = useNotificationStore();
const { uuid } = storeToRefs(useMemberStore());

const navigation = ref(true);
const openNotification = ref(false);

onMounted(async () => {
  initializeWebSocket(uuid.value);
  await fetchNotifications();
});

onUnmounted(() => {
  disconnect();
  notificationClear();
});
</script>

<style scoped>
.menu-color {
  background-color: #292f3d;
}
</style>
