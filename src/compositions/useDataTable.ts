import { Id } from "@/definitions/entities";
import { Pagination } from "@/definitions/types";
import { reactive, toRefs } from "vue";
import { useSimpleTable } from "@/compositions/useSimpleTable";

export function useDataTable<T extends Id>(
  url: string,
  pagination: Pagination = {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["id"],
    sortDesc: [true],
  }
) {
  const state = reactive({
    pagination: pagination,
  });

  const { items, totalItems, loading, changeAvailableFlag, created, updated } =
    useSimpleTable<T>(url);

  return {
    items,
    totalItems,
    loading,
    changeAvailableFlag,
    created,
    updated,
    ...toRefs(state),
  };
}
