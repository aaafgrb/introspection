<template>
  <div class="port">
    <span class="handle" :class="portData.component.style" @click="mouseclick" ref="handle"></span>
    {{ portData.data.var ?? portData.data.val ?? "undefined" }}
  </div>
  <!-- <Teleport v-if="portId.isInput && from && to && cfData.connectionsArea.value" :to="cfData.connectionsArea.value">
    <ConnectionArrow ref="connectionArrow" :from="from" :to="to" />
  </Teleport> -->
</template>

<script setup>
import { useCustomFunctionPagesStore } from '@/stores/useCustomFunctionPagesStore'
import { onMounted, useTemplateRef } from 'vue'

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
  let o = updatePortOffset()
  customFunctionPageStore.setPortOffset(props.pageId, props.nodeId, props.portData.isInput, props.portData.id,
    o.x + handleElement.value.offsetWidth / 2, o.y + handleElement.value.offsetHeight / 2)
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
  return offset
}

const mouseclick = () => {
  customFunctionPageStore.portCallbackClick(props.pageId, props.pageId, props.portData.id)
}

</script>

<!-- 
  props.cfData.emitter.on("start_connect", function (hitPortId) {
    if (hitPortId.isInput == props.portId.isInput) {
      classObject["wrong-io-type"] = true
      classObject["being-dragged-target"] = hitPortId == props.portId
    } else {
      classObject["dragging"] = true
    }
  })

  props.cfData.emitter.on("stop_connect", e => {
    for (let key in classObject) {
      classObject[key] = false
    }
  }) 
-->

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

.dragging {
  transform: scale(1.2);
  background-color: var(--port-color);
  animation: pulse 1s infinite
}

.dragging:hover {
  transform: scale(1.6) !important;
  animation: none
}


.handle.being-dragged-target {
  transform: scale(1.6);
  background-color: var(--port-cancel-color) !important;
  animation: pulse 10s infinite
}

.handle.wrong-io-type {
  background-color: var(--port-off-color);
  ;
}

.handle.wrong-io-type:hover {
  transform: scale(1) !important
}

.wrong-data-type {
  background-color: var(--port-warn-color);
  animation: pulse 1s infinite
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