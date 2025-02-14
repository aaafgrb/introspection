<template>
  <div style="height: 100vh;">
    <DraggableBackground ref="draggable-background">
      <CustomFunctionPage v-for="[key, page] in pages" :key="key" :pageData="page" />
    </DraggableBackground>
  </div>
  <GlobalSidebar />
  <ContextMenu ref="context-menu" />
</template>

<script setup>
import { useGlobalSidebarStore } from "@/stores/useGlobalSidebarStore";
import CustomFunctionPage from "@/components/CustomFunctionPage.vue";
import GlobalSidebar from "@/components/GlobalSidebar.vue";
import DraggableBackground from "@/components/DraggableBackground.vue";
import ContextMenu from "./ContextMenu.vue";
import { provide, useTemplateRef, onMounted } from "vue";
import { useFunctionRegistryStore } from "@/stores/useFunctionRegistryStore";
import { useCustomFunctionPagesStore } from "@/stores/useCustomFunctionPagesStore";
import { storeToRefs } from "pinia";

const sidebarStore = useGlobalSidebarStore();
const functionRegistryStore = useFunctionRegistryStore();
const customFunctionPagesStore = useCustomFunctionPagesStore();

functionRegistryStore.init()

const { pages } = storeToRefs(customFunctionPagesStore)

console.log(pages.value)

const contextMenu = useTemplateRef("context-menu")
const openContextMenu = (...args) => contextMenu.value.openMenu(...args);
provide("openContextMenu", openContextMenu)

const draggableBackgroundTemplate = useTemplateRef("draggable-background")
onMounted(() => {
  customFunctionPagesStore.setDraggableBackgroundTemplate(draggableBackgroundTemplate)
})

</script>
