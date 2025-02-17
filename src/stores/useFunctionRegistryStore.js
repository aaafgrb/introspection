import { defineStore } from 'pinia'
import { loadDocumentation, reflectFunctions } from "@/lib/baseFunctions"

export const useFunctionRegistryStore = defineStore('function-registry', {
  state: () => (
    {
      baseFunctions: new Map(),
      customFunctions: new Map([[
        "test",
        {
          "name": "test",
          "docs": {
            "input_type": ["number"],
            "output_type": ["number"],
            "description": "test function. sums 2 to a value",
            "example": "test(1) -> 3"
          },
          "definition": [
            {
              "name": "in",
              "operation": "input",
              "params": [{ "val": 2 }]
            },
            {
              "name": "output",
              "operation": "Math.sum",
              "params": [{ "ref": "in", "var": "output" }, { "val": 2 }],
            },
          ]
        }
      ]]),
    }
  ),
  getters: {
    getBaseFunction: (state) => (name) => state.baseFunctions.get(name),
    getCustomFunction: (state) => (name) => state.customFunctions.get(name),
    getArity: (state) => function (name) {
      let def = this.getBaseFunction(name)
      if (def) {
        return def.func.length;
      } else {
        def = this.getCustomFunction(name)
        if (def) return def.definition.output.length
      }
      console.warn(`Function ${name} not found. Was unable to get arity. Returning 0.`)
      return 0;
    },
  },
  actions: {
    async init() {
      const baseFunctionsDoc = await loadDocumentation();

      reflectFunctions(Math, "Math", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(Date, "Date", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(Date.prototype, "Date", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(RegExp.prototype, "RegExp", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(String.prototype, "String", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(Array, "Array", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));
      reflectFunctions(Array.prototype, "Array", baseFunctionsDoc).map(x => this.addBaseFunction(x.name, x.func, x.doc));

      this.addBaseFunction("Math.sum",
        (val1, val2) => val1 + val2,
        {
          "description": "Returns the sum of two values",
          "example": "Math.sum(3, 4) -> 7",
          "input_type": [
            "number"
          ],
          "output_type": [
            "number"
          ]
        }
      )
    },
    addBaseFunction(name, func, doc = {}) {
      const entry = {
        name, func, doc
      }
      if (this.baseFunctions.get(name)) {
        console.warn(`Base function ${name} already exists. Overwriting.`)
      }
      this.baseFunctions.set(name, entry)
    },
    addCustomFunction(name, definition) {
      const entry = {
        name, definition
      }
      if (this.customFunctions.get(name)) {
        console.warn(`Custom function ${name} already exists. Overwriting.`)
      }
      this.customFunctions.set(name, entry)
    },
  }
})
