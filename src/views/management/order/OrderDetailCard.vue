<template>
  <v-card flat :outlined="outline" class="my-2">
    <v-card-title class="text-subtitle-1">
      메뉴: {{ value.menu.name }} / 주문 수량: {{ value.quantity }}개
    </v-card-title>
    <v-card-text v-if="value.optionGroups.length > 0">
      <div v-for="(optionGroup, index) in value.optionGroups" :key="index">
        <span class="font-weight-black">
          {{ optionGroup.name }}
          ({{ getTypeName(OptionTypes, optionGroup.type) }}):
        </span>
        <span>
          {{ optionGroup.options.map((option) => option.name).join(", ") }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { OrderItem } from "@/definitions/types";
import { OptionTypes } from "@/definitions/enums";
import { getTypeName } from "@/utils/commands";

defineProps<{
  value: OrderItem;
  outline?: boolean;
}>();
</script>
