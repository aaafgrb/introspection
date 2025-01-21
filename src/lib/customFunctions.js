import { functionRegistry } from "./baseFunctionRegistry.js"

/**
 * 
 * @param {String} name - The name of the function that will be removed
 */

export function removeCustomFunction(name) {
  functionRegistry.removeFromRegistry(name)
}

/**
 * Registers a new custom function to the function registry
 * @param {Object} functionDef - The object containing the function definition
 * @returns {Function | Null} Returns the generated function, or null if the parsing failed
 */
export function registerCustomFunction(functionDef) {
  // Check for name
  if (!functionDef.name) {
    console.warn("Skipping function: Missing required metadata fields.", functionDef);
    return null;
  }

  //get function
  const func = loadCustomFunctions(functionDef.definition)
  if (!func) {
    console.warn("Skipping function: Couldn't parse function definition", functionDef);
    return null;
  }

  // Register the function
  functionRegistry.addToRegistry(functionDef.name, { func: func, ...functionDef.docs })
  console.log(`Registered function: "${functionDef.name}"`);
  return func;
}

/**
 * Converts a custom function definition to a js function
 * @param {Object} definition - The definition of the execution of the custom function
 * @returns {Function | null} A function that executes the described function or null in case of a exception
 */
function loadCustomFunctions(definition) {
  // Check for definition.input and definition.output
  if (!definition || !definition.input || !definition.output) {
    return null;
  }

  const middle = new Map();
  (definition.middle ?? []).forEach(x => middle.set(x.name, x));

  return function (outputIndex, _instance, ...args) {

    let vars = new Map()
    definition.input.forEach((e, i) => {
      vars.set(e, args[i]);
    });

    return solveMiddleVariable(definition.output[outputIndex], middle, vars);
  }
}

/**
 * Calculated the value of a middle variable from its definition
 * @param {String} n - The name of the middle variable to be calculated
 * @param {Map} middle - The Map with the definitions of the middle variables
 * @param {Map} vars - The result of the already calculated middle variables
 * @returns {any} The result value of the calculated middle variable
 * @throws Will throw an error if the required fields for the variable are missing
 */
export function solveMiddleVariable(n, middle, vars) {
  // If the variable was already solved returns it
  if (vars.has(n)) return vars.get(n);

  // Get variable definition
  let v = middle.get(n);
  if (!v || !v.operation || !v.params) {
    throw new Error(`Cannot calculate middle variable "${n}": Missing required fields.`);
  }

  // Resolve parameters recursively
  let resolvedParams = v.params.map((param) =>
    vars.get(param) ?? solveMiddleVariable(param, middle, vars)
  );

  // Call the operation and store the result
  let res = functionRegistry.callRegistryFunction(v.operation, resolvedParams);
  vars.set(n, res);

  return res;
}