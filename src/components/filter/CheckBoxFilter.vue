<template>
  <div>
    <v-row no-gutters class="d-flex align-center">
      <v-col cols="1" class="font-weight-black ma-2">
        {{ name }}
      </v-col>
      <v-item-group v-model="value" multiple>
        <v-item
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          v-slot="{ active, toggle }"
          class="px-2 py-1"
        >
          <TagChip
            :class="{ 'text--disabled': !active, 'font-weight-bold': active }"
            :value="item.text"
            :color="active ? undefined : 'grey lighten-3'"
            @click="toggle"
          />
        </v-item>
      </v-item-group>
    </v-row>
    <v-divider />
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import TagChip from "@/components/button/TagChip.vue";
import { TypeItem } from "@/definitions/enums";

const props = defineProps<{
  value: string | string[];
  items: TypeItem[];
  name: string;
}>();

const emits = defineEmits<{
  (e: "input", value: string | string[]);
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });
</script>
