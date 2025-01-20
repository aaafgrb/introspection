<template>
  <div class="custom-function-nodes">
    <FunctionNode :emitter="emitter" v-for="[key, node] in state.nodes" :nodeData="node" :key="key" />
    //todo: connections
    //todo: viewonly | edit
  </div>
</template>

<script>
import { useCustomFunction } from "./useCustomFunction";
import { useCustomFunctionStore } from "@/stores/customFunctionStore";
import FunctionNode from "./FunctionNode.vue";

export default {
  components: { FunctionNode },
  props: {
    emitter: {
      required: true
    },
    customFunctionName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const customFunctionDefinition = useCustomFunctionStore().getDefinition(props.customFunctionName)
    const { state, connections, addConnection } = customFunctionDefinition ?
      useCustomFunction(customFunctionDefinition) :
      { state: { nodes: [], connections: [] } };

    //----------connection logic----------------
    let connectingNode = null;

    const startConnect = (data) => {
      connectingNode = data
      props.emitter.emit("start_connect", { data: data })
    }

    const endConnect = (data) => {
      console.log("connected", connectingNode, data)
      addConnection(null, connectingNode, data)

      props.emitter.emit("stop_connect", null)
    }

    props.emitter.on("port_handle_click", (data) => {
      if (!data.target.classList.contains("handle")) return;

      if (connectingNode) {
        endConnect(data);
      } else {
        startConnect(data);
      }
    })

    props.emitter.on("stop_connect", e => { connectingNode = null })

    //-------------------------------------------

    return {
      state,
      connections,
      connectingNode,
    };
  },
};
</script>

<style scoped>
.linePoint {
  position: absolute;
}
</style>