<template>
  <div>
    <PageTitle title="카테고리 관리" @click="openCreateSheet" />
    <v-card-text>
      <v-data-table
        disable-sort
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="items"
        :loading="loading"
      >
        <template #[`item.name`]="{ item }">
          <a
            class="d-inline-block text-truncate"
            style="width: 15rem"
            @click="openUpdateSheet(item)"
            v-text="item.name"
          />
        </template>
        <template #[`item.description`]="{ item }">
          <span class="d-inline-block text-truncate" style="width: 10rem">
            {{ item.description }}
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
          <v-icon color="red" @click="deleteStore(item)"
            >mdi-delete-forever</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>

    <CategoryEditSheet
      v-if="sheet"
      v-model="editItem"
      :sheet.sync="sheet"
      @created="fetchList"
      @updated="fetchList"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { defaultCategory } from "@/definitions/defaults";
import { Category } from "@/definitions/entities";
import { useEditItem } from "@/compositions/useEditItem";
import { deleteApi, getApi } from "@/utils/apis";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { useConfirmStore } from "@/stores/confirm";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useSimpleTable } from "@/compositions/useSimpleTable";
import CategoryEditSheet from "@/views/management/category/CategoryEditSheet.vue";
import { onMounted } from "vue";

const { selectedStore } = storeToRefs(useStoreStore());
const { confirmDelete } = useConfirmStore();

const { totalItems, items, loading, changeAvailableFlag } =
  useSimpleTable<Category>("categories");
const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<Category>(defaultCategory);

const headers: DataTableHeader[] = [
  {
    text: "ID",
    align: "start",
    value: "id",
    width: "4rem",
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

  items.value = response.result ?? [];
  totalItems.value = response.result.length ?? 0;
}

async function deleteStore(category: Category): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`categories/${category.id}`);
    if (response.success) {
      await fetchList();
    }
  });
}

watchDebounced(
  () => selectedStore.value,
  async () => await fetchList(),
  {
    debounce: 300,
  }
);

onMounted(async () => {
  await fetchList();
});
</script>
