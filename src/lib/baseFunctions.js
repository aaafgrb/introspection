import { functionRegistry } from "./functionRegistry.js"

/**
 * Reads the base function docs json file and returns its content as an object
 * @returns {Object} The object of the base functions docs
 */
async function loadDocumentation() {
  const response = await fetch("/src/lib/baseFunctionsDoc.json");
  if (!response.ok)
    throw new Error(`Failed to load documentation: ${response.statusText}`);

  return await response.json();
}

/**
 * Extracts all the function of a library and adds them to the function registry as base functions
 * @param {Object} library - The library itself
 * @param {String} namespace - The name of the library namespace
 * @param {Boolean} isPrototype - If the function needs to be called with the function call instead of direclty. Defaults to false
 */
function reflectFunctions(library, namespace, isPrototype = false) {
  for (const key of Object.getOwnPropertyNames(library)) {
    const property = library[key];
    if (typeof property === "function") {
      const fullName = `${namespace}.${key}`;
      //TODO: handle prototype calling
      let func = ({ instance, args }) => property.call(instance, ...args)

      functionRegistry.addToRegistry(fullName, property, baseFunctionsDoc[fullName], true)
    }
  }
}

// setup
const baseFunctionsDoc = await loadDocumentation();

// Populate standard libraries
reflectFunctions(Math, "Math");
reflectFunctions(Date, "Date");
reflectFunctions(Date.prototype, "Date", true);
reflectFunctions(RegExp.prototype, "RegExp", true);
reflectFunctions(String.prototype, "String", true);
reflectFunctions(Array, "Array");
reflectFunctions(Array.prototype, "Array", true);

// add base custom functions
functionRegistry.addToRegistry("Math.sum", {
  func: (val1, val2) => val1 + val2,
  ...{
    "description": "Returns the sum of two values",
    "example": "Math.sum(3, 4) -> 7",
    "input_type": [
      "number"
    ],
    "output_type": [
      "number"
    ]
  }
}
)


console.log(functionRegistry)