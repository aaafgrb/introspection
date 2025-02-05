<template>
  <div :class="['sidebar', { 'is-retracted': isRetracted }]">
    <div class="sidebar-handle" @click="toggleSidebar">
      <span v-if="isRetracted">+</span>
      <span v-else>&gt;</span>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-list" v-if="!isRetracted">
        <li class="sidebar-item">
          <div class="sidebar-item-header">
            <span>ASD</span>
          </div>
          <div class=" sidebar-item-content">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cfData: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    customFunctionName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      isRetracted: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isRetracted = !this.isRetracted;
    },
  },
  setup(props) {
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  position: absolute;
  top: 0;
  left: -215px;
  bottom: 0;
  background: #f0f4f8;
  color: #333;
  transition: all 0.3s ease;
  border: 3px solid #007bff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.is-retracted {
  left: 0px;
  width: 0px;
  border: 0px solid #007bff;
  transition: all 0.3s ease;
}

.sidebar-handle {
  width: 20px;
  height: 42px;
  left: -22px;
  top: -2px;
  background-color: #007bff;
  color: white;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
</style>
