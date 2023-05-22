<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="매장 목록" hide-suffix />
        <v-card-text class="overflow-y-auto" style="max-height: 70vh">
          <StoreDetailCard
            v-for="store in value.stores"
            :key="store.id"
            :value="store"
            :member-suspend-flag="value.suspendFlag"
            @change-suspend-flag="emits('change-suspend-flag')"
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
import { MemberForAdmin } from "@/definitions/entities";
import StoreDetailCard from "@/views/management/member/StoreDetailCard.vue";

const props = defineProps<{
  value: MemberForAdmin;
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
  (e: "change-suspend-flag"): void;
}>();

const sheet = useVModel(props, "sheet", emits, {
  eventName: "update:sheet",
});
</script>
