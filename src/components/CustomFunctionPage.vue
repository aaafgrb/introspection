<template>
  <div class="custom-function-page" :class="{ minimized }" :style="{
    width: minimized ? '200px' : `${dimensions.width}px`,
    height: minimized ? '40px' : `${dimensions.height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
  }">
    <!-- Header with Minimize Button -->
    <div class="page-header" @mousedown="onHeaderMouseDown">
      <span>Custom Function</span>
      <button @click.stop="toggleMinimized" class="minimize-button">
        {{ minimized ? "Expand" : "Minimize" }}
      </button>
    </div>

    <!-- Page Content (Hidden When Minimized) -->
    <div v-show="!minimized" class="page-content" ref="pageContent">
      <DraggableBackground>
        <CustomFunctionNodes :custom-function-name="customFunctionName" :emitter="emitter" />
      </DraggableBackground>
    </div>

    <!-- Resize Handle (Hidden When Minimized) -->
    <div v-show="!minimized" class="resize-handle" @mousedown="onResizeMouseDown"></div>
  </div>
</template>


<script>
import { ref, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import FunctionNode from "./FunctionNode.vue";
import DraggableBackground from "./DraggableBackground.vue";
import CustomFunctionNodes from "./CustomFunctionNodes.vue";
import mitt from "mitt";

export default {
  components: {
    FunctionNode,
    DraggableBackground,
    CustomFunctionNodes,
  },
  props: {
    id: {
      required: true
    },
    customFunctionName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      minimized: false, // Track minimization state
    };
  },
  setup(props) {

    //emitter setup
    const emitter = mitt();

    //right click on content = cancel port connect setup
    const pageContent = useTemplateRef("pageContent")
    const cancelConnect = e => {
      e.preventDefault();
      pageContent.value.removeEventListener("contextmenu", cancelConnect);
      emitter.emit("stop_connect", null)
    }

    emitter.on("start_connect", e => {
      pageContent.value.addEventListener("contextmenu", cancelConnect);
    })

    // Draggable page header
    const position = ref({ x: 100, y: 100 });
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

    return {
      emitter,
      position,
      dimensions,
      onHeaderMouseDown,
      onResizeMouseDown,
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
