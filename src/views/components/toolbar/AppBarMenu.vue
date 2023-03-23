<template>
  <div>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn depressed rounded large color="background" v-on="on">
          <span>
            <span class="text--black">{{ name }}</span
            >님
          </span>
          <v-avatar size="36px">
            <v-icon> mdi-account-circle </v-icon>
          </v-avatar>
        </v-btn>
        <v-icon>mdi-bell</v-icon>
      </template>

      <v-list>
        <v-list-item @click="() => {}">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => {}">
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="() => {}">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// TODO 수정해야함
const name = ref("이재건");
</script>
