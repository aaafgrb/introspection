import { reactive, ref } from "vue";

const state = reactive({
  openPages: [],
  defaultStartX: 50,
  defaultStartY: 50,
  positionOffset: 60,
});
let customFunctionPagesTemplate = null
let draggableBackgroundTemplate = null
let lastInteractedPageId = -1

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

      state.openPages.push({ id, name: `New Function ${id + 1}`, position: { x: startX, y: startY }, customFunctionName: "test", zIndex: 0 });
    },

    closeFunctionPage(index) {
      state.openPages.splice(index, 1);
    },

    focusFunctionPage(index) {
      let dimentions = customFunctionPagesTemplate.value[index].getDimentions()
      draggableBackgroundTemplate.value.setPosition(
        -(dimentions.x + dimentions.width / 2 - window.innerWidth / 2),
        -(dimentions.y + dimentions.height / 2 - window.innerHeight / 2));
    },

    resetFunctionPagePosition(index) {
      customFunctionPagesTemplate.value[index].resetPosition();
    },

    resetAllPagesPosition() {
      draggableBackgroundTemplate.value.setPosition(0, 0);
      customFunctionPagesTemplate.value.forEach(e => e.resetPosition());
    },

    pageInteractedWithCallback(id) {
      if (lastInteractedPageId == id) return;
      let f = state.openPages.find(e => e.id == lastInteractedPageId)
      if (f) { f.zIndex = 0 }
      f = state.openPages.find(e => e.id == id)
      f.zIndex = 1
      lastInteractedPageId = id
    },
  };
}
