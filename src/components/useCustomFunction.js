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
        })
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
    if (portId == connectingNodeId && portId.isInput) {
      emitter.emit("disconnect", portId)
    } else if (portId.isInput != connectingNodeId.isInput) {
      console.log("connected", connectingNodeId, portId)
      const fromTo = portId.isInput
        ? { fromId: connectingNodeId, toId: portId }
        : { fromId: portId, toId: connectingNodeId }

      emitter.emit("connected", fromTo)
    }
    connectingNodeId = null;
    emitter.emit("stop_connect", null)
  }

  //public
  const portHandleClick = (portId) => {
    if (!connectingNodeId) {
      startConnect(portId);
    } else {
      endConnect(portId);
    }
  }

  //public
  const cancelConnect = e => {
    connectingNodeId = null;
    emitter.emit("stop_connect", null)
  }


  //------------------------------------------------//
  //----------------NODE SOLVING--------------------//
  //------------------------------------------------//

  // Resolve a node's output lazily
  //const resolveNode = (nodeName) => solveMiddleVariable(nodeName, customFunctionDefinition.definition.middle, state.resolvedValues);

  // Watch for changes in the definition to update state reactively
  // watch(
  //   customFunctionDefinition,
  //   (newDef) => {
  //     initialize(); // Reinitialize when the definition changes
  //     state.resolvedValues.clear(); // Clear resolved cache
  //   },
  // );
  // Expose public API

  //------------------------------------------------//
  //----------------NODE CONFIG--------------------//
  //------------------------------------------------//


  return {
    state,
    emitter,
    cancelConnect,
    portHandleClick,
  };
}
