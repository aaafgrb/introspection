<template>
  <div class="function-node" ref="function-node"
    :style="{ transform: `translate(${nodeData.component.position.x}px, ${nodeData.component.position.y}px)` }"
    @mousedown.stop="" :title="docs.description">
    <!-- header -->
    <div class=" node-header" @mousedown.stop="onHeaderMouseDown">
      {{ `${nodeData.name} : ${nodeData.operation}` }}
    </div>
    <!-- content -->
    <div class="node-content">
      <div class="ports-container">
        <!-- Input Ports -->
        <div class="ports inputs" :style="{ '--port-flex': calculateFlex(nodeData.inPorts.size) }">
          <FunctionNodePort v-for="[key, port] in nodeData.inPorts" :key="key" :portData="port" :pageId="pageId"
            :title="docs.input_type" :nodeId="nodeData.id" ref="input-ports" />
        </div>
        <!-- Output Ports -->
        <div class="ports outputs" :style="{ '--port-flex': calculateFlex(nodeData.outPorts.size) }">
          <FunctionNodePort v-for="[key, port] in nodeData.outPorts" :key="key" :portData="port" :pageId="pageId"
            :title="docs.output_type" :nodeId="nodeData.id" ref="output-ports" />
        </div>
      </div>
      <div class="node-controls">
        <!-- Controls section -->
        <button class="control-button" @click="renameNode" title="Rename Node">n</button>
        <button class="control-button" @click="addOutput" title="Add Output">o</button>
        <button class="control-button" @click="deleteNode" title="Delete Node">x</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, Teleport, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import FunctionNodePort from "./FunctionNodePort.vue";
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";
import { useFunctionRegistryStore } from "@/stores/useFunctionRegistryStore";

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
const functionRegistryStore = useFunctionRegistryStore()

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

const docs = computed(() => {
  let t = functionRegistryStore.getFunction(props.nodeData.operation)
  return t ? t.docs : {}
})

const openInputBox = inject("openInputBox")
const functionNode = useTemplateRef("function-node")


const renameNode = () => {
  openInputBox(value => {
    customFunctionPagesStore.setNodeName(props.pageId, props.nodeData.id, value)
  },
    { y: -80, teleport: functionNode.value })
}
const addOutput = () => { }
const deleteNode = () => { customFunctionPagesStore.deleteNode(props.pageId, props.nodeData.id) }

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
  text-align: left;
  font-size: 12px;
  color: white;
  box-shadow: inset 0px -2px 2px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}

.control-button {
  background-color: transparent;
  border: none;
  color: var(--primary-text-color);
}

.control-button:hover {
  background-color: var(--primary-button-hover-color);
}
</style>
