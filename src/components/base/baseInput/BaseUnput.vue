<template>
  <input class="base-input" type="text" :placeholder="placeholder" :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Введите значение'
  }
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.base-input {
  border: var(--base-border);
  border-radius: 4px;
  background-color: transparent;
  min-height: 40px;
  min-width: 40px;
  width: 100%;
  padding: 12px;


  &,
  &::placeholder {
    color: #8a8a8a;
  }

  /* Убирает стрелки в Chrome, Safari, Edge, Opera */
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Убирает стрелки в Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
