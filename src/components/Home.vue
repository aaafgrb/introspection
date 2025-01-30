<template>
  <div style="height: 100vh;">
    <DraggableBackground>
      <CustomFunctionPage :custom-function-name="`test`" :id="0" />
    </DraggableBackground>
  </div>
  <!-- <GlobalSidebar :baseFunctions="baseFunctions" :customFunctions="customFunctions" :unsavedFunctions="unsavedFunctions"
    :sessionFunctions="sessionFunctions" /> -->
</template>

<script>
import CustomFunctionPage from "./CustomFunctionPage.vue";
import DraggableBackground from "./DraggableBackground.vue";
import FunctionNode from "./FunctionNode.vue";

export default {
  components: {
    CustomFunctionPage,
    FunctionNode,
    DraggableBackground,
  },
};
</script>

<style>
body {
  overflow: hidden;
}
</style>