export const EMPTY_FUNCTION = {
  "name": "empty",
  "docs": {
    "input_type": [],
    "output_type": [],
    "description": "Empty function. Does nothing",
    "example": ""
  },
  "definition": {
    "input": [],
    "middle": [],
    "output": []
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