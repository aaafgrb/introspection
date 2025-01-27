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
          output: [{ to: [] }],
          target: null,
          updateConnectionFuncs: [],
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
          output: new Array(getFunctionArity(def.operation)).fill({ to: [] }),
          target: null,
          updateConnectionFuncs: [],
        })
    })

  state.nodes.forEach(def => {
    if (def.params) {
      def.params.forEach((p, i) => {
        if (p.ref) {
          state.nodes.get(p.ref).output[p.out].to.push({ nodeName: def.name, portIndex: i })
        }
      })
    }
  })
  console.log(state)

  //------------------------------------------------//
  //---------------PORT CONNECTION------------------//
  //------------------------------------------------//

  let connectingNodeId = null;

  const startConnect = (portId) => {
    connectingNodeId = portId
    emitter.emit("start_connect", portId)
  }

  const endConnect = (portId) => {
    console.log("connected", connectingNodeId, portId)
    const fromTo = portId.isInput
      ? { fromId: connectingNodeId, toId: portId }
      : { fromId: portId, toId: connectingNodeId }

    // let c = state.connections.get(fromTo.to.portId)
    // if (c) {
    //   emitter.emit("disconnect", c)
    // }

    // let d = state.nodes.get(fromTo.to.portId.nodeName).params[fromTo.to.portId.portIndex]
    // if (d.ref) {
    //   state.nodes.get(d.ref).to.filter(x =>
    //     x.ref != fromTo.to.portId.nodeName && x.out != fromTo.to.portId.portIndex)
    //   emitter.emit("disconnect", null)
    // }
    // //d.from = { nodeName: fromTo.from.portId.nodeName, portIndex: fromTo.from.portId.portIndex }
    // d.ref = fromTo.from.portId.nodeName
    // d.out = fromTo.from.portId.portIndex

    // state.nodes.get(fromTo.from.portId.nodeName).output[fromTo.from.portId.portIndex].to.push(
    //   { nodeName: fromTo.to.portId.nodeName, portIndex: fromTo.to.portId.portIndex })

    // console.log(state.nodes)

    // state.connections.set(fromTo.to.portId, fromTo)
    emitter.emit("connected", fromTo)
    connectingNodeId = null;
    emitter.emit("stop_connect", null)
  }

  //public
  const portHandleClick = (event, portId, portOffset, nodeData) => {
    if (!connectingNodeId) {
      startConnect(event, portId, portOffset, nodeData);
    } else {
      endConnect(event, portId, portOffset, nodeData);
    }
  }

  //public
  const cancelConnect = e => {
    connectingNodeId = null;
    emitter.emit("stop_connect", null)
  }

  //public
  const getNodeHandle = (nodeName, isInput, portIndex) => {
    return isInput
      ? state.nodes.get(nodeName).params[portIndex]
      : state.nodes.get(nodeName).output[portIndex]
  }

  //public
  const addToUpdateList = (nodeName, func) => {
    //state.nodes.get(nodeName).updateConnectionFuncs.push(func)
  }

  //public
  const removeFromUpdateList = (nodeName, func) => {
    // let array = state.nodes.get(nodeName).updateConnectionFuncs
    // const index = array.indexOf(func);
    // if (index > -1) {
    //   array.splice(index, 1);
    // }
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
    addToUpdateList,
    removeFromUpdateList,
  };
}
