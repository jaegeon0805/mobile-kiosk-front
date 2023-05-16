<template>
  <v-list nav dense>
    <v-list-item
      v-for="(item, index) in items"
      :key="index"
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
  </v-list>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NavItem } from "@/definitions/types";

const items = computed((): NavItem[] => {
  let items: NavItem[] = [
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

  // TODO 회원관리는 관리자만 표시되도록 추가해야함
  return items;
});
</script>
