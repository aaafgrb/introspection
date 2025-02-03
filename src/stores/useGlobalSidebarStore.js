import { reactive, ref } from "vue";

const state = reactive({
  openPages: [],
  defaultStartX: 50,
  defaultStartY: 50,
  positionOffset: 60,
});
let customFunctionPagesTemplate = null
let draggableBackgroundTemplate = null

export function useGlobalSidebarStore() {
  return {
    openPages: state.openPages,
    setCustomFunctionPagesTemplate(template) {
      customFunctionPagesTemplate = template
    },
    setDraggableBackgroundTemplate(template) {
      draggableBackgroundTemplate = template
    },
    openFunctionPage() {
      const id = state.openPages.length
        ? Math.max(...state.openPages.map((p) => p.id)) + 1
        : 0;

      const startX = state.defaultStartX + id * state.positionOffset;
      const startY = state.defaultStartY + id * state.positionOffset;

      state.openPages.push({ id, name: `New Function ${id + 1}`, position: { x: startX, y: startY }, customFunctionName: "test" });
    },

    closeFunctionPage(index) {
      state.openPages.splice(index, 1);
    },

    focusFunctionPage(id) {
      console.log(`Focusing function page with id: ${id}`);
    },

    resetFunctionPagePosition(index) {
      customFunctionPagesTemplate.value[index].resetPosition();
    },

    resetAllPagesPosition() {
      draggableBackgroundTemplate.value.resetPosition();
      customFunctionPagesTemplate.value.forEach(e => e.resetPosition());
    },
  };
}
