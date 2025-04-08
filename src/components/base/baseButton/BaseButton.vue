<template>
  <button class="base-btn" :class="classButton" :disabled="disabled">
    <span class="base-btn-text">
      <slot></slot>
      <span v-if="btnText">{{ btnText }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, } from "vue";

const baseClass = 'base-btn';

const props = defineProps({
  status: {
    type: String,
    validator(value: string) {
      return ["primary", "success"].includes(value);
    },
    default: "primary",
  },
  disabled: {
    type: Boolean,
  },
  icon: String,
  btnText: [String, Number],
});


const classButton = computed(() => {
  return [
    {
      [`${baseClass}-disabled`]: props.disabled,
    },
    `${baseClass}_${props.status}`,
  ];
});
</script>

<style lang="scss">
.base-btn {

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  user-select: none;
  cursor: pointer;

  // динамичные стили
  min-width: 30px;
  height: 30px;
  border: 1px solid transparent;
  padding: 8px 20px;
  line-height: 17px;
  border-radius: 8px;
  background-color: #fff;
  font-size: 14px;
  color: #000;
  white-space: nowrap;


  &:focus,
  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }

  &_success {
    color: #FFFFFF;
    background-color: #FA7272;
  }

}
</style>
