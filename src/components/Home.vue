<template>
  <div style="height: 100vh;">
    <DraggableBackground ref="draggable-background">
      <CustomFunctionPage v-for="page in sidebarStore.openPages" :key="page.id"
        :custom-function-name="page.customFunctionName" :id="page.id" :startPosition="page.position" :name="page.name"
        ref="custom-function-pages" />
    </DraggableBackground>
  </div>
  <GlobalSidebar />
  <ContextMenu ref="context-menu" />
</template>

<script>
import { useGlobalSidebarStore } from "@/stores/useGlobalSidebarStore";
import CustomFunctionPage from "@/components/CustomFunctionPage.vue";
import GlobalSidebar from "@/components/GlobalSidebar.vue";
import DraggableBackground from "@/components/DraggableBackground.vue";
import ContextMenu from "./ContextMenu.vue";
import { provide, useTemplateRef } from "vue";

export default {
  components: {
    CustomFunctionPage,
    GlobalSidebar,
    DraggableBackground,
    ContextMenu
  },
  mounted() {

  },
  setup() {
    const sidebarStore = useGlobalSidebarStore();
    const contextMenu = useTemplateRef("context-menu")

    const openContextMenu = (...args) => contextMenu.value.openMenu(...args);
    provide("openContextMenu", openContextMenu)

    const draggableBackgroundTemplate = useTemplateRef("draggable-background")
    sidebarStore.setDraggableBackgroundTemplate(draggableBackgroundTemplate)
    const customFunctionPagesTemplate = useTemplateRef("custom-function-pages")
    sidebarStore.setCustomFunctionPagesTemplate(customFunctionPagesTemplate)

    return { sidebarStore, openContextMenu };
  },
};
</script>
