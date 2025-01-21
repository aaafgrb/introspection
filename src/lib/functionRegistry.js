import { useCustomFunctionStore } from "@/stores/customFunctionStore";
import { functionRegistry } from "./baseFunctionRegistry";

/**
 * 
 * @param {String} name - The name of the function
 * @returns {Number | null} The arity of the function or null if it isn't found
 */
export function getFunctionArity(name) {
  let def = functionRegistry.getFunctionEntry(name)
  if (def) {
    return def.func.length;
  } else {
    def = useCustomFunctionStore().getDefinition(name)
    if (def) return def.definition.output.length
  }
  console.warn(`function ${name} not found`)
  return null

}