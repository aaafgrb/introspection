<template>
  <div :class="['sidebar', { 'is-retracted': isRetracted }]">
    <div class="sidebar-handle" @click="toggleSidebar">
      <span v-if="isRetracted">+</span>
      <span v-else>&gt;</span>
    </div>
    <div class="sidebar-content" v-if="!isRetracted">
      <div class="config-item">
        <span>Page Name:</span>
        <input ref="pageNameInput" type="text" :value="pageData.pageName">
        <button @click="saveName">Save</button>
      </div>

      <div class="config-item function-config">
        <span>Function Name:</span>
        <input ref="functionNameInput" type="text" :value="pageData.functionName">
        <button @click="loadFunction">Load</button>
        <button @click="saveFunction">Save</button>
      </div>

      <div class="config-item function-config">
        <h2>Docs:</h2>
        <span>input type</span>
        <input ref="docsInputInput" type="text" :value="pageData.docs.input_type">
        <span>output type</span>
        <input ref="docsOutputInput" type="text" :value="pageData.docs.output_type">
        <span>description</span>
        <textarea ref="docsDescriptionInput">{{ pageData.docs.description }}
        </textarea>
        <span>example</span>
        <input ref="docsExampleInput" type="text" :value="pageData.docs.example">
        <button @click="saveDocs">Save</button>
      </div>

      <div class="config-item function-config">
        <button @click="setPosition">Set default position</button>
      </div>

      <div class="config-item function-config">
        <button @click="addNode">Add node</button>
      </div>
      <FunctionSelector class="function-selector" ref="function-selector" />
    </div>
  </div>
</template>


<script setup>
import { useCustomFunctionPagesStore } from '@/stores/useCustomFunctionPagesStore';
import { ref, inject, useTemplateRef } from 'vue';
import FunctionSelector from './FunctionSelector.vue';
const props = defineProps({
  pageData: {
    type: Object,
    required: true
  }
})


const customFunctionPageStore = useCustomFunctionPagesStore()


const functionNameInput = useTemplateRef("functionNameInput")

const isRetracted = ref(true)
const toggleSidebar = () => {
  isRetracted.value = !isRetracted.value;
}

const docsInputInput = useTemplateRef("docsInputInput")
const docsOutputInput = useTemplateRef("docsOutputInput")
const docsDescriptionInput = useTemplateRef("docsDescriptionInput")
const docsExampleInput = useTemplateRef("docsExampleInput")
const saveDocs = () => {
  customFunctionPageStore.setPageDocs(props.pageData.id,
    {
      input: docsInputInput.value.value,
      output: docsOutputInput.value.value,
      description: docsDescriptionInput.value.value,
      example: docsExampleInput.value.value,
    })
}

const saveFunction = () => {

}

const loadFunction = () => {
  if (confirm('Are you sure you want to load another function in this page?\nUnsaved changes will be lost.')) {
    customFunctionPageStore.setPageFunction(props.pageData.id, functionNameInput.value.value)
  }
}

const pageNameInput = useTemplateRef("pageNameInput")
const saveName = () => {
  customFunctionPageStore.setPageName(props.pageData.id, pageNameInput.value.value)
}

const setPosition = () => {
  customFunctionPageStore.setFunctionPageDefaultPosition(
    props.pageData.id,
    props.pageData.component.position.x,
    props.pageData.component.position.y)
}

const functionSelector = useTemplateRef("function-selector")
const toggleFunctionSelector = (...args) => functionSelector.value.toggleSelector(...args);

const addNode = () => {
  toggleFunctionSelector((fn) => {
    customFunctionPageStore.addNodeFromName(props.pageData.id, fn)
  })
}


</script>

<style scoped>
.sidebar {
  width: 250px;
  position: absolute;
  top: 0;
  left: -265px;
  bottom: 0;
  background: var(--primary-background-color);
  color: var(--secondary-text-color);
  transition: all 0.3s ease;
  border: 3px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  cursor: default;
}

.sidebar-content {
  overflow-y: scroll;
}

.is-retracted {
  left: 0px;
  width: 0px;
  border: 0px solid var(--primary-color);
  transition: all 0.3s ease;
}

.sidebar-handle span {
  color: var(--primary-text-color);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.sidebar-handle {
  width: 20px;
  height: 42px;
  left: -22px;
  top: -2px;
  background-color: var(--primary-color);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}


/* General styles for the container */
.config-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  padding: 0.5rem;
  background-color: var(--secondary-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

span {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--secondary-text-color);
}

input[type="text"] {
  padding: 0.4rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  transition: border 0.3s ease;
}

input[type="text"]:focus {
  border-color: var(--primary-color);
  outline: none;
}

textarea {
  padding: 0.4rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  transition: border 0.3s ease;
  resize: vertical;
}

textarea:focus {
  border-color: var(--primary-color);
  outline: none;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  background-color: var(--secondary-button-color);
  color: var(--secondary-text-color);
  cursor: pointer;
  border-radius: 5px;
  margin-top: 5px;
  width: 100%;
}

button:hover {
  background-color: var(--secondary-button-hover-color);
}

.function-selector {
  position: absolute;
  width: 100%;
  height: 98%;
  top: 0;
  left: 110%
}
</style>
