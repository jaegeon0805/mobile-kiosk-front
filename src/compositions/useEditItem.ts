import { reactive, toRefs, UnwrapRef } from "vue";
import { cloneDeep } from "lodash";

export function useEditItem<T>(initFunction: CallableFunction) {
  const state = reactive({
    editItem: initFunction() as T,
    sheet: false,
  });
  const methods = {
    openCreateSheet: (): void => {
      state.editItem = initFunction() as UnwrapRef<T>;
      state.sheet = true;
    },
    openUpdateSheet: (item: T): void => {
      state.editItem = cloneDeep(item) as UnwrapRef<T>;
      state.sheet = true;
    },
  };
  return { ...toRefs(state), ...methods };
}
