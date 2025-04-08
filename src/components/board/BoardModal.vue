<template>
  <BaseModal v-bind="$attrs" class="board-model" @close="cancel">
    <template #default>
      <slot v-bind="{ value: selectedElement || {} }"></slot>
    </template>

    <template #footer>
      <div class="footer">
        <div>
          <BaseInput v-model.number="model" placeholder="Введите количество" type="number" />
        </div>
        <div class="btn-group">
          <BaseButton class="btn-group__item" btnText='Отмена' @click="cancel" />
          <BaseButton class="btn-group__item" btnText='Подтвердить' status="success" @click="submit" />
        </div>
      </div>
    </template>
  </BaseModal>

</template>

<script lang="ts" setup generic="T extends BaseEntityType">
import { BaseModal, BaseButton, BaseInput } from '@/components/base';
import { ref, type PropType } from 'vue';
import type { BaseEntityType } from './types';

defineProps({
  selectedElement: {
    type: Object as PropType<T | null>,

  }
})

const model = ref('');

const emits = defineEmits(['submit', 'cancel']);

const cancel = () => {
  model.value = '';
  emits('cancel')
}

const submit = () => {
  if (Number.isFinite(model.value)) {
    emits('submit', model.value)
  }

  model.value = '';
}

</script>

<style lang="scss" scoped>
.board-model {
  border: var(--base-border);
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 20px;

  .btn-group {
    display: flex;
    margin-top: 20px;

    &__item:not(:last-child) {
      margin-right: 10px;
    }


  }
}
</style>
