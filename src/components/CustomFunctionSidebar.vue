<template>
  <div :class="['sidebar', { 'is-retracted': isRetracted }]">
    <div class="sidebar-handle" @click="toggleSidebar">
      <span v-if="isRetracted">+</span>
      <span v-else>&gt;</span>
    </div>
    <div class="sidebar-content" v-if="!isRetracted">
      <div class="config-item">
        <label for="pageTitle">Page Name:</label>
        <input id="pageTitle" type="text" :value="name">
        <button>Save</button>
      </div>

      <div class="config-item function-config">
        <label for="pageTitle">Function Name:</label>
        <input id="pageTitle" type="text" :value="customFunctionName">
        <button>Load</button>
        <button>Save</button>
      </div>
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
  width: 250px;
  position: absolute;
  top: 0;
  left: -265px;
  bottom: 0;
  background: #f0f4f8;
  color: #333;
  transition: all 0.3s ease;
  border: 3px solid #007bff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  overflow-y: scroll;
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


/* General styles for the container */
.config-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
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
  border-color: #0056b3;
  outline: none;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  background-color: #608dff;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 5px;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  background-color: #4177ff;
}
</style>
