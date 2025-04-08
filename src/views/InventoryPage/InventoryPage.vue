<template>
  <div class="inventory-page">
    <main class="inventory-page__content">
      <div class="inventory-page__content-column">
        <UserInfo class="inventory-page__content-user" :avatar="{ src: avatar, alt: 'avatar' }" />
      </div>
      <div class="inventory-page__content-column">
        <Board :list="inventory" :getPreview="getPreview" @update-board="updateBoard">
          <template #modalContent="{ value }">
            <InventoryModalContent :inventory="value as EntityType" />
          </template>
          <template #default="{ item }">
            <div>
              <img :src="item.image" :alt="item.name" class="item-image">
            </div>
          </template>
        </Board>
      </div>
    </main>
    <footer class="inventory-page__footer">
      <div class="inventory-page-footer-content"></div>
    </footer>
  </div>
</template>


<script lang="ts" setup>

const testData: Array<BoardItemType<EntityType>> = [{
  position: 1,
  entity: { id: 1, name: 'test', image: './images/image1.png', count: 2 },
},
{
  position: 2,
  entity: { id: 2, name: 'test2', image: './images/image2.png', count: 2 },
},
{
  position: 3,
  entity: { id: 3, name: 'test3', image: './images/image3.png', count: 3 },
},
]

import UserInfo from '@/components/userInfo/UserInfo.vue';
import Board from '@/components/board/Board.vue';
import avatar from '@/assets//imgs/image.png';
import { ref, toRaw } from 'vue';
import type { BoardItemType } from '@/components/board/types';
import type { EntityType } from './types';
import InventoryModalContent from '@/components/inventoryModalContent/InventoryModalContent.vue';
import { LocalStorageService } from '@/service';

const cache = LocalStorageService.getData('entity', testData);
const inventory = ref(cache)

const getPreview = (event: Event, item: EntityType) => {
  const target = event.currentTarget as HTMLElement
  const ghostClone = target.cloneNode(true) as HTMLElement;
  const img = ghostClone.querySelector('img');

  if (img) {
    img.src = item.image;
    ghostClone.classList.add('drag-ghost')
  }

  return ghostClone;
}

const updateBoard = (data: Array<BoardItemType<EntityType>>) => {
  inventory.value = data;
  LocalStorageService.setData(toRaw(inventory.value), 'entity');
}

</script>

<style lang="scss" scoped>
.inventory-page {
  display: flex;
  flex-direction: column;
  background: #1D1D1D;
  padding: 32px;
  width: 849px;
  margin: 0 auto;

  &__content {
    display: flex;
    flex-grow: 1;
    margin-bottom: 24px;

  }

  &__content-column {
    &:first-of-type {
      margin-right: 24px;
    }

    &:last-of-type {
      flex-grow: 1;
    }
  }

  &__content-user {
    height: 100%;
  }

  .inventory-page-footer-content {
    min-height: 72px;
    background-color: var(--base-bg);
    border-radius: 12px;
  }
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
</style>
