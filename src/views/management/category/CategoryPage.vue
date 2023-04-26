<template>
  <div>
    <PageTitle title="카테고리 관리" @click="openCreateSheet" />
    <v-card-text class="pt-0">
      <v-data-table
        disable-sort
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="items"
        :loading="loading"
        class="sortable"
      >
        <template #[`header.id`]>
          <v-icon class="drag-handle"> mdi-menu-swap</v-icon>
        </template>
        <template #[`item.id`]>
          <v-icon class="drag-handle"> mdi-drag-vertical</v-icon>
        </template>
        <template #[`item.name`]="{ item }">
          <a
            class="d-inline-block text-truncate"
            style="width: 10rem"
            @click="openUpdateSheet(item)"
            v-text="item.name"
          />
        </template>
        <template #[`item.description`]="{ item }">
          <span class="d-inline-block text-truncate" style="width: 20rem">
            {{ item.description || "-" }}
          </span>
        </template>
        <template #[`item.availableFlag`]="{ item }">
          <div class="d-flex justify-center pl-4">
            <v-switch
              :input-value="item.availableFlag"
              inset
              dense
              readonly
              @click="changeAvailableFlag(item.id, !item.availableFlag)"
            />
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon color="red" @click="deleteCategory(item)"
            >mdi-delete-forever</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>

    <CategoryEditSheet
      v-if="sheet"
      v-model="editItem"
      :sheet.sync="sheet"
      @created="created"
      @updated="updated"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { defaultCategory } from "@/definitions/defaults";
import { Category } from "@/definitions/entities";
import { useEditItem } from "@/compositions/useEditItem";
import { deleteApi, getApi, patchApi } from "@/utils/apis";
import { useCurrentElement, watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { useConfirmStore } from "@/stores/confirm";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useSimpleTable } from "@/compositions/useSimpleTable";
import CategoryEditSheet from "@/views/management/category/CategoryEditSheet.vue";
import { onBeforeMount, onMounted } from "vue";
import Sortable, { SortableEvent } from "sortablejs";

const { selectedStore } = storeToRefs(useStoreStore());
const { confirmDelete } = useConfirmStore();

const { totalItems, items, loading, changeAvailableFlag, created, updated } =
  useSimpleTable<Category>("categories");
const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<Category>(defaultCategory);

const headers: DataTableHeader[] = [
  {
    text: "ID",
    align: "start",
    value: "id",
    width: "1rem",
    sortable: true,
  },
  {
    text: "카테고리명",
    align: "start",
    value: "name",
    width: "15rem",
    sortable: true,
  },
  {
    text: "카테고리 설명",
    align: "start",
    value: "description",
    sortable: true,
  },
  {
    text: "활성 / 비활성",
    align: "center",
    value: "availableFlag",
    width: "10rem",
    sortable: true,
  },
  {
    text: "삭제",
    align: "center",
    value: "actions",
    width: "4rem",
    sortable: false,
  },
];

async function fetchList(): Promise<void> {
  items.value = [];
  totalItems.value = 0;

  loading.value = true;
  const response = await getApi<Category[]>(
    `categories?storeId=${selectedStore.value.id}`
  );
  loading.value = false;

  if (response.success) {
    items.value = response.result ?? [];
    totalItems.value = response.result.length ?? 0;
  }
}

async function deleteCategory(category: Category): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`categories/${category.id}`);
    if (response.success) {
      items.value = items.value.filter((item) => item.id !== category.id);
    }
  });
}

async function saveSort(): Promise<void> {
  const response = await patchApi<Category[]>(
    `categories/display-order?storeId=${selectedStore.value.id}`,
    items.value.map(({ id }, index) => ({
      id: id as number,
      displayOrder: index,
    }))
  );
  if (response.success) {
    items.value = response.result;
  }
}

watchDebounced(
  () => selectedStore.value,
  async () => await fetchList(),
  {
    debounce: 300,
  }
);

onBeforeMount(async () => {
  await fetchList();
});

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
    onEnd(evt: SortableEvent) {
      if (
        evt.newIndex != evt.oldIndex &&
        evt.newIndex !== undefined &&
        evt.oldIndex !== undefined
      ) {
        const newItems = [...items.value];
        const draggedItem = newItems.splice(evt.oldIndex, 1)[0];
        newItems.splice(evt.newIndex, 0, draggedItem);
        items.value = newItems;
        saveSort();
      }

      const rows = selector.querySelectorAll("tr");
      rows.forEach((row) => row.classList.remove("not-dragged-row"));
    },
  });
});
</script>
