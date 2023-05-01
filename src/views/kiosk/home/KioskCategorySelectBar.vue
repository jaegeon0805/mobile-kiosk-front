<template>
  <v-card elevation="0" tile height="48px" class="category-card">
    <v-chip-group
      v-model="activeCategoryId"
      mandatory
      center-active
      class="px-2"
    >
      <v-chip
        v-for="(category, index) in value"
        :key="category.id"
        color="white"
        pill
        active-class="font-weight-bold white--text selected-chip"
        @click="scrollToCategory(index)"
      >
        {{ category.name }}
      </v-chip>
    </v-chip-group>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { CategoryForKiosk } from "@/definitions/kiosk";

const props = withDefaults(
  defineProps<{
    value: CategoryForKiosk[];
  }>(),
  {
    value: () => [] as CategoryForKiosk[],
  }
);

const activeCategoryId = ref();
const scrollFlag = ref(false);
const scrollTimeout = ref();

function resetScrollFlag() {
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    scrollFlag.value = false;
  }, 1000);
}

function scrollToCategory(elementId) {
  scrollFlag.value = true;

  const elementById = document.getElementById("category-" + elementId);
  if (elementById) {
    const appBarHeight = 96;
    const elementPosition =
      elementById.getBoundingClientRect().top + window.scrollY;
    const targetScrollPosition = elementPosition - appBarHeight;

    window.scrollTo({ top: targetScrollPosition, behavior: "smooth" });

    resetScrollFlag();
  }
}

function handleScroll() {
  if (scrollFlag.value) return;

  const appBarHeight = 96;

  props.value.forEach((_, index) => {
    const categoryElement = document.getElementById(`category-${index}`);
    const categoryRect = categoryElement?.getBoundingClientRect();

    if (
      categoryRect &&
      categoryRect.top <= appBarHeight &&
      categoryRect.bottom > appBarHeight
    ) {
      activeCategoryId.value = index;
    }
  });
}

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">
.category-card {
  position: sticky;
  top: 48px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.selected-chip {
  background-color: #424242 !important;
}

.theme--light.v-chip:hover::before {
  opacity: 0 !important;
}
</style>
