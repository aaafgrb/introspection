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
    <div v-show="!minimized" class="page-content" @contextmenu="onContextMenu">
      <DraggableBackground>
        <FunctionNode :cfData="cfData" v-for="[key, node] in cfData.state.nodes" :nodeData="node" :key="key" />
        <div ref="connectionsArea"></div>
      </DraggableBackground>
    </div>

    <!-- Resize Handle (Hidden When Minimized) -->
    <div v-show="!minimized" class="resize-handle" @mousedown="onResizeMouseDown"></div>
  </div>
</template>
<!-- //todo: viewonly | edit<br>
//todo: clean unused registry logic<br>
//todo: store connections logic (not only leader line) for the node resolving<br>
//todo: put an svg on exactly on top of the background and chnage its viewbox attribute when the background
position changes and change its size when its resized (maybe it could even be made in the background component?)
<br>
//todo: for the arrows do the same thing as the previous one? -->

<script>
import { ref, computed, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import DraggableBackground from "./DraggableBackground.vue";
import FunctionNode from "./FunctionNode.vue";
import { useCustomFunction } from "./useCustomFunction";
import ConnectionArrow from "./ConnectionArrow.vue";

export default {
  components: {
    FunctionNode,
    DraggableBackground,
    ConnectionArrow
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
  computed: {
    connections() {
      return Array.from(this.cfData.state.nodes, ([key, value]) =>
        value.params
          .filter(x => x.ref)
          .map((x, index) => ({
            from: x,
            to: { nodeName: key, portIndex: index }
          }))
      ).flat()
    }
  },
  data() {
    return {
      minimized: false, // Track minimization state
    };
  },
  setup(props) {
    const cfData = useCustomFunction(props.customFunctionName)
    const connectionsArea = useTemplateRef("connectionsArea")
    cfData.connectionsArea = connectionsArea;

    const onContextMenu = (e) => {
      e.preventDefault();
      cfData.cancelConnect();
    }

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
      cfData,
      position,
      dimensions,
      onHeaderMouseDown,
      onResizeMouseDown,
      onContextMenu,
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
