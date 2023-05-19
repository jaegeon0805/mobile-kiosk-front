<template>
  <div>
    <PageTitle title="점포 관리" @click="openCreateSheet">
      <v-btn outlined class="mx-2 px-2 font-weight-black" @click="fetchList">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </PageTitle>
    <v-card-text class="pt-0">
      <StoreFilter v-model="filter" />
      <v-data-table
        must-sort
        :headers="headers"
        :items="items"
        :options.sync="pagination"
        :loading="loading"
      >
        <template #[`item.name`]="{ item }">
          <a
            class="text-ellipsis"
            @click="openUpdateSheet(item)"
            v-text="item.name"
          />
        </template>
        <template #[`item.description`]="{ item }">
          <span class="text-ellipsis">
            {{ item.description || "-" }}
          </span>
        </template>
        <template #[`item.availableFlag`]="{ item }">
          <div class="d-flex justify-center">
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

    <StoreEditSheet
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
import { defaultStore, defaultStoreFilter } from "@/definitions/defaults";
import { Store } from "@/definitions/entities";
import { useEditItem } from "@/compositions/useEditItem";
import { useDataTable } from "@/compositions/useDataTable";
import { deleteApi, getApi } from "@/utils/apis";
import { computed, ref } from "vue";
import { useMemberStore } from "@/stores/member";
import { stringify } from "qs";
import { PageResponse } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import StoreEditSheet from "@/views/management/store/StoreEditSheet.vue";
import { useConfirmStore } from "@/stores/confirm";
import { useStoreStore } from "@/stores/store";
import { StoreFilters } from "@/definitions/filters";
import StoreFilter from "@/views/management/store/StoreFilter.vue";

const { member } = useMemberStore();
const { fetchStoreList } = useStoreStore();
const { confirmDelete } = useConfirmStore();

const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<Store>(defaultStore);
const {
  pagination,
  totalItems,
  items,
  loading,
  changeAvailableFlag,
  created,
  updated,
} = useDataTable<Store>("stores");

const filter = ref<StoreFilters>(defaultStoreFilter());

const headers: DataTableHeader[] = [
  {
    text: "ID",
    align: "start",
    value: "id",
    width: "4rem",
    sortable: true,
  },
  {
    text: "점포명",
    align: "start",
    value: "name",
    width: "15rem",
    sortable: true,
  },
  {
    text: "점포 설명",
    align: "start",
    value: "description",
    sortable: true,
  },
  {
    text: "OPEN / CLOSE",
    align: "center",
    value: "availableFlag",
    width: "8rem",
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
  const response = await getApi<PageResponse<Store>>(
    `stores?memberId=${member.id}&${queryString.value}`
  );
  loading.value = false;

  items.value = response.result?.content ?? [];
  totalItems.value = response.result?.totalElements ?? 0;
}

async function deleteStore(store: Store): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`stores/${store.id}`);
    if (response.success) {
      await fetchStoreList();
      items.value = items.value.filter((item) => item.id !== store.id);
    }
  });
}

const queryString = computed(() =>
  stringify(
    { ...pagination.value, ...filter.value },
    { arrayFormat: "comma", skipNulls: true }
  )
);

watchDebounced(
  () => queryString.value,
  async () => await fetchList(),
  {
    debounce: 300,
  }
);
</script>
