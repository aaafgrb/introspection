<template>
  <div ref="background" @mousedown="onBackgroundMouseDown"
    @wheel="(event) => onWheelZoom(event, background, backgroundPosition)" class="background">
    <div :style="{
      left: `${backgroundPosition.x}px`,
      top: `${backgroundPosition.y}px`,
      transform: `scale(${localZoom})`,
      transformOrigin: '0 0'
    }" class="background-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, useTemplateRef } from "vue";
import { useDraggable } from "./useDraggable";
import { useZoomable } from "./useZoomable";

export default {
  expose: ["setPosition"],
  setup() {
    const background = useTemplateRef("background"); // Reference to the background element
    const backgroundPosition = ref({ x: 0, y: 0 });

    // Draggable functionality
    const { onMouseDown: onBackgroundMouseDown } = useDraggable({
      onDrag: (dx, dy) => {
        backgroundPosition.value.x += dx;
        backgroundPosition.value.y += dy;
      },
      condition: (event) => event.target === background.value,
    });

    // Zoomable functionality
    const { localZoom, cumulativeZoom, onWheelZoom } = useZoomable({
      initialZoom: 1,
      minZoom: 0.5,
      maxZoom: 3,
      zoomStep: 0.1,
      condition: (event) => event.target === background.value,
    });

    const setPosition = (x, y) => {
      backgroundPosition.value.x = x;
      backgroundPosition.value.y = y;
    }

    return {
      background,
      backgroundPosition,
      localZoom, cumulativeZoom,
      onBackgroundMouseDown,
      onWheelZoom,
      setPosition,
    };
  },
};
</script>


<style>
.background {
  cursor: grab;
  height: 100%;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.background-content {
  position: absolute;
}
</style>
