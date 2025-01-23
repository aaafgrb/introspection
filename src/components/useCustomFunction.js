import { reactive, watch, computed, toRaw } from "vue";
import { solveMiddleVariable } from "@/lib/customFunctions";
import mitt from "mitt";
import { useCustomFunctionStore } from "@/stores/customFunctionStore";
import { getFunctionArity } from "@/lib/functionRegistry";

/**
 * Composable to manage a custom function instance
 * @param {Object} customFunctionName - The name of the custom function
 */
export function useCustomFunction(customFunctionName) {
  const customFunctionStore = useCustomFunctionStore()
  const customFunctionDefinition = customFunctionStore.getDefinition(customFunctionName)

  if (!customFunctionDefinition) {
    //TODO: handle this case better
    console.warn("Inexistent custom function name. Aborting instance creation");
    return null;
  }

  //------------------------------------------------//
  //-------------------SETUP------------------------//
  //------------------------------------------------//

  const emitter = mitt()
  const state = reactive({
    nodes: new Map(),
    connections: new Map(),
    resolvedValues: new Map(), // Cache for resolved node outputs
  });

  // Initialize nodes and connections from definition
  customFunctionDefinition.definition.input.forEach(
    (name, index) => {
      if (state.nodes.has(name))
        console.warn(`Overwritting already existing node "${name}" on custom function "${customFunctionDefinition.name}"`)
      state.nodes.set(
        name,
        {
          name: name,
          operation: "input",
          params: [{ "val": index }],
          position: { x: 50, y: 100 + 150 * index },
          output: [{}],
          target: null,
        })
    })

  customFunctionDefinition.definition.middle.forEach(
    (def, index) => {
      if (state.nodes.has(def.name))
        console.warn(`Overwritting already existing node "${def.name}" on custom function "${customFunctionDefinition.name}"`)
      state.nodes.set(
        def.name,
        {
          name: def.name,
          operation: def.operation,
          params: structuredClone(toRaw(def.params)),
          position: { x: 300 + 250 * index, y: 100 },
          output: new Array(getFunctionArity(def.operation)).fill({}),
          target: null,
        })
    })

  state.nodes.forEach(def => {
    if (def.params) {
      def.params.forEach((p, i) => {
        if (p.ref) {
          state.nodes.get(def.name).params[i].from = { nodeName: p.ref, portIndex: p.out }
        }
      })
    }
  })
  console.log(state)

  //------------------------------------------------//
  //---------------PORT CONNECTION------------------//
  //------------------------------------------------//

  let connectingNode = null;

  const startConnect = (event, portId, portOffset, nodeData) => {
    connectingNode = { target: event.target, portId, portOffset, nodeData }
    emitter.emit("start_connect", portId)
  }

  const endConnect = (event, portId, portOffset, nodeData) => {
    console.log("connected", connectingNode.portId, portId)
    console.log(state.nodes)
    const fromTo = portId.isInput
      ? { from: connectingNode, to: { target: event.target, portId, portOffset, nodeData } }
      : { from: { target: event.target, portId, portOffset, nodeData }, to: connectingNode }
    emitter.emit("connected", fromTo)

    state.connections.set(fromTo.to.portId, fromTo)
    connectingNode = null;
    emitter.emit("stop_connect", null)
  }

  //public
  const portHandleClick = (event, portId, portOffset, nodeData) => {
    if (!connectingNode) {
      startConnect(event, portId, portOffset, nodeData);
    } else {
      endConnect(event, portId, portOffset, nodeData);
    }
  }

  //public
  const cancelConnect = e => {
    emitter.emit("stop_connect", null)
  }

  //public
  const getNodeHandle = (nodeName, isInput, portIndex) => {
    return isInput
      ? state.nodes.get(nodeName).params[portIndex]
      : state.nodes.get(nodeName).output[portIndex]
  }

  //------------------------------------------------//
  //----------------NODE SOLVING--------------------//
  //------------------------------------------------//

  // Resolve a node's output lazily
  const resolveNode = (nodeName) => solveMiddleVariable(nodeName, customFunctionDefinition.definition.middle, state.resolvedValues);

  const addConnection = (fromData, toData) => {
    console.log(customFunctionDefinition)
    //customFunctionDefinitionInstance.definition.middle.
  }

  // Watch for changes in the definition to update state reactively
  // watch(
  //   customFunctionDefinition,
  //   (newDef) => {
  //     initialize(); // Reinitialize when the definition changes
  //     state.resolvedValues.clear(); // Clear resolved cache
  //   },
  // );
  // Expose public API
  return {
    state,
    emitter,
    resolveNode,
    addConnection,
    cancelConnect,
    portHandleClick,
    getNodeHandle,
  };
}
