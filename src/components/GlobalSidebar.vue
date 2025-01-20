<template>
  <div class="global-sidebar">
    <section>
      <h3>Function List</h3>
      <div>
        <select v-model="groupingOption" @change="groupFunctions">
          <option value="type">Group by Type</option>
          <option value="namespace">Group by Namespace</option>
        </select>
        <ul>
          <li v-for="group in groupedFunctions" :key="group.name">
            <strong>{{ group.name }}</strong>
            <ul>
              <li v-for="func in group.functions" :key="func.name">
                {{ func.name }}
                <button @click="openFunction(func)">Open</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
    <section>
      <h3>Unsaved Custom Functions</h3>
      <ul>
        <li v-for="func in unsavedFunctions" :key="func.name">
          {{ func.name }}
          <button @click="openFunction(func)">Open</button>
        </li>
      </ul>
    </section>
    <section>
      <h3>Custom Functions Created This Session</h3>
      <ul>
        <li v-for="func in sessionFunctions" :key="func.name">
          {{ func.name }}
          <button @click="openFunction(func)">Open</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { computed, ref } from "vue";

export default {
  props: {
    baseFunctions: Array, // List of base functions
    customFunctions: Array, // List of custom functions
    unsavedFunctions: Array, // List of unsaved custom functions
    sessionFunctions: Array, // List of custom functions created in the session
  },
  setup(props) {
    const groupingOption = ref("type");

    const groupedFunctions = computed(() => {
      if (groupingOption.value === "type") {
        return [
          { name: "Base Functions", functions: props.baseFunctions },
          { name: "Custom Functions", functions: props.customFunctions },
        ];
      } else if (groupingOption.value === "namespace") {
        // Example of grouping by namespace
        return props.customFunctions.reduce((groups, func) => {
          const namespace = func.namespace || "Default";
          let group = groups.find((g) => g.name === namespace);
          if (!group) {
            group = { name: namespace, functions: [] };
            groups.push(group);
          }
          group.functions.push(func);
          return groups;
        }, []);
      }
      return [];
    });

    const openFunction = (func) => {
      console.log("Opening function:", func.name); // Replace with actual open logic
    };

    return {
      groupingOption,
      groupedFunctions,
      openFunction,
    };
  },
};
</script>

<style scoped>
.global-sidebar {
  width: 300px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
}

.global-sidebar h3 {
  margin-top: 20px;
  font-size: 1.2em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.global-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.global-sidebar li {
  margin: 5px 0;
}

.global-sidebar button {
  margin-left: 10px;
}
</style>