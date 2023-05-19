<template>
  <v-card flat outlined class="my-2">
    <v-card-title class="text-subtitle-1">
      <span>{{ value.name }}</span>
      <a
        class="font-weight-black ml-2"
        :href="`${envs.FRONT_URL}kiosk/${value.id}`"
        target="_blank"
      >
        (KIOSK 링크)
      </a>
      <v-spacer />
      <TagChip
        :value="value.availableFlag ? '오픈' : '마감'"
        :color="value.availableFlag ? 'primary' : 'error'"
      />
    </v-card-title>
    <v-card-text>
      {{ value.description ? value.description : "-" }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Store } from "@/definitions/entities";
import TagChip from "@/components/button/TagChip.vue";
import envs from "@/constants/envs";

defineProps<{
  value: Store;
}>();
</script>
