<!-- line creation adapted from: https://github.com/schaumb/domarrow.js/tree/master -->

<template>
  <div class="arrow-connection" ref="arrow-connection">
    <div class="line" ref="line"></div>
    <div v-if="headVisible" class="arrow-head arrow-fw" ref="arrow-fw"></div>
    <div v-if="tailVisible" class="arrow-head arrow-bw" ref="arrow-bw"></div>
  </div>
</template>

<script>
import { useTemplateRef } from 'vue';

export default {
  props: {
    fromTo: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'black',
    },
    width: {
      type: Number,
      default: 2,
    },
    tail: {
      type: Boolean,
      default: false,
    },
    head: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headVisible: false,
      tailVisible: false,
    };
  },
  computed: {
    // Determines if arrows should be visible
    tailClass() {
      return this.tail ? 'arrow-bw' : '';
    },
    headClass() {
      return this.head ? 'arrow-fw' : '';
    },
  },
  mounted() {
    this.fromTo.update = this.updateLine
    this.updateLine();
    //window.addEventListener('resize', this.updateLine); // Recalculate on window resize
  },
  beforeDestroy() {
    //window.removeEventListener('resize', this.updateLine); // Clean up event listener
  },
  setup(props) {
    const line = useTemplateRef("line")
    const connectionElement = useTemplateRef("arrow-connection")

    const updateLine = () => {
      var trafo = {
        color: connectionElement.value.getAttribute('color'),
        onlyVisible: connectionElement.value.hasAttribute('onlyVisible'),
        fromX: parseFloat(connectionElement.value.getAttribute('fromX')),
        fromY: parseFloat(connectionElement.value.getAttribute('fromY')),
        toX: parseFloat(connectionElement.value.getAttribute('toX')),
        toY: parseFloat(connectionElement.value.getAttribute('toY')),
        width: parseFloat(connectionElement.value.getAttribute('width'))
      }

      var color = trafo && trafo.color || 'black';
      var W = trafo && trafo.width || 2;

      const fromElement = props.fromTo.from.target
      const toElement = props.fromTo.to.target
      var fromBStartY = props.fromTo.from.nodeData.position.y + props.fromTo.from.portOffset.y
      var fromBStartX = props.fromTo.from.nodeData.position.x + props.fromTo.from.portOffset.x
      var toBStartY = props.fromTo.to.nodeData.position.y + props.fromTo.to.portOffset.y
      var toBStartX = props.fromTo.to.nodeData.position.x + props.fromTo.to.portOffset.x
      var fromBWidth = fromElement.offsetWidth
      var fromBHeight = fromElement.offsetHeight
      var toBWidth = toElement.offsetWidth
      var toBHeight = toElement.offsetHeight

      var fT = fromBStartY + fromBHeight * getNumberOrDef(trafo && trafo.fromY, getNumberOrDef(trafo, 0.5));
      var tT = toBStartY + toBHeight * getNumberOrDef(trafo && trafo.toY, getNumberOrDef(trafo, 0.5));
      var fL = fromBStartX + fromBWidth * getNumberOrDef(trafo && trafo.fromX, getNumberOrDef(trafo, 0.5));
      var tL = toBStartX + toBWidth * getNumberOrDef(trafo && trafo.toX, getNumberOrDef(trafo, 0.5));

      var CA = Math.abs(tT - fT);
      var CO = Math.abs(tL - fL);
      var H = Math.sqrt(CA * CA + CO * CO);
      var ANG = 180 / Math.PI * Math.acos(CO / H);

      if ((fT >= tT || fL >= tL) && (tT >= fT || tL >= fL)) {
        ANG *= -1;
      }

      if (trafo && trafo.onlyVisible) {
        var arrangeFrom = intersectionPoint(fL, fT, tL, tT, fromBStartX, fromBStartY, fromBStartX + fromBWidth, fromBStartY + fromBHeight);
        var arrangeTo = intersectionPoint(fL, fT, tL, tT, toBStartX, toBStartY, toBStartX + toBWidth, toBStartY + toBHeight);

        if (arrangeFrom) {
          fL = arrangeFrom.x;
          fT = arrangeFrom.y;
        }
        if (arrangeTo) {
          tL = arrangeTo.x;
          tT = arrangeTo.y;
        }
        CA = Math.abs(tT - fT);
        CO = Math.abs(tL - fL);
        H = Math.sqrt(CA * CA + CO * CO);
      }

      var top = (tT + fT) / 2 - W / 2;
      var left = (tL + fL) / 2 - H / 2;

      var arrows = [...line.value.getElementsByClassName('arrow')];

      var needSwap = (fL > tL || (fL == tL && fT < tT));
      var arrowFw = needSwap && isVisible(arrows[0]) && arrows[0] || !needSwap && isVisible(arrows[1]) && arrows[1];
      var arrowBw = !needSwap && isVisible(arrows[0]) && arrows[0] || needSwap && isVisible(arrows[1]) && arrows[1];
      if (arrowFw) {
        arrowFw.classList.remove('arrow-bw');
        arrowFw.classList.add('arrow-fw');
        arrowFw.style.borderRightColor = color;
        arrowFw.style.top = W / 2 - 6 + "px";
      }
      if (arrowBw) {
        arrowBw.classList.remove('arrow-fw');
        arrowBw.classList.add('arrow-bw');
        arrowBw.style.borderLeftColor = color;
        arrowBw.style.top = W / 2 - 6 + "px";
      }
      line.value.style.display = "none";
      line.value.style["-webkit-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-moz-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-ms-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-o-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style["-transform"] = 'rotate(' + ANG + 'deg)';
      line.value.style.top = top + 'px';
      line.value.style.left = left + 'px';
      line.value.style.width = H + 'px';
      line.value.style.height = W + 'px';
      line.value.style.background = "linear-gradient(to right, " +
        (arrowFw ? "transparent" : color) + " 11px, " +
        color + " 11px " + (H - 11) + "px, " +
        (arrowBw ? "transparent" : color) + " " + (H - 11) + "px 100%)";
      line.value.style.display = "initial";
    }

    const getNumberOrDef = (val, def) => {
      return typeof val === 'number' && !isNaN(val) ? val : def;
    }

    const isVisible = (element) => {
      return element && element.style.visibility !== 'hidden';
    }

    const inside = (minX, minY, maxX, maxY, x1, y1) => {
      return minX <= x1 && x1 <= maxX && minY <= y1 && y1 <= maxY;
    }

    const intersectionPoint = (x1, y1, x2, y2, minX, minY, maxX, maxY) => {
      var min = Math.min, max = Math.max;
      var good = inside.bind(null, min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2));

      if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY) || (inside(minX, minY, maxX, maxY, x1, y1) && inside(minX, minY, maxX, maxY, x2, y2)))
        return null;

      var m = (y2 - y1) / (x2 - x1);
      var y = m * (minX - x1) + y1;
      if (minY < y && y < maxY && good(minX, y)) return { x: minX, y: y };

      y = m * (maxX - x1) + y1;
      if (minY < y && y < maxY && good(maxX, y)) return { x: maxX, y: y };

      var x = (minY - y1) / m + x1;
      if (minX < x && x < maxX && good(x, minY)) return { x: x, y: minY };

      x = (maxY - y1) / m + x1;
      if (minX < x && x < maxX && good(x, maxY)) return { x: x, y: maxY };

      return null;
    }

    return {
      updateLine
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
}

.line .arrow-fw {
  border-right: 12px solid black;
}

.line .arrow-bw {
  left: 100%;
  border-left: 12px solid black;
  transform: translateX(-12px);
}

.line .text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -100%);
}

.line {
  position: absolute;
  height: 2px;
  z-index: -1;
  background-color: black;
}
</style>
