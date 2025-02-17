<template>
  <div class="function-node"
    :style="{ transform: `translate(${nodeData.component.position.x}px, ${nodeData.component.position.y}px)` }"
    @mousedown.stop="">
    <!-- header -->
    <div class=" node-header" @mousedown.stop="onHeaderMouseDown">
      {{ nodeData.name }}
    </div>
    <!-- content -->
    <div class="node-content">
      <div class="ports-container">
        <!-- Input Ports -->
        <div class="ports inputs" :style="{ '--port-flex': calculateFlex(nodeData.inPorts.length) }">
          <FunctionNodePort v-for="[key, port] in nodeData.inPorts" :key="key" :portData="port" :pageId="pageId"
            :nodeId="nodeData.id" ref="input-ports" />
        </div>
        <!-- Output Ports -->
        <div class="ports outputs" :style="{ '--port-flex': calculateFlex(nodeData.outPorts.length) }">
          <FunctionNodePort v-for="[key, port] in nodeData.outPorts" :key="key" :portData="port" :pageId="pageId"
            :nodeId="nodeData.id" ref="output-ports" />
        </div>
      </div>
      <div class="node-controls">
        <!-- Controls section -->
        <slot name="controls">Default Controls</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import FunctionNodePort from "./FunctionNodePort.vue";
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";

const props = defineProps({
  pageId: {
    required: true
  },
  nodeData: {
    type: Object,
    required: true
  }
})

const customFunctionPagesStore = useCustomFunctionPagesStore()

const { onMouseDown: onHeaderMouseDown } = useDraggable({
  onDrag: (dx, dy) => {
    customFunctionPagesStore.offsetNodePosition(props.pageId, props.nodeData.id, dx, dy)
  },
});

// Calculate flex factor for ports
const calculateFlex = (count) => {
  const maxPorts = Math.max(props.nodeData.inPorts.length, props.nodeData.outPorts.length) || 1;
  return count / maxPorts;
};

</script>

<style scoped>
.function-node {
  position: absolute;
  width: 150px;
  border: 2px solid var(--primary-color);
  background-color: var(--primary-background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  user-select: none;
  cursor: default;
}

.node-header {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: grab;
}

.node-content {
  display: flex;
  flex-direction: column;
  padding: 2px;
  background-color: var(--primary-background-color);
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
  background-color: var(--primary-color);
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  font-size: 12px;
  color: white;
  box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}
</style>
