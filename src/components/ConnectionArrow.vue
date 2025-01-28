<!-- line creation adapted from: https://github.com/schaumb/domarrow.js/tree/master -->

<template>
  <div class="arrow-connection">
    <div class="line" ref="line">
      <!-- <div class="text">default</div> -->
      <div class="arrow" :class="needSwap ? 'arrow-fw' : 'arrow-bw'"></div>
    </div>
  </div>
</template>

<script>
import { ref, useTemplateRef } from 'vue';

export default {
  props: {
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    }
  },
  mounted() {
    this.updateLine();
  },
  updated() {
    this.updateLine();
  },
  expose: ['updateLine'],
  setup(props) {
    const line = useTemplateRef("line")
    const needSwap = ref(false);

    const updateLine = () => {
      var W = 2;

      var fromBStartY = props.from.nodePosition.y + props.from.portOffset.y
      var fromBStartX = props.from.nodePosition.x + props.from.portOffset.x
      var toBStartY = props.to.nodePosition.y + props.to.portOffset.y
      var toBStartX = props.to.nodePosition.x + props.to.portOffset.x
      var fromBWidth = props.from.width
      var fromBHeight = props.from.height
      var toBWidth = props.to.width
      var toBHeight = props.to.height

      var fT = fromBStartY + fromBHeight * 0.5
      var tT = toBStartY + toBHeight * 0.5
      var fL = fromBStartX + fromBWidth * 0.5
      var tL = toBStartX + toBWidth * 0.5

      var CA = Math.abs(tT - fT);
      var CO = Math.abs(tL - fL);
      var H = Math.sqrt(CA * CA + CO * CO);
      var ANG = 180 / Math.PI * Math.acos(CO / H);

      if ((fT >= tT || fL >= tL) && (tT >= fT || tL >= fL)) {
        ANG *= -1;
      }

      var top = (tT + fT) / 2 - W / 2;
      var left = (tL + fL) / 2 - H / 2;

      needSwap.value = (fL > tL || (fL == tL && fT < tT));

      line.value.style["-webkit-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-moz-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-ms-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-o-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style.top = top + 'px';
      line.value.style.left = left + 'px';
      line.value.style.width = H + 'px';
    }

    return {
      updateLine,
      needSwap,
    }
  }
};
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
