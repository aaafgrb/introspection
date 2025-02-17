<template>
  <div class="custom-function-page" :class="connectionClass" :style="{
    width: minimized ? '200px' : `${pageData.component.dimensions.width}px`,
    height: minimized ? '40px' : `${pageData.component.dimensions.height}px`,
    zIndex: pageData.component.zIndex,
    transform: `translate(${pageData.component.position.x}px, ${pageData.component.position.y}px)`
  }" ref="page" @mousedown="interactedWith">
    <!-- Header with Minimize Button -->
    <div class="page-header" @mousedown="onHeaderMouseDown">
      <span>{{ pageData.pageName ?? "Unnamed Custom Function" }}</span>
      <button @click.stop="toggleMinimized" class="minimize-button">
        {{ minimized ? "Expand" : "Minimize" }}
      </button>
    </div>

    <!-- Page Content (Hidden When Minimized) -->
    <div v-show="!minimized" class="page-content" @contextmenu="onContextMenu">
      <DraggableBackground>
        <FunctionNode v-for="[key, node] in pageData.nodes" :nodeData="node" :key="key" :pageId="pageData.id" />
        <ConnectionArrow v-for="[key, connection] in pageData.connections" :key="key" :pageId="pageData.id"
          :connectionData="connection" />
      </DraggableBackground>
    </div>

    <!-- Resize Handle (Hidden When Minimized) -->
    <div v-show="!minimized" class="resize-handle" @mousedown="onResizeMouseDown">
    </div>
    <CustomFunctionSidebar :pageData="pageData" />
  </div>
</template>

<script setup>
import { ref, watch, useTemplateRef, onMounted, computed } from "vue";
import { useDraggable } from "./useDraggable";
import DraggableBackground from "./DraggableBackground.vue";
import FunctionNode from "./FunctionNode.vue";
import ConnectionArrow from "./ConnectionArrow.vue";
import CustomFunctionSidebar from "./CustomFunctionSidebar.vue";
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";

const props = defineProps({
  pageData: {
    type: Object,
    required: true
  }
})

const customFunctionPageStore = useCustomFunctionPagesStore()
const minimized = ref(false);

const toggleMinimized = () => {
  minimized = !minimized;
}

const onContextMenu = (e) => {
  e.preventDefault();
  customFunctionPageStore.pageRightClick(props.pageData.id, e)
}

// Draggable page header
const { onMouseDown: onHeaderMouseDown } = useDraggable({
  onDrag: (dx, dy) => {
    customFunctionPageStore.offsetPagePosition(props.pageData.id, dx, dy)
  },
});

// Resizable page
const { onMouseDown: onResizeMouseDown } = useDraggable({
  onDrag: (dx, dy) => {
    customFunctionPageStore.offsetPageDimensions(props.pageData.id, dx, dy)
  },
});

const connectionClass = computed(() => {
  if (props.pageData.component.connectingPort) {
    return props.pageData.component.connectingPort.isInput ?
      { 'connecting-ports': true, 'connecting-input': true } :
      { 'connecting-ports': true, 'connecting-output': true }
  }
})

const interactedWith = () => {
  customFunctionPageStore.bringPageToTop(props.pageData.id)
}
</script>

<style scoped>
.custom-function-page {
  position: absolute;
  background-color: var(--primary-background-color);
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  user-select: none;
}

.page-header {
  height: 40px;
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  cursor: grab;
}

.minimize-button {
  background: none;
  border: none;
  color: var(--primary-text-color);
  cursor: pointer;
  font-size: 14px;
}

.page-content {
  height: calc(100% - 40px);
  overflow: hidden;
  background-color: var(--primary-background-color);
  position: relative;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: var(--primary-color);
  cursor: se-resize;
}
</style>
