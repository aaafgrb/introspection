<template>
  <div class="port" ref="port" @contextmenu="onContextMenu">
    <span class="handle" :class="{ beingConnected: portData.component.beingConnected }" @click="mouseclick"
      ref="handle"></span>
    {{ portData.data.var ?? portData.data.val ?? "undefined" }}
  </div>
</template>

<script setup>
import { useCustomFunctionPagesStore } from '@/stores/useCustomFunctionPagesStore'
import { inject, onMounted, Teleport, useTemplateRef } from 'vue'

const props = defineProps({
  pageId: {
    required: true
  },
  nodeId: {
    required: true
  },
  portData: {
    type: Object,
    required: true
  }
})

const customFunctionPageStore = useCustomFunctionPagesStore()

onMounted(() => {
  updatePortOffset()
  customFunctionPageStore.setPortOffsetUpdateFunction(
    props.pageId, props.nodeId, props.portData.isInput, props.portData.id, updatePortOffset)
})

const handleElement = useTemplateRef("handle")
const updatePortOffset = () => {
  let walk = handleElement.value
  let offset = { x: 0, y: 0 }

  while (walk && !walk.classList.contains("function-node")) {
    offset.x += walk.offsetLeft
    offset.y += walk.offsetTop
    walk = walk.parentElement
  }
  if (!walk) {
    console.warn("Failed node port offset calculation. function-node class not found")
    offset.x = 0;
    offset.y = 0;
  }
  customFunctionPageStore.setPortOffset(props.pageId, props.nodeId, props.portData.isInput, props.portData.id,
    offset.x + handleElement.value.offsetWidth / 2, offset.y + handleElement.value.offsetHeight / 2)
}

const mouseclick = () => {
  customFunctionPageStore.portCallbackClick(props.pageId, props.nodeId, props.portData.isInput, props.portData.id)
}

const openOptionSelector = inject("openOptionSelector")
const portElement = useTemplateRef("port")

const onContextMenu = () => {
  openOptionSelector((value) => {
    switch (value) {
      case "Remove":
        customFunctionPageStore.deletePort(props.pageId, props.nodeId, props.portData.isInput, props.portData.id)
        break
    }
  }, {
    teleport: portElement.value, x: 20,
    options: ["Remove"]
  })
}

</script>

<style scoped>
.port {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 28px;
  min-width: 50px;
  height: 100%;
  font-size: 12px;
  position: relative;
}

.port .handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border: 2px solid var(--primary-background-color);
  border-radius: 50%;
  cursor: grab;
  transform-origin: center;
}

.ports.inputs .port .handle {
  left: -10px;
}

.ports.outputs .port .handle {
  right: -10px;
}

/*------------------connecting ports---------------------*/

.custom-function-page.connecting-ports .handle {
  transform: scale(1.2);
  background-color: var(--port-color);
  animation: pulse 1s infinite
}

.custom-function-page.connecting-ports .handle:hover {
  transform: scale(1.6);
  animation: none
}

.custom-function-page.connecting-ports .handle.beingConnected {
  transform: scale(1.3) !important;
  background-color: var(--port-cancel-color) !important;
  animation: pulse 10s infinite !important
}

.custom-function-page.connecting-output .ports.outputs .handle {
  background-color: var(--port-off-color);
  transform: scale(1);
  animation: none;
}

.custom-function-page.connecting-input .ports.inputs .handle {
  background-color: var(--port-off-color);
  transform: scale(1);
  animation: none;
}

/*--------------------------------------------------*/

.port .handle:hover {
  transform: scale(1.4);
  transition: width 0.2s ease, height 0.2s ease;
  transform-origin: center;
}

/* Animation */
@keyframes pulse {

  0%,
  100% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1.4);
  }
}
</style>