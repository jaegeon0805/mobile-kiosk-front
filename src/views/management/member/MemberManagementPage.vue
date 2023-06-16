<template>
  <div>
    <PageTitle title="회원 관리" button-icon="mdi-refresh" @click="fetchList" />
    <v-card-text class="pt-0">
      <MemberFilter v-model="filter" />
      <v-data-table
        must-sort
        :headers="headers"
        :items="items"
        :options.sync="pagination"
        :loading="loading"
      >
        <template #[`item.createdAt`]="{ item }">
          <span>{{ formatDateTime(item.createdAt) }}</span>
        </template>
        <template #[`item.providerType`]="{ item }">
          <span>
            {{ getTypeName(ProviderTypes, item.providerType) }}
          </span>
        </template>
        <template #[`item.suspendFlag`]="{ item }">
          <span
            :class="item.suspendFlag ? 'error--text' : 'success--text'"
            class="font-weight-medium"
          >
            {{ item.suspendFlag ? "정지" : "활성" }}
          </span>
        </template>
        <template #[`item.name`]="{ item }">
          <span class="text-ellipsis">{{ item.name }}</span>
        </template>
        <template #[`item.email`]="{ item }">
          <span class="text-ellipsis">{{ item.email }}</span>
        </template>
        <template #[`item.stores`]="{ item }">
          <v-icon v-if="item.stores.length > 0" @click="openSheet(item)">
            mdi-format-list-checkbox
          </v-icon>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex">
            <v-btn
              x-small
              outlined
              :color="item.suspendFlag ? 'success' : 'error'"
              @click="confirmChangeSuspend(item)"
            >
              {{ item.suspendFlag ? "활성화하기" : "정지시키기" }}
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <StoreListSheet
      v-if="optionSheet"
      :sheet.sync="optionSheet"
      :value="viewItem"
      @change-suspend-flag="fetchList"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { MemberForAdmin } from "@/definitions/entities";
import { useDataTable } from "@/compositions/useDataTable";
import { getApi } from "@/utils/apis";
import { computed, ref } from "vue";
import { stringify } from "qs";
import { PageResponse } from "@/definitions/types";
import { watchDebounced } from "@vueuse/core";
import PageTitle from "@/components/page/PageTitle.vue";
import { formatDateTime } from "@/utils/formatter";
import { useConfirmStore } from "@/stores/confirm";
import StoreListSheet from "@/views/management/member/StoreListSheet.vue";
import MemberFilter from "@/views/management/member/MemberFilter.vue";
import { MemberFilters } from "@/definitions/filters";
import { defaultMemberFilter } from "@/definitions/defaults";
import { getTypeName } from "@/utils/commands";
import { ProviderTypes } from "@/definitions/enums";

const { confirm } = useConfirmStore();

const optionSheet = ref(false);
const viewItem = ref<MemberForAdmin>();
const filter = ref<MemberFilters>(defaultMemberFilter());

const { pagination, totalItems, items, loading, changeSuspendFlag } =
  useDataTable<MemberForAdmin>("members", {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["createdAt"],
    sortDesc: [true],
  });

const headers: DataTableHeader[] = [
  {
    text: "회원 가입일",
    align: "start",
    value: "createdAt",
    width: "11rem",
  },
  {
    text: "회원 타입",
    align: "start",
    value: "providerType",
    width: "6rem",
  },
  {
    text: "닉네임",
    align: "start",
    value: "name",
    width: "10rem",
  },
  {
    text: "이메일",
    align: "start",
    value: "email",
  },
  {
    text: "매장 목록",
    align: "center",
    value: "stores",
    width: "8rem",
    sortable: false,
  },
  {
    text: "정지 여부",
    align: "start",
    value: "suspendFlag",
    width: "6rem",
  },
  {
    text: "",
    align: "center",
    value: "action",
    width: "10rem",
    sortable: false,
  },
];

function openSheet(item: MemberForAdmin) {
  viewItem.value = item;
  optionSheet.value = true;
}

async function confirmChangeSuspend(item: MemberForAdmin) {
  const message = !item.suspendFlag
    ? "회원을 정지시키겠습니까?\n해당 회원의 모든 기능이 비활성화됩니다."
    : "회원의 정지를 푸시겠습니까?";
  confirm(message, async () => {
    await changeSuspendFlag(item.id, !item.suspendFlag);
  });
}

async function fetchList(): Promise<void> {
  items.value = [];
  totalItems.value = 0;

  loading.value = true;
  const response = await getApi<PageResponse<MemberForAdmin>>(
    `members?${queryString.value}`
  );
  loading.value = false;

  if (response.success) {
    items.value = response.result?.content ?? [];
    totalItems.value = response.result?.totalElements ?? 0;
  }
}

const queryString = computed(() =>
  stringify(
    { ...pagination.value, ...filter.value },
    { arrayFormat: "comma", skipNulls: true }
  )
);

watchDebounced(
  () => [queryString.value],
  async () => await fetchList(),
  {
    debounce: 300,
  }
);
</script>
