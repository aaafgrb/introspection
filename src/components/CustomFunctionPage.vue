<template>
  <div class="custom-function-page" :class="{ minimized }" :style="{
    width: minimized ? '200px' : `${dimensions.width}px`,
    height: minimized ? '40px' : `${dimensions.height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: zIndex,
  }" @mousedown="$emit('interactedWith')">
    <!-- Header with Minimize Button -->
    <div class="page-header" @mousedown="onHeaderMouseDown">
      <span>{{ name ?? "Unnamed Custom Function" }}</span>
      <button @click.stop="toggleMinimized" class="minimize-button">
        {{ minimized ? "Expand" : "Minimize" }}
      </button>
    </div>

    <!-- Page Content (Hidden When Minimized) -->
    <div v-show="!minimized" class="page-content" @contextmenu="onContextMenu">
      <DraggableBackground>
        <FunctionNode :cfData="cfData" v-for="[key, node] in cfData.state.nodes" :nodeData="node" :key="key" />
        <div ref="connectionsArea"></div>
      </DraggableBackground>
    </div>

    <!-- Resize Handle (Hidden When Minimized) -->
    <div v-show="!minimized" class="resize-handle" @mousedown="onResizeMouseDown"></div>
    <CustomFunctionSidebar :cfData="cfData" :name="name" :customFunctionName="customFunctionName" />
  </div>
</template>
<!-- //todo: viewonly | edit<br>
//todo: clean unused registry logic<br>
-->

<script>
import { ref, watch, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import DraggableBackground from "./DraggableBackground.vue";
import FunctionNode from "./FunctionNode.vue";
import { useCustomFunction } from "./useCustomFunction";
import ConnectionArrow from "./ConnectionArrow.vue";
import CustomFunctionSidebar from "./CustomFunctionSidebar.vue";

export default {
  components: {
    FunctionNode,
    DraggableBackground,
    ConnectionArrow,
    CustomFunctionSidebar,
  },
  props: {
    id: {
      required: true
    },
    customFunctionName: {
      type: String,
      required: true,
    },
    name: {
      type: String
    },
    startPosition: {
      type: Object,
      default: { x: 100, y: 100 }
    },
    zIndex: {
      required: true,
      type: Number
    },
  },
  data() {
    return {
      minimized: false,
    };
  },
  expose: ['resetPosition', 'getDimentions'],
  setup(props) {
    const cfData = useCustomFunction(props.customFunctionName)
    const connectionsArea = useTemplateRef("connectionsArea")
    cfData.connectionsArea = connectionsArea;

    const onContextMenu = (e) => {
      e.preventDefault();
      cfData.cancelConnect();
    }

    // Draggable page header
    const position = ref({ x: props.startPosition.x, y: props.startPosition.y });

    const { onMouseDown: onHeaderMouseDown } = useDraggable({
      onDrag: (dx, dy) => {
        position.value.x += dx;
        position.value.y += dy;
      },
    });

    // Resizable page
    const dimensions = ref({ width: 400, height: 300 });
    const { onMouseDown: onResizeMouseDown } = useDraggable({
      onDrag: (dx, dy) => {
        dimensions.value.width += dx;
        dimensions.value.height += dy;

        // Ensure minimum size
        dimensions.value.width = Math.max(dimensions.value.width, 200);
        dimensions.value.height = Math.max(dimensions.value.height, 150);
      },
    });

    const resetPosition = () => {
      dimensions.value.width = 400;
      dimensions.value.height = 300;
      position.value.x = props.startPosition.x
      position.value.y = props.startPosition.y
    }

    const getDimentions = () => {
      return { x: position.value.x, y: position.value.y, width: dimensions.value.width, height: dimensions.value.height }
    }

    return {
      cfData,
      position,
      dimensions,
      onHeaderMouseDown,
      onResizeMouseDown,
      onContextMenu,
      resetPosition,
      getDimentions
    };
  },
  methods: {
    toggleMinimized() {
      this.minimized = !this.minimized;
    },
  },
};

</script>

<style scoped>
.custom-function-page {
  position: absolute;
  background-color: #f8f9fa;
  border: 2px solid #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
}

.custom-function-page.minimized {
  overflow: hidden;
}

.page-header {
  height: 40px;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  cursor: grab;
}

.minimize-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.page-content {
  height: calc(100% - 40px);
  overflow: hidden;
  background-color: white;
  position: relative;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: #007bff;
  cursor: se-resize;
}
</style>
