/**
 * Reads the base function docs json file and returns its content as an object
 * @returns {Object} The object of the base functions docs
 */
export async function loadDocumentation() {
  const response = await fetch("/src/lib/baseFunctionsDoc.json");
  if (!response.ok)
    throw new Error(`Failed to load documentation: ${response.statusText}`);

  return await response.json();
}

/**
 * Extracts all the function of a library and adds them to the function registry as base functions
 * @param {Object} library - The library itself
 * @param {String} namespace - The name of the library namespace
 * @param {Boolean} docs - Object containing a list of functions' documentation
 * @returns {Array} The array containing the reflected functions
 */
export function reflectFunctions(library, namespace, docs) {
  const result = [];
  for (const key of Object.getOwnPropertyNames(library)) {
    const property = library[key];
    if (typeof property === "function") {
      const fullName = `${namespace}.${key}`;
      //TODO: handle prototype calling
      let func = ({ instance, args }) => property.call(instance, ...args)

      result.push({ name: fullName, func: property, doc: docs[fullName] })
    }
  }
  return result
}