<template>
  <div class="function-page-list">
    <div v-for="[key, page] in pages" :key="key" class="function-page-item"
      @click="customFunctionPagesStore.focusFunctionPage(page.id)" @contextmenu="event => contextMenu(event, page.id)">
      <span class="function-name">{{ page.pageName }}</span>
    </div>

    <p v-if="pages.size == 0" class="empty-text">No open function pages</p>

    <button class="add-btn" @click="addFunctionPage">+ Add Function Page</button>
  </div>
</template>

<script setup>
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";
import { storeToRefs } from "pinia";
import { inject } from "vue";

const customFunctionPagesStore = useCustomFunctionPagesStore()
const { pages } = storeToRefs(customFunctionPagesStore)

const addFunctionPage = () => {
  customFunctionPagesStore.addPage("New Page", "test")
}

const openOptionSelector = inject("openOptionSelector")
const contextMenu = (event, pageId) => {
  event.preventDefault();
  openOptionSelector((option) => {
    switch (option) {
      case "Focus on":
        customFunctionPagesStore.focusFunctionPage(pageId)
        break;
      case "Reset position":
        customFunctionPagesStore.resetFunctionPagePosition(pageId)
        break;
      case "Delete":
        customFunctionPagesStore.closeFunctionPage(pageId)
        break;
    }
  },
    {
      x: event.clientX,
      y: event.clientY,
      options: ["Focus on", "Reset position", "Delete"]
    }
  )
}


</script>

<style scoped>
.function-page-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-btn {
  background: var(--primary-button-color);
  color: var(--primary-text-color);
  border: none;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.add-btn:hover {
  background: var(--primary-button-hover-color);
}

.function-page-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--secondary-button-color);
  color: var(--secondary-text-color);
  padding: 10px 15px;
  border-radius: 8px;
}

.function-page-item:hover {
  background: var(--secondary-button-hover-color);
}

.function-name {
  font-size: 16px;
  font-weight: 500;
  flex-grow: 1;
  cursor: pointer;
  user-select: none;
}

.button-group {
  display: flex;
  gap: 5px;
}

.empty-text {
  text-align: center;
  color: var(--secondary-text-color);
  font-size: 14px;
  margin-top: 10px;
}
</style>
