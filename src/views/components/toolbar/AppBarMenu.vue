<template>
  <div>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-chip class="py-0" large color="background" v-on="on">
          <span class="d-inline-block text-truncate" style="max-width: 6rem">{{
            member.name
          }}</span>
          님
          <v-avatar size="40px">
            <v-icon> mdi-account-circle </v-icon>
          </v-avatar>
        </v-chip>
        <v-icon>mdi-bell</v-icon>
      </template>

      <v-list dense class="d-flex flex-column align-center">
        <v-list-item @click="profileDialog = true">
          <v-list-item-title>프로필</v-list-item-title>
        </v-list-item>
        <v-list-item @click="passwordDialog = true">
          <v-list-item-title>비밀번호 변경</v-list-item-title>
        </v-list-item>
        <v-list-item @click="signOut">
          <v-list-item-title class="red--text">로그아웃</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <ProfileEditSheet v-if="profileDialog" :sheet.sync="profileDialog" />
    <PasswordEditSheet v-if="passwordDialog" :sheet.sync="passwordDialog" />
  </div>
</template>

<script setup lang="ts">
import { signOut } from "@/utils/utils";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import ProfileEditSheet from "@/views/components/sheet/ProfileEditSheet.vue";
import PasswordEditSheet from "@/views/components/sheet/PasswordEditSheet.vue";

const { member } = storeToRefs(useMemberStore());
const profileDialog = ref(false);
const passwordDialog = ref(false);
</script>
