<template>
  <div>
    <v-subheader class="pa-0 font-weight-black subtitle-2 primary--text">
      옵션 그룹
    </v-subheader>

    <v-card
      class="overflow-y-auto overflow-x-hidden"
      width="250"
      height="450"
      tile
    >
      <v-btn
        width="100%"
        color="primary lighten-2"
        class="mr-2"
        @click="openCreateSheet"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item-group v-model="selected" color="primary" mandatory>
          <draggable
            v-model="optionGroupList"
            handle=".drag-handle"
            animation="300"
            @end="sort"
          >
            <v-list-item
              v-for="(item, i) in optionGroupList"
              :key="i"
              class="px-1 item-container"
            >
              <v-list-item-icon class="mr-1">
                <v-icon class="drag-handle"> mdi-drag-vertical</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-icon
                class="item-action-icon"
                :style="selected === i ? 'visibility: visible' : ''"
                @click="openUpdateSheet(item)"
                >mdi-pencil-outline</v-icon
              >
              <v-icon
                class="item-action-icon"
                :style="selected === i ? 'visibility: visible' : ''"
                @click="deleteOptionGroup(item)"
                >mdi-delete-forever</v-icon
              >
            </v-list-item>
          </draggable>
        </v-list-item-group>
      </v-list>
    </v-card>
    <OptionGroupDialog
      v-if="sheet"
      v-model="editItem"
      :sheet.sync="sheet"
      @created="created"
      @updated="updated"
      :menu="menu"
    />
  </div>
</template>

<script setup lang="ts">
import { Menu, OptionGroup } from "@/definitions/entities";
import { computedAsync, useVModel } from "@vueuse/core";
import { ref, watch } from "vue";
import { deleteApi, getApi, patchApi } from "@/utils/apis";
import { useEditItem } from "@/compositions/useEditItem";
import { defaultOptionGroup } from "@/definitions/defaults";
import OptionGroupDialog from "@/views/management/menu/option/OptionGroupDialog.vue";
import { useConfirmStore } from "@/stores/confirm";

const { confirmDelete } = useConfirmStore();

const props = withDefaults(
  defineProps<{
    value: OptionGroup | null;
    menu: Menu;
  }>(),
  { value: null }
);

const emits = defineEmits<{
  (e: "input", v: OptionGroup | null): void;
}>();

const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<OptionGroup>(defaultOptionGroup);

const value = useVModel(props, "value", emits, { eventName: "input" });
const selected = ref<number | null>(null);

const optionGroupList = computedAsync(async (): Promise<OptionGroup[]> => {
  const response = await getApi<OptionGroup[]>(
    `option-groups?menuId=${props.menu.id}`
  );

  return response.result ?? [];
}, []);

function created(optionGroup: OptionGroup) {
  optionGroupList.value = [...optionGroupList.value, optionGroup];
}

function updated(optionGroup: OptionGroup) {
  optionGroupList.value = optionGroupList.value.map((old) => {
    if (old.id === optionGroup.id) {
      if (value.value?.id === optionGroup.id) {
        value.value = optionGroup;
      }
      return optionGroup;
    } else {
      return old;
    }
  });
}

async function deleteOptionGroup(optionGroup: OptionGroup): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`option-groups/${optionGroup.id}`);
    if (response.success) {
      optionGroupList.value = optionGroupList.value.filter(
        (old) => old.id !== optionGroup.id
      );
    }
  });
}

async function saveSort(): Promise<void> {
  const response = await patchApi<OptionGroup[]>(
    `option-groups/display-order?menuId=${props.menu.id}`,
    optionGroupList.value.map(({ id }, index) => ({
      id: id as number,
      displayOrder: index,
    }))
  );
  if (response.success) {
    optionGroupList.value = response.result;
  }
}

async function sort(evt) {
  if (
    evt.newIndex != evt.oldIndex &&
    evt.newIndex !== undefined &&
    evt.oldIndex !== undefined
  ) {
    if (selected.value === evt.oldIndex) {
      selected.value = evt.newIndex;
    } else if (selected.value && evt.newIndex <= selected.value) {
      selected.value++;
    } else if (selected.value && evt.newIndex > selected.value) {
      selected.value--;
    }
    await saveSort();
  }
}

watch(selected, () => {
  if (selected.value || selected.value === 0) {
    value.value = optionGroupList.value[selected.value];
  }
});
</script>

<style scoped>
.item-container:hover .item-action-icon {
  visibility: visible;
}

.item-action-icon {
  visibility: hidden;
  color: rgba(0, 0, 0, 0.2);
}
</style>
