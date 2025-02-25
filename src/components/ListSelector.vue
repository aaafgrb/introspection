<template>
  <FloatingBox :x="x" :y="y" :visible="visible" :teleportTo="teleport">
    <div class="list-selector">
      <button class="close-button" @click="close">&times;</button>
      <h2>{{ title }}</h2>
      <input v-model="search" type="text" placeholder="Search..." class="search-bar" />

      <div class="option-list">
        <ul>
          <li v-for="item in filteredItems" :key="item" @click="select(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </FloatingBox>
</template>

<script setup>
import { ref, computed } from 'vue'
import FloatingBox from './FloatingBox.vue'

const x = ref(0)
const y = ref(0)
const visible = ref(false)
const title = ref("Choose an Item")
const items = ref([])
const teleport = ref("body")
let callbackFunc = null

const select = (item) => {
  if (callbackFunc) callbackFunc(item)
  visible.value = false
}

const close = () => {
  visible.value = false
}

const openListSelector = (callback, details) => {
  x.value = details.x ? details.x : 0
  y.value = details.y ? details.y : 0
  title.value = details.title ? details.title : "Choose an Item"
  items.value = details.items ? details.items : []
  teleport.value = details.teleport ? details.teleport : "body"

  callbackFunc = callback
  visible.value = true
}

const search = ref('')
const filteredItems = computed(() =>
  items.value.filter(item => item.toLowerCase().includes(search.value.toLowerCase()))
)

defineExpose({ openListSelector })

</script>

<style scoped>
.list-selector {
  padding: 8px;
  border-radius: 4px;
  border: 2px solid var(--primary-color);
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

.option-list {
  overflow-y: scroll;
  max-height: 400px;
}

.option-list ul {
  list-style: none;
  padding: 0;
}

.option-list li {
  padding: 5px;
  cursor: pointer;
}

.option-list li:hover {
  background: #f0f0f0;
}
</style>
