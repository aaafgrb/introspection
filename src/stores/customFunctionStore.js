import { defineStore } from "pinia";
import { registerCustomFunction } from "@/lib/customFunctions";

export const useCustomFunctionStore = defineStore("customFunction", {
  state: () => ({
    definitions: new Map(
      [[
        "test",
        {
          "name": "test",
          "docs": {
            "input_type": ["number"],
            "output_type": ["number"],
            "description": "test function. sums 2 to a value",
            "example": "test(1) -> 3"
          },
          "definition": {
            "input": ["in"],
            "middle": [
              {
                "name": "out",
                "operation": "Math.sum",
                "params": [{ "ref": "in", "out": 0 }, { "val": 2 }],
              },
            ],
            "output": [{ "ref": "out", "out": 0 }]
          }
        }
      ]]

    ),
  }),

  actions: {
    /**
     * Add or update a custom function definition.
     * @param {string} name - The function name.
     * @param {Object} definition - The custom function definition.
     */
    saveDefinition(name, definition) {
      this.definitions.set(name, definition);
      registerCustomFunction(definition);
    },

    /**
     * Remove a custom function definition.
     * @param {string} name - The function name to remove.
     */
    removeDefinition(name) {
      delete this.definitions.delete(name);
    },

    /**
     * Get a custom function definition.
     * @param {string} name - The function name to retrieve.
     * @returns {Object | null} The custom function definition or null.
     */
    getDefinition(name) {
      return this.definitions.get(name) || null;
    },
  },
});
