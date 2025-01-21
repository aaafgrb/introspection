<template>
  <div class="function-node" :style="{ top: `${position.y}px`, left: `${position.x}px` }" ref="node" @mousedown.stop="">
    <div class=" node-header" @mousedown.stop="onHeaderMouseDown">
      {{ nodeData.name }}
    </div>
    <FunctionNodeContent :cfData="cfData" :inputs="nodeData.params" :outputs="nodeData.output" :nodeData="nodeData" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useDraggable } from "./useDraggable";
import FunctionNodeContent from "./FunctionNodeContent.vue";

export default {
  components: {
    FunctionNodeContent
  },
  props: {
    cfData: {
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    content: {
      type: String,
      default: "Node Content",
    },
  },
  mounted() {
    this.position = this.nodeData.position ?? { x: 100, y: 100 }
  },
  setup() {
    const position = ref({ x: 0, y: 0 });
    // Draggable page header
    const { onMouseDown: onHeaderMouseDown } = useDraggable({
      onDrag: (dx, dy) => {
        position.value.x += dx;
        position.value.y += dy;
      },
    });
    return {
      position,
      onHeaderMouseDown
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
</style>
