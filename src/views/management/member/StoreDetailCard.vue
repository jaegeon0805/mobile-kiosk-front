<template>
  <v-card flat outlined class="my-2" @click="openWindow">
    <v-card-title class="d-flex align-start text-subtitle-1">
      <span class="font-weight-black">{{ value.name }}</span>
      <v-chip :color="chipColor" small class="font-weight-black ml-2">
        {{ chipText }}
      </v-chip>
      <v-spacer />
      <v-btn
        v-if="!memberSuspendFlag"
        x-small
        outlined
        :color="suspendFlag ? 'success' : 'error'"
        class="ml-2"
        @click.prevent.stop="confirmChangeSuspend(value)"
      >
        {{ suspendFlag ? "활성화하기" : "정지시키기" }}
      </v-btn>
    </v-card-title>
    <v-card-text>
      {{ value.description ? value.description : "-" }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Store } from "@/definitions/entities";
import { patchApi } from "@/utils/apis";
import { useConfirmStore } from "@/stores/confirm";
import { computed, onMounted, ref } from "vue";
import envs from "@/constants/envs";

const { confirm } = useConfirmStore();

const props = defineProps<{
  value: Store;
  memberSuspendFlag: boolean;
}>();

const emits = defineEmits<{
  (e: "change-suspend-flag", v: Store): void;
}>();

const suspendFlag = ref(false);

const chipText = computed(() => {
  return suspendFlag.value
    ? "정지"
    : props.value.availableFlag
    ? "오픈"
    : "마감";
});

const chipColor = computed(() => {
  return suspendFlag.value
    ? "error"
    : props.value.availableFlag
    ? "primary"
    : "error";
});

async function confirmChangeSuspend(store: Store) {
  const message = !store.suspendFlag
    ? "매장을 정지 시키겠습니까?"
    : "매장의 정지를 푸시겠습니까?";
  confirm(message, async () => {
    const response = await patchApi<Store>(`stores/${store.id}/suspend-flag`, {
      flag: !suspendFlag.value,
    });

    if (response.success) {
      suspendFlag.value = response.result.suspendFlag;
      emits("change-suspend-flag", response.result);
    }
  });
}

function openWindow() {
  window.open(`${envs.FRONT_URL}kiosk/${props.value.id}`, "_blank");
}

onMounted(() => {
  suspendFlag.value = props.value.suspendFlag;
});
</script>
