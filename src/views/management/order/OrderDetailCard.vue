<template>
  <v-card flat outlined class="my-2">
    <v-card-title class="text-subtitle-1">
      메뉴: {{ value.menu.name }} / 주문 수량: {{ value.quantity }}개
    </v-card-title>
    <v-card-text v-if="value.optionGroups.length > 0">
      <div v-for="(optionGroup, index) in value.optionGroups" :key="index">
        <span>
          {{ optionGroup.name }}({{ OPTION_TYPE[optionGroup.type] }}):
        </span>
        <span>
          {{ optionGroup.options.map((option) => option.name).join(",") }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { OrderItem } from "@/definitions/types";
import { OPTION_TYPE } from "@/definitions/enums";

defineProps<{
  value: OrderItem;
}>();
</script>
