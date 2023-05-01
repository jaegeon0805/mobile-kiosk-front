<template>
  <v-card class="text-center error-page pa-10">
    <v-img :src="require('@/assets/img/404.png')" max-height="400" contain />

    <div class="text-h3 mt-5">페이지를 찾을 수 없습니다.</div>
    <div class="my-3">죄송합니다. 해당 페이지를 찾을 수 없습니다.</div>
    <v-btn block large color="primary" @click="router.back()">
      이전 페이지로 돌아가기
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import router from "@/router";
</script>
