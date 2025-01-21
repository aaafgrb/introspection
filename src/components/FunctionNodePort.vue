<template>
  <div class="port">
    <span class="handle" :class="classObject" @click="mouseclick" ref="handle"></span>
    {{ label }}
  </div>
</template>

<script>
import LeaderLine from 'leader-line-new';
import { reactive, useTemplateRef, watch } from 'vue';

export default {
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
  setup(props) {
    const handleElement = useTemplateRef("handle")
    props.cfData.getNodeHandle(props.portId.nodeName, props.portId.isInput, props.portId.portIndex).target = handleElement

    const classObject = reactive({
      "dragging": false,
      "being-dragged-target": false,
      "wrong-io-type": false,
      "wrong-data-type": false,
    })

    const mouseclick = function (event) {
      props.cfData.portHandleClick(event, props.portId)
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

    let leaderLine = null

    props.cfData.emitter.on("connected", ({ fromId, toId, line }) => {
      if (props.portId == fromId || props.portId == toId) {
        leaderLine = line
      }
    })

    watch(props.nodeData.position, () => {
      if (leaderLine) {
        leaderLine.position()
      }
    })

    return {
      mouseclick,
      classObject,
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