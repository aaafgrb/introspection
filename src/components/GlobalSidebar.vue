<template>
  <div :class="['sidebar', { 'is-retracted': isRetracted }]">
    <div class="sidebar-handle" @click="toggleSidebar">
      <span v-if="!isRetracted">☰</span>
      <span v-else>≡</span>
    </div>
    <div class="sidebar-header">
      <span v-if="!isRetracted">Sidebar Header</span>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-list">
        <!-- global commands -->
        <li v-for="(item, index) in items" :class="['sidebar-item', { 'is-collapsed': item.collapsed }]"
          ref="item-refs">
          <div class="sidebar-item-header" @click="toggleItem(index)">
            <span v-if="!isRetracted">{{ item.header }}</span>
          </div>
          <div class="sidebar-item-content">
            <component :is="item.component"></component>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, useTemplateRef } from 'vue';
import GlobalCommands from './GlobalCommands.vue';
import CustomFunctionPageList from './CustomFunctionPageList.vue';

const isRetracted = ref(false)
const items = shallowRef([
  { header: 'Control', component: GlobalCommands, collapsed: false },
  { header: 'Custom Function Pages', component: CustomFunctionPageList, collapsed: false },
  { header: 'Item 3', component: GlobalCommands, collapsed: false },
  { header: 'Item 4', component: GlobalCommands, collapsed: false },
  { header: 'Item 5', component: GlobalCommands, collapsed: false },
  { header: 'Item 6', component: GlobalCommands, collapsed: false },
  { header: 'Item 7', component: GlobalCommands, collapsed: false },
  { header: 'Item 8', component: GlobalCommands, collapsed: false },
  { header: 'Item 9', component: GlobalCommands, collapsed: false },
  { header: 'Item 10', component: GlobalCommands, collapsed: false },
  { header: 'Item 11', component: GlobalCommands, collapsed: false },
])

const toggleSidebar = () => {
  isRetracted.value = !isRetracted.value;
}

const itemRefs = useTemplateRef("item-refs")
const toggleItem = (index) => {
  if (isRetracted.value) {
    isRetracted.value = false
    items.value[index].collapsed = false
    setTimeout(_ => {
      itemRefs.value[index].scrollIntoView({ behavior: "smooth", block: "start" })
    }, 200)
  } else {
    items.value[index].collapsed = !items.value[index].collapsed;
  }
}

</script>

<style scoped>
.sidebar {
  width: 250px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--primary-background-color);
  color: var(--primary-text-color);
  transition: width 0.3s ease;
  z-index: 10;
  border-left: 2px solid var(--primary-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.is-retracted {
  width: 50px;
}

.sidebar-handle {
  width: 50px;
  height: 30px;
  background-color: var(--primary-color);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 20px;
  user-select: none;
  color: var(--primary-text-color);
  z-index: 2;
}

.sidebar-header {
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  padding-right: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid var(--primary-color);
  position: absolute;
  right: 0;
  left: 0;
  z-index: 1;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: top 0.3s ease;
  user-select: none;
}

.sidebar-content {
  flex-grow: 1;
  overflow: scroll;
  margin-top: 50px;
  transition: all 0.3s ease;
}

.sidebar-list {
  list-style: none;
  padding: 5px;
  margin: 5px;
}

.sidebar-item {
  margin-bottom: 10px;
  background-color: var(--secondary-background-color);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.is-retracted .sidebar-item {
  border-radius: 5px;
  background-color: var(--primary-color);
  height: 15px;
}

.is-retracted .sidebar-item:hover {
  scale: 1.1
}

.sidebar-item-header {
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  transition: background-color 0.3s;
}

.sidebar-item-header:hover {
  background-color: var(--primary-button-hover-color);
}

.is-retracted .sidebar-item-header {
  border-radius: 5px !important;
  background-color: var(--primary-color);
}

.is-collapsed .sidebar-item-header {
  border-radius: 8px;
}


.sidebar-item-content {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 10px;
  background-color: var(--secondary-background-color);
  transition: all 0.3s ease;
}

.is-retracted .sidebar-item-content {
  height: 0px;
  padding: 0px;
  overflow: hidden;
}

.is-collapsed .sidebar-item-content {
  height: 0px;
  padding: 0px;
  overflow: hidden;
}
</style>
