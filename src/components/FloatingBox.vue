<template>
  <Teleport :to="teleportTo">
    <div v-if="visible" class="floating-box" :style="boxStyle">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  visible: { type: Boolean, default: false },
  teleportTo: { default: 'body' } // Default to body
})

const boxStyle = computed(() => ({
  position: 'absolute',
  top: `${props.y}px`,
  left: `${props.x}px`,
  zIndex: 1000,
  background: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
}))

</script>

<style scoped>
.floating-box {
  min-width: 150px;
}
</style>
