<template>
  <div class="inventory-modal-content">
    <div class="inventory-modal-content__header">
      <img :src="inventory.image" :alt="inventory.name" />
    </div>

    <div></div>
  </div>
</template>

<script lang="ts" setup>
import type { EntityType } from '@/views/InventoryPage/types';
import type { PropType } from 'vue';

defineProps({
  inventory: {
    type: Object as PropType<EntityType>,
    default: () => ({})
  }
})
</script>

<style lang="scss">
.inventory-modal-content {
  width: 100%;

  &__header {
    width: 100%;

    & img {
      display: block;
      margin: 0 auto;
      width: 130px;
      height: 130px;
      object-fit: cover;
    }

    padding-bottom: 30px;
    border-bottom: var(--base-border);
  }
}
</style>
