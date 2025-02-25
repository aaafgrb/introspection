<template>
  <FloatingBox :x="x" :y="y" :visible="visible" :teleportTo="teleport">
    <button class="close-button" @click="close">&times;</button>
    <div class="input-box">
      <label>{{ title }}</label>
      <input v-model="inputValue" type="text" class="text-input" @keyup.enter="submit" />
    </div>
  </FloatingBox>
</template>

<script setup>
import { ref, watch } from 'vue'
import FloatingBox from './FloatingBox.vue'

const x = ref(0)
const y = ref(0)
const visible = ref(false)
const title = ref("Enter text")
const inputValue = ref("")
const teleport = ref("body")
let callbackFunc = null

const submit = () => {
  callbackFunc(inputValue.value)
  visible.value = false
}

const close = () => {
  visible.value = false
}

const openInputBox = (callback, details) => {
  x.value = details.x ? details.x : 0
  y.value = details.y ? details.y : 0
  title.value = details.title ? details.title : "Enter text"
  inputValue.value = details.inputValue ? details.inputValue : ""
  teleport.value = details.teleport ? details.teleport : "body"

  callbackFunc = callback
  visible.value = true
}

defineExpose({ openInputBox })
</script>

<style scoped>
.input-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.close-button {
  float: right;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

label {
  font-size: 14px;
  font-weight: bold;
}

.text-input {
  width: 200px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
