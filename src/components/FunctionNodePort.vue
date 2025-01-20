<template>
  <div class="port">
    <span class="handle" :class="classObject" @click="(e) => mouseclick(e)" ref="handle"></span>
    {{ label }}
  </div>
</template>

<script>
import LeaderLine from 'leader-line-new';
import { reactive, useTemplateRef } from 'vue';

export default {
  props: {
    emitter: {
      required: true
    },
    isInput: {
      type: Boolean,
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      default: "default"  //change for more data later
    },
  },
  mounted: () => {
    if (this.nodeData.params[this.index].ref) {
      console.log(this.nodeData.params[props.nodeData.params[props.index].ref], this.handleElement)
      new LeaderLine(this.nodeData.params[props.nodeData.params[props.index].ref], this.handleElement)
    }
  },
  setup(props) {
    const handleElement = useTemplateRef("handle")
    props.nodeData.params[props.index].handleElement = handleElement
    const classObject = reactive({
      "dragging": false,
      "being-dragged-target": false,
      "wrong-io-type": false,
      "wrong-data-type": false,
    })

    const mouseclick = function (event) {
      props.emitter.emit("port_handle_click",
        {
          target: event.target,
          isInput: props.isInput,
          portIndex: props.index,
          nodeName: props.nodeData.name,
        }
      )
    }

    props.emitter.on("start_connect", function (e) {
      if (e.data.isInput == props.isInput) {
        classObject["wrong-io-type"] = true
        classObject["being-dragged-target"] =
          e.data.portIndex == props.index &&
          e.data.nodeName == props.nodeData.name
      } else {
        classObject["dragging"] = true
      }

    })

    props.emitter.on("stop_connect", e => {
      for (let key in classObject) {
        classObject[key] = false
      }
    })

    return {
      mouseclick,
      classObject,
      handleElement,
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
  height: 20px;
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