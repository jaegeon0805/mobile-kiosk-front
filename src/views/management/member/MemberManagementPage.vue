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
          <v-icon v-if="item.stores.length > 0" @click="openSheet(item.stores)">
            mdi-format-list-checkbox
          </v-icon>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="d-flex">
            <v-btn
              x-small
              outlined
              :color="item.suspendFlag ? 'success' : 'error'"
              width="50px"
              @click="confirmChangeSuspend(item)"
            >
              {{ item.suspendFlag ? "활성화" : "정지" }}
            </v-btn>
            <v-btn
              x-small
              outlined
              color="error"
              class="ml-2"
              @click="resetPassword(item)"
            >
              비밀번호 초기화
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <StoreListSheet
      v-if="optionSheet"
      :sheet.sync="optionSheet"
      :value="viewItems"
    />
  </div>
</template>

<script setup lang="ts">
import { DataTableHeader } from "vuetify";
import { MemberForAdmin, Store } from "@/definitions/entities";
import { useDataTable } from "@/compositions/useDataTable";
import { getApi, patchApi } from "@/utils/apis";
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

const { confirm } = useConfirmStore();

const optionSheet = ref(false);
const viewItems = ref<Store[]>([]);
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

function openSheet(items: Store[]) {
  viewItems.value = items;
  optionSheet.value = true;
}

async function confirmChangeSuspend(item: MemberForAdmin) {
  const message = !item.suspendFlag
    ? "회원을 정지 시키겠습니까?\n해당 회원의 모든 기능이 비활성화 됩니다."
    : "회원의 정지를 푸시겠습니까?";
  confirm(message, async () => {
    await changeSuspendFlag(item.id, !item.suspendFlag);
  });
}

async function resetPassword(member: MemberForAdmin) {
  confirm(
    "비밀번호를 초기화하겠습니까?\n(000000으로 초기화됩니다.)",
    async () => {
      const response = await patchApi<MemberForAdmin>(
        `members/${member.id}/reset-password`,
        null
      );

      if (response.success) {
        items.value = items.value.map((item) => {
          if (item.id === member.id) {
            return response.result;
          } else {
            return item;
          }
        });
      }
    }
  );
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
