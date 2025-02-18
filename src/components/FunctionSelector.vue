<template>
  <div v-if="isOpen" class="content">
    <button class="close-button" @click="close">&times;</button>
    <h2>Select a Function</h2>
    <input v-model="search" type="text" placeholder="Search functions..." class="search-bar" />

    <div class="function-list">
      <h3>Custom Functions</h3>
      <ul>
        <li v-for="fn in filteredCustomFunctions" :key="fn" @click="select(fn)">{{ fn }}</li>
      </ul>
    </div>

    <div class="function-list">
      <h3>Base Functions</h3>
      <ul>
        <li v-for="fn in filteredBaseFunctions" :key="fn" @click="select(fn)">{{ fn }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue';
import { useFunctionRegistryStore } from '@/stores/useFunctionRegistryStore';

const isOpen = ref(false)
const search = ref('');
let selectCallback = null
const functionRegistry = useFunctionRegistryStore();

const filteredBaseFunctions = computed(() =>
  [...functionRegistry.baseFunctions]
    .filter(([fn, _]) => fn.toLowerCase().includes(search.value.toLowerCase()))
    .map(([k, _]) => k)
);

const filteredCustomFunctions = computed(() =>
  [...functionRegistry.customFunctions]
    .filter(([fn, _]) => fn.toLowerCase().includes(search.value.toLowerCase()))
    .map(([k, _]) => k)
);

const toggleSelector = (callback) => {
  selectCallback = callback
  isOpen.value = !isOpen.value
  search.value = ''
}

function close() {
  isOpen.value = false
}

function select(fn) {
  selectCallback(fn)
  close();
}

defineExpose({ toggleSelector })

</script>

<style scoped>
.content {
  padding: 4px;
  border-radius: 4px;
  border: 2px solid var(--primary-color);
  z-index: 9999;
  background-color: var(--primary-background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.close-button {
  float: right;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.search-bar {
  width: 90%;
  padding: 5px;
  margin-bottom: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  transition: border 0.3s ease;
}

.search-bar:focus {
  border-color: var(--primary-color);
  outline: none;
}

.function-list {
  margin-top: 10px;
}

.function-list ul {
  list-style: none;
  padding: 0;
}

.function-list li {
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}

.function-list li:hover {
  background: #f0f0f0;
}
</style>
