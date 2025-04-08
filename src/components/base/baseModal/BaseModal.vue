<template>
  <Transition :name="transitionName">
    <div v-if="isOpen" class="base-modal">
      <button class="close-btn" @click="$emit('close')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#333" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <div class="base-modal__content">
        <slot></slot>
      </div>
      <div class="base-modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </Transition>

</template>

<script lang="ts" setup>
defineProps({
  isOpen: {
    default: false,
    type: Boolean,
  },
  transitionName: {
    default: 'slide',
    type: String
  }
});


defineEmits(['close'])
</script>

<style lang="scss">
.base-modal {
  display: flex;
  flex-direction: column;
  background-color: var(--base-bg);
  width: 250px;

  height: 100%;
  position: absolute;
  top: 0;
  right: 0;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    border-bottom: var(--base-border);
    margin-bottom: 20px;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;



    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .close-btn svg {
    display: block;
    transition: stroke 0.3s;
  }

  .close-btn svg path {
    stroke: #fff;
  }

  .close-btn:hover svg path {
    stroke: #8a8a8a;
  }

}

.slide-enter-active,
.slide-leave-active {
  transition: transform 1s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
