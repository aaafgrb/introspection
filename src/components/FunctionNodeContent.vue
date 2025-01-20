<template>
  <div class="node-content">
    <div class="ports-container">
      <!-- Input Ports -->
      <div class="ports inputs" :style="{ '--port-flex': calculateFlex(inputs.length) }">
        <FunctionNodePort :emitter="emitter" :nodeData="nodeData" v-for="(input, index) in inputs" :is-input="true"
          :index="index" :key="index" />
      </div>
      <!-- Output Ports -->
      <div class="ports outputs" :style="{ '--port-flex': calculateFlex(outputs.length) }">
        <FunctionNodePort :emitter="emitter" :nodeData="nodeData" v-for="(output, index) in outputs" :is-input="false"
          :index="index" :key="index" />
      </div>
    </div>
    <div class="node-controls">
      <!-- Controls section -->
      <slot name="controls">Default Controls</slot>
    </div>
  </div>
</template>

<script>
import FunctionNodePort from './FunctionNodePort.vue';

export default {
  components: {
    FunctionNodePort
  },
  props: {
    emitter: {
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    inputs: {
      type: Array,
      default: () => [],
    },
    outputs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // Calculate flex factor for ports
    const calculateFlex = (count) => {
      const maxPorts = Math.max(props.inputs.length, props.outputs.length) || 1;
      return count / maxPorts;
    };
    return {
      calculateFlex,
    };
  },
};
</script>

<style scoped>
.node-content {
  display: flex;
  flex-direction: column;
  padding: 2px;
  background-color: white;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  gap: 0px;
  position: relative;
}

.ports-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 80px;
  gap: 0px;
}

.ports {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: var(--port-flex, 1);
  position: relative;
  padding: 0;
}

.node-controls {
  background-color: #007bff;
  border-top: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  font-size: 12px;
  color: white;
  box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}
</style>
