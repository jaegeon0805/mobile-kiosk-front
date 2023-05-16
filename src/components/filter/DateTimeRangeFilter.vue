<template>
  <div>
    <v-row no-gutters class="d-flex align-center">
      <v-col cols="1" class="font-weight-black ma-2">
        {{ name }}
      </v-col>

      <v-dialog
        ref="refFromDateDialog"
        v-model="fromDateDialog"
        :return-value.sync="fromDate"
        :width="300"
      >
        <template #activator="{ on }">
          <TagChip
            :class="fromDate ? 'font-weight-bold' : 'text--disabled'"
            :color="fromDate ? undefined : 'grey lighten-3'"
            :value="fromDate ?? 'YYYY-MM-DD'"
            icon="mdi-calendar"
            @click="fromDateDialog = true"
          />
          <input v-on="on" class="d-none" />
        </template>
        <v-date-picker
          v-if="fromDateDialog"
          v-model="fromDate"
          scrollable
          reactive
          :max="toDate"
        >
          <v-spacer />
          <v-btn text color="primary" @click="fromDateDialog = false"
            >취소</v-btn
          >
          <v-btn text color="primary" @click="fromDateSave">확인</v-btn>
        </v-date-picker>
      </v-dialog>

      <v-dialog
        ref="refFromTimeDialog"
        v-model="fromTimeDialog"
        :return-value.sync="fromTime"
        width="300px"
      >
        <template #activator="{ on }">
          <TagChip
            :class="fromTimeClass"
            :color="fromTime ? undefined : 'grey lighten-3'"
            :value="fromTime ?? 'HH:mm'"
            icon="mdi-clock-outline"
            @click="fromTimeDialog = true"
          />
          <input v-on="on" class="d-none" />
        </template>
        <v-time-picker
          v-if="fromTimeDialog"
          v-model="fromTime"
          :max="fromTimeMax"
        >
          <v-spacer />
          <v-btn text color="primary" @click="fromTimeDialog = false"
            >취소</v-btn
          >
          <v-btn text color="primary" @click="fromTimeSave">확인</v-btn>
        </v-time-picker>
      </v-dialog>

      <v-icon small class="ml-1 mr-2 text--disabled">mdi-tilde</v-icon>

      <v-dialog
        ref="refToDateDialog"
        v-model="toDateDialog"
        :return-value.sync="toDate"
        :width="300"
      >
        <template #activator="{ on }">
          <TagChip
            :class="toDate ? 'font-weight-bold' : 'text--disabled'"
            :color="toDate ? undefined : 'grey lighten-3'"
            :value="toDate ?? 'YYYY-MM-DD'"
            icon="mdi-calendar"
            @click="toDateDialog = true"
          />
          <input v-on="on" class="d-none" />
        </template>
        <v-date-picker
          v-if="toDateDialog"
          v-model="toDate"
          scrollable
          reactive
          :min="fromDate"
        >
          <v-spacer />
          <v-btn text color="primary" @click="toDateDialog = false">취소</v-btn>
          <v-btn text color="primary" @click="toDateSave">확인</v-btn>
        </v-date-picker>
      </v-dialog>

      <v-dialog
        ref="refToTimeDialog"
        v-model="toTimeDialog"
        :return-value.sync="toTime"
        width="300px"
      >
        <template #activator="{ on }">
          <TagChip
            :class="toTimeClass"
            :color="toTime ? undefined : 'grey lighten-3'"
            :value="toTime ?? 'HH:mm'"
            icon="mdi-clock-outline"
            @click="toTimeDialog = true"
          />
          <input v-on="on" class="d-none" />
        </template>
        <v-time-picker v-if="toTimeDialog" v-model="toTime" :min="toTimeMin">
          <v-spacer />
          <v-btn text color="primary" @click="toTimeDialog = false">취소</v-btn>
          <v-btn text color="primary" @click="toTimeSave">확인</v-btn>
        </v-time-picker>
      </v-dialog>

      <span class="text-caption text--disabled">
        * 시간은 날짜를 선택 후 선택할 수 있습니다.
      </span>
      <v-spacer />
      <v-btn v-show="isSelected" text @click="reset">날짜 초기화</v-btn>
    </v-row>
    <v-progress-linear value="100" color="grey lighten-3" height="2" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useVModels } from "@vueuse/core";
import TagChip from "@/components/button/TagChip.vue";
import dayjs from "dayjs";

const props = defineProps<{
  fromDateTime: Date | string;
  toDateTime: Date | string;
  name: string;
}>();

const emits = defineEmits<{
  (e: "update:fromDateTime", value: Date | null): void;
  (e: "update:toDateTime", value: Date | null): void;
}>();

const { fromDateTime, toDateTime } = useVModels(props, emits);

const fromDate = ref<string | null>(null);
const fromTime = ref<string | null>(null);
const toDate = ref<string | null>(null);
const toTime = ref<string | null>(null);

const fromDateDialog = ref(false);
const fromTimeDialog = ref(false);
const toDateDialog = ref(false);
const toTimeDialog = ref(false);

const fromTimeClass = computed(() => ({
  "font-weight-black": fromTime.value,
  "text--disabled": !fromTime.value,
  "disable-events text--disabled": !fromDate.value,
}));

const toTimeClass = computed(() => ({
  "font-weight-black": toTime.value,
  "text--disabled": !toTime.value,
  "disable-events text--disabled": !toDate.value,
}));

const fromTimeMax = computed((): string =>
  fromDate.value == toDate.value ? toTime.value ?? "" : ""
);

const toTimeMin = computed((): string =>
  fromDate.value == toDate.value ? fromTime.value ?? "" : ""
);

const isSelected = computed((): boolean => {
  return !!fromDateTime.value || !!toDateTime.value;
});

function fromDateSave(): void {
  refFromDateDialog.value?.save(fromDate.value);
  saveFromDateTime();
  fromDateDialog.value = false;
}

function fromTimeSave(): void {
  if (fromDate.value) {
    refFromTimeDialog.value?.save(fromTime.value);
    saveFromDateTime();
  }
  fromDateDialog.value = false;
}

function saveFromDateTime() {
  fromDateTime.value = dayjs(
    `${fromDate.value} ${fromTime.value ?? ""}`
  ).toDate();
}

function toDateSave(): void {
  refToDateDialog.value?.save(toDate.value);
  saveToDateTime();
  toDateDialog.value = false;
}

function toTimeSave(): void {
  if (toDate.value) {
    refToTimeDialog.value?.save(toTime.value);
    saveToDateTime();
  }
  toTimeDialog.value = false;
}

function saveToDateTime() {
  if (toTime.value) {
    toDateTime.value = dayjs(`${toDate.value} ${toTime.value ?? ""}`)
      .endOf("minute")
      .toDate();
  } else {
    toDateTime.value = dayjs(toDate.value).endOf("day").toDate();
  }
}

const refFromDateDialog = ref();
const refFromTimeDialog = ref();
const refToDateDialog = ref();
const refToTimeDialog = ref();

function reset() {
  fromDate.value = null;
  fromTime.value = null;
  toDate.value = null;
  toTime.value = null;
  fromDateTime.value = "";
  toDateTime.value = "";
}

watch(
  () => [fromDateTime.value, toDateTime.value],
  () => {
    if (!fromDateTime.value && !toDateTime.value) {
      reset();
    }
  }
);
</script>
