<template>
  <v-list nav dense>
    <v-subheader
      class="text-subtitle-2"
      style="color: rgba(255, 255, 255, 0.7)"
    >
      MANAGEMENT
    </v-subheader>
    <v-list-item
      v-for="item in userMenus"
      :key="item.url"
      dark
      link
      :to="item.url"
      class="mx-2"
      active-class="primary--text"
    >
      <v-list-item-icon>
        <v-icon> {{ item.icon }} </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <template v-if="isAdmin">
      <v-subheader
        class="text-subtitle-2 mt-10"
        style="color: rgba(255, 255, 255, 0.7)"
      >
        ADMIN
      </v-subheader>
      <v-list-item
        v-for="item in adminMenus"
        :key="item.url"
        dark
        link
        :to="item.url"
        class="mx-2"
        active-class="primary--text"
      >
        <v-list-item-icon>
          <v-icon> {{ item.icon }} </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";

const { isAdmin } = storeToRefs(useMemberStore());

const userMenus = [
  {
    icon: "mdi-home-edit-outline",
    title: "점포 관리",
    url: "/management/store",
  },
  {
    icon: "mdi-view-dashboard-edit-outline",
    title: "카테고리 관리",
    url: "/management/category",
  },
  {
    icon: "mdi-cookie-edit-outline",
    title: "메뉴 관리",
    url: "/management/menu",
  },
  {
    icon: "mdi-book-settings-outline",
    title: "주문 관리",
    url: "/management/order",
  },
];

const adminMenus = [
  {
    icon: "mdi-account-edit-outline",
    title: "회원 관리",
    url: "/management/member",
  },
];
</script>
