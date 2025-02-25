<template>
  <div style="height: 100vh;">
    <DraggableBackground ref="draggable-background">
      <CustomFunctionPage v-for="[key, page] in pages" :key="key" :pageData="page" />
    </DraggableBackground>
  </div>
  <GlobalSidebar />
  <ListSelector ref="list-selector" />
  <OptionSelector ref="option-selector" />
  <InputBox ref="input-box" />
</template>

<script setup>
import CustomFunctionPage from "@/components/CustomFunctionPage.vue";
import GlobalSidebar from "@/components/GlobalSidebar.vue";
import DraggableBackground from "@/components/DraggableBackground.vue";
import { provide, useTemplateRef, onMounted } from "vue";
import { useFunctionRegistryStore } from "@/stores/useFunctionRegistryStore";
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";
import { storeToRefs } from "pinia";
import OptionSelector from "./OptionSelector.vue";
import ListSelector from "./ListSelector.vue";
import InputBox from "./InputBox.vue";

const functionRegistryStore = useFunctionRegistryStore();
const customFunctionPagesStore = useCustomFunctionPagesStore();

functionRegistryStore.init()

const { pages } = storeToRefs(customFunctionPagesStore)

console.log(pages.value)

const listSelector = useTemplateRef("list-selector")
const openListSelector = (...args) => listSelector.value.openListSelector(...args);
provide("openListSelector", openListSelector)

const optionSelector = useTemplateRef("option-selector")
const openOptionSelector = (...args) => optionSelector.value.openOptionSelector(...args);
provide("openOptionSelector", openOptionSelector)

const inputBox = useTemplateRef("input-box")
const openInputBox = (...args) => inputBox.value.openInputBox(...args);
provide("openInputBox", openInputBox)



const draggableBackgroundTemplate = useTemplateRef("draggable-background")
onMounted(() => {
  customFunctionPagesStore.setDraggableBackgroundTemplate(draggableBackgroundTemplate)
})

</script>
