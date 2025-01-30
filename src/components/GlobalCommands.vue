<template>
  <div class="command-list">
    <h3 class="command-list-title">Global Commands</h3>
    <ul class="command-list-items">
      <li v-for="command in commands" :key="command.id" class="command-item">
        <button @click="command.action" class="command-button">{{ command.label }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commands: [
        { id: 'reset', label: 'Reset Position', action: this.resetPosition },
        { id: 'settings', label: 'Open Settings', action: this.openSettings },
      ],
    };
  },
  methods: {
    resetPosition() {
      this.$emit('reset-position');
    },
    openSettings() {
      this.$emit('open-settings');
    },
  },
};
</script>

<style scoped>
.command-list {
  padding: 10px;
  background-color: #f0f4ff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.command-list-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.command-list-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.command-item {
  margin-bottom: 5px;
}

.command-button {
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

.command-button:hover {
  background-color: #0056b3;
}
</style>