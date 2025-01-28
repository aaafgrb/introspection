<template>
  <div class="port">
    <span class="handle" :class="classObject" @click="mouseclick" ref="handle"></span>
    {{ label }}
  </div>
  <Teleport v-if="portId.isInput && from && to && cfData.connectionsArea.value" :to="cfData.connectionsArea.value">
    <ConnectionArrow ref="connectionArrow" :from="from" :to="to" />
  </Teleport>
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
    if (this.portId.isInput) {
      this.nodeData.params[this.portId.portIndex].offset = this.updatePortOffset()
      let o = this.nodeData.params[this.portId.portIndex]
      if (o.ref) {
        this.addConnection({ nodeName: o.ref, portIndex: o.out })
      }
      this.to = {
        width: this.handleElement.offsetWidth,
        height: this.handleElement.offsetHeight,
        portOffset: this.offset,
        nodePosition: this.nodeData.position
      }
    } else {
      this.nodeData.output[this.portId.portIndex].offset = this.updatePortOffset()
    }

  },
  expose: ['updateConnections'],
  setup(props) {
    const handleElement = useTemplateRef("handle")
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

    const currentOutPortId = ref(null)
    const connectionArrow = props.portId.isInput ? useTemplateRef("connectionArrow") : null
    const from = ref(null)
    const to = ref(null)

    const updateConnections = props.portId.isInput ?
      () => { if (connectionArrow.value) connectionArrow.value.updateLine() } :
      () => { props.nodeData.output.forEach(e => e.to.forEach(x => { if (x.func) x.func() })) }

    const removeConnection = () => {
      const n = props.cfData.state.nodes.get(currentOutPortId.value.nodeName).output[currentOutPortId.value.portIndex]
      let index = n.to.findIndex(x => x.nodeName == props.portId.nodeName && x.portIndex == props.portId.portIndex)
      if (index > -1) n.to.splice(index, 1)

      currentOutPortId.value = null
      from.value = null
    }

    const addConnection = (fromId) => {
      if (currentOutPortId.value) {
        removeConnection()
      }
      currentOutPortId.value = fromId
      let n = props.cfData.state.nodes.get(fromId.nodeName)
      let o = n.output[fromId.portIndex]
      o.to.push({ nodeName: props.portId.nodeName, portIndex: props.portId.portIndex, func: updateConnections })
      from.value = {
        //assuming the port handle of the output is the same size as this handle
        width: handleElement.value.offsetWidth,
        height: handleElement.value.offsetHeight,
        portOffset: o.offset,
        nodePosition: n.position
      }
    }

    //input ports only
    if (props.portId.isInput) {
      props.cfData.emitter.on("connected", (fromTo) => {
        if (props.portId == fromTo.toId) {
          addConnection(fromTo.fromId)
        }
      })

      props.cfData.emitter.on("disconnect", (toId) => {
        if (toId.nodeName == props.portId.nodeName && toId.portIndex == props.portId.portIndex) {
          removeConnection()
        }
      })

    }

    const mouseclick = function (event) {
      props.cfData.portHandleClick(props.portId)
    }

    //-----------------------connection css----------------------------

    const classObject = reactive({
      "dragging": false,
      "being-dragged-target": false,
      "wrong-io-type": false,
      "wrong-data-type": false,
    })

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

    //----------------------------------------

    return {
      mouseclick,
      classObject,
      currentOutPortId,
      updatePortOffset,
      offset,
      updateConnections,
      from, to,
      handleElement,
      addConnection
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