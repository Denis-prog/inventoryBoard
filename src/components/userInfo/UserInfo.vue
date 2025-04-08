<template>
  <section class="user">
    <div class="user__avatar">
      <img v-bind="avatarProps">
    </div>
    <div class="user__info">

    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { IUserInfo } from './types';

const props = defineProps<IUserInfo>()

const avatarProps = computed(() => props.avatar || {})
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
  background-color: var(--base-bg);

  &__avatar img {
    width: 208px;
    height: 240px;
    border-radius: 8px;
    object-fit: cover;
  }
}
</style>
