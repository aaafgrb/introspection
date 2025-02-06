<template>
  <div v-if="isVisible" :style="{ top: `${position.y}px`, left: `${position.x}px` }" class="right-click-menu"
    @click.stop>
    <div v-for="(button, index) in buttons" :key="index" class="menu-item" @click="handleButtonClick(button)">
      {{ button.label }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      position: { x: 0, y: 0 },
      buttons: [],
    };
  },
  expose: ["openMenu"],
  methods: {
    openMenu(event, buttons) {
      event.preventDefault();
      this.position = { x: event.clientX, y: event.clientY };
      this.buttons = buttons;
      this.isVisible = true;
    },
    handleButtonClick(button) {
      button.callback();
      this.hideMenu();
    },
    hideMenu() {
      this.isVisible = false;
    },
    handleClickOutside(event) {
      if (this.isVisible && !this.$el.contains(event.target)) {
        this.hideMenu();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.right-click-menu {
  position: absolute;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
  z-index: 9999;
  min-width: 150px;
  padding: 4px 0;
}

.menu-item {
  padding: 10px 14px;
  font-size: 14px;
  color: var(--primary-text-color);
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--primary-button-hover-color);
}
</style>
