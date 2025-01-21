class FunctionRegistry {
  constructor() {
    if (!FunctionRegistry.instance) {
      this.registry = new Map();
      FunctionRegistry.instance = this;
    }
    return FunctionRegistry.instance;
  }

  /**
   * Adds a function to the function registry
   * @param {String} name - The name of the function to be added
   * @param {Function} func - The function that will be called
   * @param {Object} docs - The object containing the documentation of the function
   */
  addToRegistry(name, func, docs) {
    if (!func) {
      throw new Error(`Function "${name}" does not have a "func" property`)
    }
    if (this.registry.get(name)) {
      console.warn(`Function "${name}" already exists in the registry. Overwriting.`);
    }
    this.registry.set(name, {
      func: ({ context, args }) => func.call(context, ...args),
      ...docs,
    });
  }

  /**
   * 
   * @param {String} name - The name of the function to be removed
   */
  removeFromRegistry(name) {
    this.registry.delete(name)
  }

  /**
   * Calls a function of the registry
   * @param {String} name - Name of the function to be called
   * @param {Array} args - Array containing the arguments to be applied to the function
   * @param {Function} context - The instance of the object. Defaults to null
   * @returns {any} The result of the function
   */
  callRegistryFunction(name, args, context = null) {
    const funcEntry = this.registry.get(name);
    if (!funcEntry) {
      throw new Error(`Function "${name}" not found in the registry`);
    }
    return funcEntry.func({ context, args });
  }

  /**
   * 
   * @param {String} name - The name of the function
   * @returns {Object | null} The function entry
   */
  getFunctionEntry(name) {
    return this.registry.get(name) || null
  }
}

// Singleton instance
const functionRegistry = new FunctionRegistry();
Object.freeze(functionRegistry);

export { functionRegistry, FunctionRegistry }; // Export both the instance and the class