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

<script>
import { useTemplateRef } from 'vue';
import GlobalCommands from './GlobalCommands.vue';



export default {
  components: { GlobalCommands },
  data() {
    return {
      isRetracted: false,
      items: [
        { header: 'Item 1', component: "GlobalCommands", collapsed: false },
        { header: 'Item 2', component: "GlobalCommands", collapsed: false },
        { header: 'Item 3', component: "GlobalCommands", collapsed: false },
        { header: 'Item 4', component: "GlobalCommands", collapsed: false },
        { header: 'Item 5', component: "GlobalCommands", collapsed: false },
        { header: 'Item 6', component: "GlobalCommands", collapsed: false },
        { header: 'Item 7', component: "GlobalCommands", collapsed: false },
        { header: 'Item 8', component: "GlobalCommands", collapsed: false },
        { header: 'Item 9', component: "GlobalCommands", collapsed: false },
        { header: 'Item 10', component: "GlobalCommands", collapsed: false },
        { header: 'Item 11', component: "GlobalCommands", collapsed: false },
      ],
    };
  },
  setup() {
    const itemRefs = useTemplateRef("item-refs")
    return {
      itemRefs
    }
  },
  methods: {
    toggleSidebar() {
      this.isRetracted = !this.isRetracted;
    },
    toggleItem(index) {
      if (this.isRetracted) {
        this.isRetracted = false
        this.items[index].collapsed = false
        setTimeout(_ => {
          this.itemRefs[index].scrollIntoView({ behavior: "smooth", block: "start" })
          console.log("asd")
        }, 200)
      } else {
        this.items[index].collapsed = !this.items[index].collapsed;
      }
    },
  },
};
</script>
<style scoped>
.sidebar {
  width: 250px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f7faff;
  color: #333;
  transition: width 0.3s ease;
  z-index: 10;
  border-left: 2px solid #007bff;
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
  background-color: #007bff;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 20px;
  user-select: none;
  color: white;
  z-index: 2;
}

.sidebar-header {
  background-color: #e0f4ff;
  color: #333;
  padding-right: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #007bff;
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
  background-color: #e0f4ff;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.is-retracted .sidebar-item {
  border-radius: 5px;
  background-color: #007bff;
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
  background-color: #007bff;
  color: white;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  transition: background-color 0.3s;
}

.sidebar-item-header:hover {
  background-color: #1284ff;
}

.is-retracted .sidebar-item-header {
  border-radius: 5px !important;
  background-color: #007bff;
}

.is-collapsed .sidebar-item-header {
  border-radius: 8px;
}


.sidebar-item-content {
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 10px;
  background-color: #e0e8ff;
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
