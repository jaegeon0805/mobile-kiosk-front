<template>
  <div>
    <PageTitle title="메뉴 관리" @click="openSheet" />
    <v-card-text class="pt-0">
      <CategorySelectTab v-model="category" />
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
        <template #[`item.price`]="{ item }">
          <span>₩{{ Number(item.price).toLocaleString() }}</span>
        </template>
        <template #[`item.description`]="{ item }">
          <span class="d-inline-block text-truncate" style="width: 20rem">
            {{ item.description || "-" }}
          </span>
        </template>
        <template #[`item.option`]="{ item }">
          <v-icon @click="openOptionSheet(item)">mdi-pencil-outline</v-icon>
        </template>
        <template #[`item.soldOutFlag`]="{ item }">
          <div class="d-flex justify-center pl-4">
            <v-switch
              :input-value="item.soldOutFlag"
              inset
              dense
              readonly
              @click="changeSoldOutFlag(item.id, !item.soldOutFlag)"
            />
          </div>
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
          <v-icon color="red" @click="deleteMenu(item)"
            >mdi-delete-forever</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>

    <MenuEditSheet
      v-if="sheet"
      v-model="editItem"
      :sheet.sync="sheet"
      :category="category"
      @created="created"
      @updated="updated"
    />
    <OptionEditSheet
      v-if="optionSheet"
      v-model="editItem"
      :sheet.sync="optionSheet"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { defaultMenu } from "@/definitions/defaults";
import { Category, Menu } from "@/definitions/entities";
import { useEditItem } from "@/compositions/useEditItem";
import { deleteApi, getApi, patchApi } from "@/utils/apis";
import { useCurrentElement, watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { useConfirmStore } from "@/stores/confirm";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useSimpleTable } from "@/compositions/useSimpleTable";
import { onBeforeMount, onMounted, ref, UnwrapRef } from "vue";
import Sortable, { SortableEvent } from "sortablejs";
import MenuEditSheet from "@/views/management/menu/MenuEditSheet.vue";
import CategorySelectTab from "@/views/management/category/CategorySelectTab.vue";
import { useAlertStore } from "@/stores/alert";
import OptionEditSheet from "@/views/management/menu/option/OptionEditSheet.vue";
import { cloneDeep } from "lodash";

const { selectedStore } = storeToRefs(useStoreStore());
const { toastWarning } = useAlertStore();
const { confirmDelete } = useConfirmStore();

const { totalItems, items, loading, changeAvailableFlag, created, updated } =
  useSimpleTable<Menu>("menus");
const { sheet, editItem, openCreateSheet, openUpdateSheet } =
  useEditItem<Menu>(defaultMenu);

const category = ref<Category | null>(null);
const optionSheet = ref(false);
const soldOutFlagLoadingSet = ref(new Set<number>());

const headers: DataTableHeader[] = [
  {
    text: "ID",
    align: "start",
    value: "id",
    width: "1rem",
  },
  {
    text: "메뉴명",
    align: "start",
    value: "name",
    width: "10rem",
  },
  {
    text: "금액",
    align: "start",
    value: "price",
    width: "5rem",
  },
  {
    text: "메뉴 설명",
    align: "start",
    value: "description",
  },
  {
    text: "옵션 수정",
    align: "center",
    value: "option",
    width: "5rem",
  },
  {
    text: "매진",
    align: "center",
    value: "soldOutFlag",
    width: "5rem",
  },
  {
    text: "활성 / 비활성",
    align: "center",
    value: "availableFlag",
    width: "5rem",
  },
  {
    text: "삭제",
    align: "center",
    value: "actions",
    width: "4rem",
  },
];

async function fetchList(): Promise<void> {
  items.value = [];
  totalItems.value = 0;
  if (category.value !== null) {
    loading.value = true;

    const response = await getApi<Menu[]>(
      `menus?categoryId=${category.value.id}`
    );

    loading.value = false;

    if (response.success) {
      items.value = response.result ?? [];
      totalItems.value = response.result.length ?? 0;
    }
  }
}

function openSheet() {
  if (category.value?.id) {
    openCreateSheet();
  } else {
    toastWarning("카테고리를 먼저 선택해주세요.");
  }
}

function openOptionSheet(menu: Menu) {
  editItem.value = cloneDeep(menu) as UnwrapRef<Menu>;
  optionSheet.value = true;
}

async function changeSoldOutFlag(
  id: number | undefined,
  value: boolean
): Promise<void> {
  if (!id || soldOutFlagLoadingSet.value.has(id)) {
    return;
  }

  soldOutFlagLoadingSet.value.add(id);
  const response = await patchApi<Menu>(`menus/${id}/sold-out-flag`, {
    soldOutFlag: value,
  });
  soldOutFlagLoadingSet.value.delete(id);

  if (response.success) {
    items.value = items.value.map((item) => {
      if (item.id === id) {
        return response.result;
      } else {
        return item;
      }
    });
  }
}

async function deleteMenu(menu: Menu): Promise<void> {
  confirmDelete(async () => {
    const response = await deleteApi(`menus/${menu.id}`);
    if (response.success) {
      items.value = items.value.filter((item) => item.id !== menu.id);
    }
  });
}

async function saveSort(): Promise<void> {
  const response = await patchApi<Menu[]>(
    `menus/display-order?categoryId=${category.value?.id}`,
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
  () => [selectedStore.value, category.value],
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
