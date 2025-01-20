import { reactive, watch, computed, toRaw } from "vue";
import { solveMiddleVariable } from "@/lib/customFunctions";

/**
 * Composable to manage a custom function instance
 * @param {Object} customFunctionDefinition - The definition of the custom function
 */
export function useCustomFunction(customFunctionDefinition) {
  if (!customFunctionDefinition) {
    console.warn("Invalid custom function definition. Aborting instance creation");
    return null;
  }

  const state = reactive({
    nodes: new Map(),
    connections: [],
    resolvedValues: new Map(), // Cache for resolved node outputs
  });

  // Initialize nodes and connections from definition
  const initialize = () => {
    customFunctionDefinition.definition.input.forEach(
      (name, index) => {
        if (state.nodes.has(name)) {
          console.warn(`Overwritting already existing node "${name}" on custom function "${customFunctionDefinition.name}"`)
        }
        state.nodes.set(
          name,
          {
            name: name,
            position: { x: 50, y: 100 + 150 * index },
            operation: "input",
            params: [{ "val": index }]
          },
        )
      })

    customFunctionDefinition.definition.middle.forEach(
      (def, index) => {
        if (state.nodes.has(def.name)) {
          console.warn(`Overwritting already existing node "${def.name}" on custom function "${customFunctionDefinition.name}"`)
        }
        state.nodes.set(
          def.name,
          {
            name: def.name,
            position: { x: 300 + 250 * index, y: 100 },
            operation: def.operation,
            params: structuredClone(toRaw(def.params))
          },
        )
      })

    state.nodes.forEach(def => {
      if (def.params) {
        def.params.forEach((p, i) => {
          if (p.ref) {
            state.connections.push({ from: { nodeName: p.ref, portIndex: 0 }, to: { nodeName: def.name, portIndex: i } })
          }
        })
      }
    })
  };
  initialize();
  console.log(state)
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
    resolveNode,
    addConnection,
  };
}