<template>
  <div class="global-control">
    <button class="control-button" @click="resetPositions">Reset Position</button>
    <button class="control-button">Help Page</button>
    <button class="control-button danger-button">Reset Memory</button>
  </div>
</template>

<script>
import { useGlobalSidebarStore } from '@/stores/useGlobalSidebarStore';

export default {
  setup() {
    const globalSidebarStore = useGlobalSidebarStore()
    const resetPositions = () => {
      globalSidebarStore.resetAllPagesPosition()
    }
    return {
      resetPositions
    }
  }
};
</script>

<style scoped>
.global-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
  background: var(--secondary-background-color);
  border-radius: 10px;
}

.control-button {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  background: var(--primary-button-color);
  color: var(--primary-text-color);
}

.control-button:hover {
  background: var(--primary-button-hover-color);
}

.danger-button {
  background: var(--danger-button-color);
  color: white;
}

.danger-button:hover {
  background: var(--danger-button-hover-color);
}
</style>
