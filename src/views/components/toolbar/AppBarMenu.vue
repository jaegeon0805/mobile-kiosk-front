<template>
  <div>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-chip class="py-0" large color="background" v-on="on">
          <span class="mr-1 text-button">
            <span class="text--black">{{ name }}</span
            >님
          </span>
          <v-avatar size="40px">
            <v-icon> mdi-account-circle </v-icon>
          </v-avatar>
        </v-chip>
        <v-icon>mdi-bell</v-icon>
      </template>

      <v-list dense>
        <v-list-item @click="() => {}">
          <v-list-item-title>프로필</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => {}">
          <v-list-item-title>세팅</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="signOut">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signOut } from "@/utils/utils";

// TODO 수정해야함
const name = ref("이재건");
</script>
