<template>
  <div :class="['sidebar', { 'is-retracted': isRetracted }]">
    <div class="sidebar-handle" @click="toggleSidebar">
      <span v-if="isRetracted">+</span>
      <span v-else>&gt;</span>
    </div>
    <div class="sidebar-content" v-if="!isRetracted">
      <div class="config-item">
        <label>Page Name:</label>
        <input type="text" :value="pageData.name">
        <button @click="saveName">Save</button>
      </div>

      <div class="config-item function-config">
        <label>Function Name:</label>
        <input type="text" :value="pageData.functionName">
        <button @click="loadFunction">Load</button>
        <button @click="saveFunction">Save</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
const props = defineProps({
  pageData: {
    type: Object,
    required: true
  }
})

const isRetracted = ref(false)
const toggleSidebar = () => {
  isRetracted.value = !isRetracted.value;
}

const saveFunction = () => {

}
const loadFunction = () => {

}

const saveName = () => {

}


</script>

<style scoped>
.sidebar {
  width: 250px;
  position: absolute;
  top: 0;
  left: -265px;
  bottom: 0;
  background: var(--primary-background-color);
  color: var(--secondary-text-color);
  transition: all 0.3s ease;
  border: 3px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  cursor: default;
}

.sidebar-content {
  overflow-y: scroll;
}

.is-retracted {
  left: 0px;
  width: 0px;
  border: 0px solid var(--primary-color);
  transition: all 0.3s ease;
}

.sidebar-handle {
  width: 20px;
  height: 42px;
  left: -22px;
  top: -2px;
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}


/* General styles for the container */
.config-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  padding: 0.5rem;
  background-color: var(--secondary-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--secondary-text-color);
}

input[type="text"] {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  transition: border 0.3s ease;
}

input[type="text"]:focus {
  border-color: var(--primary-color);
  outline: none;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  background-color: var(--secondary-button-color);
  color: var(--secondary-text-color);
  cursor: pointer;
  border-radius: 5px;
  margin-top: 5px;
  width: 100%;
}

button:hover {
  background-color: var(--secondary-button-hover-color);
}
</style>
