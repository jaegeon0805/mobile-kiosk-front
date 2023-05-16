<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="주문 상세" hide-suffix />
        <v-card-text class="overflow-y-auto" style="max-height: 70vh">
          <OrderDetailCard
            v-for="(item, index) in value"
            :key="index"
            :value="item"
          />
        </v-card-text>
        <SheetButton
          :sheet.sync="sheet"
          :saveBtn="false"
          close-btn-title="확인"
        />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import SheetButton from "@/components/sheet/SheetButton.vue";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { OrderItem } from "@/definitions/types";
import OrderDetailCard from "@/views/management/order/OrderDetailCard.vue";

const props = defineProps<{
  value: OrderItem[];
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
}>();

const sheet = useVModel(props, "sheet", emits, {
  eventName: "update:sheet",
});
</script>
