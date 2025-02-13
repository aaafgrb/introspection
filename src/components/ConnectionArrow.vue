<!-- line creation adapted from: https://github.com/schaumb/domarrow.js/tree/master -->

<template>
  <div class="arrow-connection">
    <div class="line"
      :style="{ transform: `rotate(${r.ang}deg)`, left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` }">
      <!-- <div class="text">default</div> -->
      <div class="arrow" :class="r.needSwap ? 'arrow-fw' : 'arrow-bw'"></div>
    </div>
  </div>
</template>

<script setup>
import { useCustomFunctionPagesStore } from '@/stores/useCustomFunctionPagesStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps({
  pageId: {
    required: true
  },
  connectionData: {
    type: Object,
    required: true
  }
})

const customFunctionPagesStore = useCustomFunctionPagesStore()

const { getNode, getPort } = storeToRefs(customFunctionPagesStore)

const inNode = computed(() => getNode.value(props.pageId, props.connectionData.inNodeId))
const outNode = computed(() => getNode.value(props.pageId, props.connectionData.outNodeId))

const inPort = computed(() => getPort.value(props.pageId, props.connectionData.inNodeId, true, props.connectionData.inPortId))
const outPort = computed(() => getPort.value(props.pageId, props.connectionData.outNodeId, false, props.connectionData.outPortId))

//const { ang, left, top, width, needSwap } = computed(() => {
const r = computed(() => {
  var W = 2;

  var fT = outNode.value.component.position.y + outPort.value.component.offset.y
  var fL = outNode.value.component.position.x + outPort.value.component.offset.x
  var tT = inNode.value.component.position.y + inPort.value.component.offset.y
  var tL = inNode.value.component.position.x + inPort.value.component.offset.x

  var CA = Math.abs(tT - fT);
  var CO = Math.abs(tL - fL);
  var H = Math.sqrt(CA * CA + CO * CO);
  var ANG = 180 / Math.PI * Math.acos(CO / H);

  if ((fT >= tT || fL >= tL) && (tT >= fT || tL >= fL)) {
    ANG *= -1;
  }

  var top = (tT + fT) / 2 - W / 2;
  var left = (tL + fL) / 2 - H / 2;

  var needSwap = (fL > tL || (fL == tL && fT < tT));

  return { ang: ANG, left, top, width: H, needSwap }
})

</script>

<style scoped>
.line .arrow {
  top: -5px;
  height: 0px;
  width: 0px;
  position: absolute;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  background-clip: border-box;
  pointer-events: none;
}

.line .arrow-bw {
  left: 100%;
  border-left: 12px solid black;
  transform: translateX(-12px);
}

.line .arrow-fw {
  border-right: 12px solid black;
}

.line .text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -100%);
  pointer-events: none;
}

.line {
  position: absolute;
  height: 2px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  pointer-events: none;
}
</style>
