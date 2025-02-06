<template>
  <div class="function-node" :style="{ transform: `translate(${position.x}px, ${position.y}px)` }" @mousedown.stop="">
    <!-- header -->
    <div class=" node-header" @mousedown.stop="onHeaderMouseDown">
      {{ nodeData.name }}
    </div>
    <!-- content -->
    <div class="node-content">
      <div class="ports-container">
        <!-- Input Ports -->
        <div class="ports inputs" :style="{ '--port-flex': calculateFlex(nodeData.params.length) }">
          <FunctionNodePort :cfData="cfData" :nodeData="nodeData" v-for="(input, index) in nodeData.params"
            :port-id="{ nodeName: nodeData.name, isInput: true, portIndex: index }" :node-data="nodeData"
            ref="input-ports" />
        </div>
        <!-- Output Ports -->
        <div class="ports outputs" :style="{ '--port-flex': calculateFlex(nodeData.output.length) }">
          <FunctionNodePort :cfData="cfData" :nodeData="nodeData" v-for="(output, index) in nodeData.output"
            :port-id="{ nodeName: nodeData.name, isInput: false, portIndex: index }" :node-data="nodeData"
            ref="output-ports" />
        </div>
      </div>
      <div class="node-controls">
        <!-- Controls section -->
        <slot name="controls">Default Controls</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import FunctionNodePort from "./FunctionNodePort.vue";

export default {
  components: {
    FunctionNodePort
  },
  props: {
    cfData: {
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
  },
  mounted() {
    this.position = this.nodeData.position ?? { x: 100, y: 100 }
  },
  setup(props) {
    const position = ref({ x: 0, y: 0 });
    const inputPorts = useTemplateRef("input-ports")
    const outputPorts = useTemplateRef("output-ports")
    // Draggable page header
    const { onMouseDown: onHeaderMouseDown } = useDraggable({
      onDrag: (dx, dy) => {
        position.value.x += dx;
        position.value.y += dy;
        updateConnections();
      },
    });

    const updateConnections = () => {
      inputPorts.value.forEach(e => e.updateConnections())
      outputPorts.value.forEach(e => e.updateConnections())
    }

    // Calculate flex factor for ports
    const calculateFlex = (count) => {
      const maxPorts = Math.max(props.nodeData.params.length, props.nodeData.output.length) || 1;
      return count / maxPorts;
    };

    return {
      position,
      onHeaderMouseDown,
      calculateFlex,
    };
  },
};
</script>

<style scoped>
.function-node {
  position: absolute;
  width: 150px;
  border: 2px solid #007bff;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  user-select: none;
  cursor: default;
}

.node-header {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: grab;
}

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
  min-height: 40px;
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
