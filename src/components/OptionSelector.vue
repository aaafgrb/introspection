<template>
  <FloatingBox :x="x" :y="y" :visible="visible" :teleportTo="teleport">
    <div class="option-selector">
      <button class="close-button" @click="close">&times;</button>
      <h3>{{ title }}</h3>

      <div class="option-list">
        <button v-for="option in options" :key="option" class="option-button" @click="select(option)">
          {{ option }}
        </button>
      </div>
    </div>
  </FloatingBox>
</template>

<script setup>
import { ref } from 'vue'
import FloatingBox from './FloatingBox.vue'

const x = ref(0)
const y = ref(0)
const visible = ref(false)
const title = ref("Choose an Option")
const options = ref([])
const teleport = ref("body")
let callbackFunc = null

const select = (option) => {
  if (callbackFunc) callbackFunc(option)
  visible.value = false
}

const close = () => {
  visible.value = false
}

const openOptionSelector = (callback, details) => {
  x.value = details.x ? details.x : 0
  y.value = details.y ? details.y : 0
  title.value = details.title ? details.title : "Choose an Option"
  options.value = details.options ? details.options : []
  teleport.value = details.teleport ? details.teleport : "body"

  callbackFunc = callback
  visible.value = true
}

defineExpose({ openOptionSelector })
</script>

<style scoped>
.option-selector {
  padding: 8px;
  border-radius: 4px;
  border: 2px solid var(--primary-color);
  background-color: var(--primary-background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-button {
  float: right;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.option-button {
  padding: 6px 12px;
  font-size: 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  background-color: var(--primary-button-color);
  color: var(--primary-text-color);
  cursor: pointer;
  transition: background 0.3s;
}

.option-button:hover {
  background-color: var(--primary-button-hover-color);
  color: white;
}
</style>
