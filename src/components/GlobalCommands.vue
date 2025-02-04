<template>
  <div class="global-control">
    <button class="control-button blue" @click="resetPositions">Reset Position</button>
    <button class="control-button blue">Help Page</button>
    <button class="control-button red">Reset Memory</button>
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
  padding: 15px;
  background: #f7faff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.control-button {
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}

.blue {
  background: #007bff;
  color: white;
}

.blue:hover {
  background: #0056b3;
}

.red {
  background: #dc3545;
  color: white;
}

.red:hover {
  background: #a71d2a;
}
</style>
