<template>
  <div>
    <span v-if="value"
      >선택된 옵션 그룹: {{ value.name }} / 타입: {{ value.type }} / 최대 선택
      수: {{ value.maxSelections ?? "제한 없음" }}</span
    >

    <v-data-table
      disable-sort
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="items"
      :loading="loading"
      class="sortable"
    >
      <template #top>
        <v-btn @click="openCreateSheet">추가</v-btn>
      </template>
      <template #[`header.id`]>
        <v-icon class="drag-handle"> mdi-menu-swap</v-icon>
      </template>
      <template #[`item.id`]>
        <v-icon class="drag-handle"> mdi-drag-vertical</v-icon>
      </template>
      <template #[`item.name`]="{ item }">
        <a
          class="d-inline-block text-truncate"
          style="width: 15rem"
          @click="openUpdateSheet(item)"
          v-text="item.name"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon color="red" @click="deleteOptionDetail(item)"
          >mdi-delete-forever</v-icon
        >
      </template>
    </v-data-table>

    <OptionDetailDialog
      v-if="sheet"
      v-model="editItem"
      :sheet.sync="sheet"
      :option-group="value"
      @created="created"
      @updated="updated"
    />
  </div>
</template>

<script setup lang="ts">
import { Menu, OptionDetail, OptionGroup } from "@/definitions/entities";
import { useEditItem } from "@/compositions/useEditItem";
import { defaultOptionDetail } from "@/definitions/defaults";
import { deleteApi, getApi, patchApi } from "@/utils/apis";
import { DataTableHeader } from "vuetify";
import { useSimpleTable } from "@/compositions/useSimpleTable";
import { onMounted, watch } from "vue";
import OptionDetailDialog from "@/views/management/menu/option/OptionDetailDialog.vue";
import { useConfirmStore } from "@/stores/confirm";
import { useCurrentElement } from "@vueuse/core";
import Sortable, { SortableEvent } from "sortablejs";

const props = withDefaults(
  defineProps<{
    value: OptionGroup | null;
  }>(),
  { value: null }
);

const emits = defineEmits<{
  (e: "input", v: OptionGroup | null): void;
}>();

const { confirmDelete } = useConfirmStore();

const { items, loading } = useSimpleTable<OptionDetail>("option-details");
const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<OptionDetail>(defaultOptionDetail);

const headers: DataTableHeader[] = [
  {
    text: "ID",
    align: "start",
    value: "id",
    width: "1rem",
  },
  {
    text: "옵션명",
    align: "start",
    value: "name",
    width: "15rem",
  },
  {
    text: "가격",
    align: "start",
    value: "price",
  },
  {
    text: "삭제",
    align: "center",
    value: "actions",
    width: "4rem",
  },
];

async function fetchList() {
  if (props.value?.id) {
    const response = await getApi<OptionDetail[]>(
      `option-details?optionGroupId=${props.value?.id}`
    );

    items.value = response.result ?? [];
  }
}

function created(optionDetail: OptionDetail) {
  items.value = [...items.value, optionDetail];
}

function updated(optionDetail: OptionDetail) {
  items.value = items.value.map((old) => {
    if (old.id === optionDetail.id) {
      return optionDetail;
    } else {
      return old;
    }
  });
}

async function deleteOptionDetail(optionGroup: OptionGroup): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`option-details/${optionGroup.id}`);
    if (response.success) {
      items.value = items.value.filter((item) => item.id !== optionGroup.id);
    }
  });
}

watch(
  () => props.value,
  async () => {
    await fetchList();
  }
);

async function saveSort(): Promise<void> {
  const response = await patchApi<Menu[]>(
    `option-details/display-order?optionGroupId=${props.value?.id}`,
    items.value.map(({ id }, index) => ({
      id: id as number,
      displayOrder: index,
    }))
  );
  if (response.success) {
    items.value = response.result;
  }
}

onMounted(() => {
  const selector = useCurrentElement().value.querySelector(
    ".sortable tbody"
  ) as HTMLElement;

  Sortable.create(selector, {
    handle: ".drag-handle",
    animation: 300,
    onStart(evt: SortableEvent) {
      const rows = selector.querySelectorAll("tr");
      rows.forEach((row) => row.classList.add("not-dragged-row"));
      evt.item.classList.remove("not-dragged-row");
    },
    async onEnd(evt: SortableEvent) {
      if (
        evt.newIndex != evt.oldIndex &&
        evt.newIndex !== undefined &&
        evt.oldIndex !== undefined
      ) {
        const newItems = [...items.value];
        const draggedItem = newItems.splice(evt.oldIndex, 1)[0];
        newItems.splice(evt.newIndex, 0, draggedItem);
        items.value = newItems;
        await saveSort();
      }

      const rows = selector.querySelectorAll("tr");
      rows.forEach((row) => row.classList.remove("not-dragged-row"));
    },
  });
});
</script>
