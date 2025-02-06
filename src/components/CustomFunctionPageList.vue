<template>
  <div class="function-page-list">
    <div v-for="(page, index) in sidebarStore.openPages" :key="page.id" class="function-page-item"
      @click="sidebarStore.focusFunctionPage(index)" @contextmenu="event => contextMenu(event, index)">
      <span class="function-name">{{ page.name }}</span>
    </div>

    <p v-if="sidebarStore.openPages.length === 0" class="empty-text">No open function pages</p>

    <button class="add-btn" @click="addFunctionPage">+ Add Function Page</button>
  </div>
</template>

<script>
import { useGlobalSidebarStore } from "@/stores/useGlobalSidebarStore";
import { inject } from "vue";

export default {
  setup() {
    const sidebarStore = useGlobalSidebarStore();

    function addFunctionPage() {
      sidebarStore.openFunctionPage();
    }

    const openContextMenu = inject("openContextMenu")
    const contextMenu = (event, index) => {
      openContextMenu(event, [
        { label: "Focus on", callback: () => { sidebarStore.focusFunctionPage(index) } },
        { label: "Reset position", callback: () => { sidebarStore.resetFunctionPagePosition(index) } },
        { label: "Delete", callback: () => { sidebarStore.closeFunctionPage(index) } },
      ])
    }

    return { sidebarStore, addFunctionPage, contextMenu };
  },
};
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
