<template>
  <div>
    <v-card class="overflow-y-auto" width="250" height="450" tile>
      <v-list dense>
        <v-subheader
          class="d-flex align-center font-weight-black subtitle-2 primary--text"
        >
          <v-btn
            fab
            x-small
            color="primary"
            class="mr-2"
            @click="openCreateSheet"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
          옵션 그룹 {{ optionGroupList[selected]?.name }}
        </v-subheader>
        <v-list-item-group v-model="selected" color="primary">
          <draggable
            v-model="optionGroupList"
            handle=".drag-handle"
            animation="300"
            @end="sort"
          >
            <v-list-item v-for="(item, i) in optionGroupList" :key="i">
              <v-list-item-icon>
                <v-icon class="drag-handle"> mdi-drag-vertical</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-icon @click="openUpdateSheet(item)">mdi-pencil-outline</v-icon>
              <v-icon @click="deleteOptionGroup(item)"
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
.v-application .v-tab--active {
  background-color: rgba(33, 150, 243, 0.2) !important;
}
</style>
