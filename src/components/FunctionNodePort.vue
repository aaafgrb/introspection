<template>
  <div class="port">
    <span class="handle" :class="classObject" @click="mouseclick" ref="handle"></span>
    {{ label }}
  </div>
</template>

<script>

import { reactive, useTemplateRef, watch, ref } from 'vue';
import ConnectionArrow from './ConnectionArrow.vue';

export default {
  components: {
    ConnectionArrow
  },
  props: {
    portId: {
      type: Object,
      required: true
    },
    cfData: {
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: "default"  //change for more data later
    },
  },
  mounted() {
    this.updatePortOffset()
  },
  setup(props) {
    const handleElement = useTemplateRef("handle")
    const p = props.cfData.getNodeHandle(props.portId.nodeName, props.portId.isInput, props.portId.portIndex)
    // p.target = handleElement
    // p.nodeData = props.nodeData

    const offset = ref({ x: 0, y: 0 })
    const updatePortOffset = () => {
      let walk = handleElement.value

      while (walk && !walk.classList.contains("function-node")) {
        offset.value.x += walk.offsetLeft
        offset.value.y += walk.offsetTop
        walk = walk.parentElement
      }
      if (!walk) {
        console.warn("Failed node port offset calculation. function-node class not found")
        offset.value.x = 0;
        offset.value.y = 0;
      }
      return offset.value
    }
    const classObject = reactive({
      "dragging": false,
      "being-dragged-target": false,
      "wrong-io-type": false,
      "wrong-data-type": false,
    })

    const mouseclick = function (event) {
      props.cfData.portHandleClick(event, props.portId, offset, props.nodeData)
    }

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

    const currentLine = ref(null)

    props.cfData.emitter.on("connected", (fromTo) => {
      if (props.portId == fromTo.from.portId || props.portId == fromTo.to.portId) {
        currentLine.value = fromTo
      }
    })

    props.cfData.state.connections.get(props.portId)
    watch(props.nodeData.position, () => {
      if (currentLine.value && currentLine.value.update) {
        currentLine.value.update()
      }
    })

    return {
      mouseclick,
      classObject,
      currentLine,
      updatePortOffset,
      offset
    };
  },
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
  background-color: #007bff;
  border: 2px solid white;
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
  background-color: #007bff;
  animation: pulse 1s infinite
}

.dragging:hover {
  transform: scale(1.6) !important;
  animation: none
}


.handle.being-dragged-target {
  transform: scale(1.6);
  background-color: red !important;
  animation: pulse 10s infinite
}

.handle.wrong-io-type {
  background-color: gray;
}

.handle.wrong-io-type:hover {
  transform: scale(1) !important
}

.wrong-data-type {
  background-color: yellow;
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