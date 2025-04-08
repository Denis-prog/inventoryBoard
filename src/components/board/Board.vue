<template>
  <section :style="{ '--column-count': columnCount }" ref="boardeRef" class="board-container"
    @dragover.prevent="handleDragOver" @dragenter.prevent="" @drop.prevent="handleDrop">
    <div @click="setSelectedElement(cell, index)" data-draggable-target v-for="(cell, index) in cells" :key="index"
      class="board-cell"
      :class="[{ 'cell-highlight': isDragging && currentHoverIndex === index }, ...getClassByCell(index)]">
      <div v-if="cell" class="board-cell__count">{{ cell.count }}</div>
      <div v-if="cell" class="board-item" draggable="true" @dragstart="handleDragStart(index, $event, cell)"
        @dragend="handleDragEnd">
        <slot :item="cell" :position="index + 1" />

      </div>
    </div>
    <BoardModal :isOpen="isShowSettings" :selectedElement="selectedEntity" @submit="updateBoard" @cancel="closeModal">
      <template #default="data">
        <slot name="modalContent" v-bind="data"></slot>
      </template>
    </BoardModal>
  </section>
</template>

<script setup lang="ts" generic="T extends BaseEntityType">
import { ref, onMounted, computed, type PropType } from 'vue';
import type { BoardItemType, IBoard, BaseEntityType } from './types';
import { useDragAndDrop } from '@/components/board/useDragDrop';
import BoardModal from './BoardModal.vue';

const props = defineProps({
  columnCount: {
    type: Number,
    default: 4
  },
  list: {
    type: Array as PropType<IBoard<T>['list']>,
    default: () => []
  },
  size: {
    type: Number,
    default: 16,
  },
  getPreview: {
    type: Function as PropType<IBoard<T>['getPreview']>,
    required: true,
  }
})

const boardeRef = ref(null);
const isShowSettings = ref(false);
const selectedEntity = ref<T | null>(null);
const selectedPosition = ref<number | null>(null);

const filterBoard = (list: (T | null)[]) => {
  return list.reduce((accum, item, idx) => {
    if (item) {
      accum.push({ position: idx + 1, entity: item })
    }
    return accum
  }, [] as Array<BoardItemType<T>>)
}

const closeModal = () => {
  isShowSettings.value = false
}

const emit = defineEmits<{
  (e: 'update-board', payload: Array<BoardItemType<T>>): void

}>()

const updateBoard = (count: number) => {
  if (!selectedEntity.value || !selectedPosition.value) return;

  const list = [...cells.value]
  const element = list[selectedPosition.value];

  if (element) {
    list[selectedPosition.value] = count ? { ...element, count } : null
  }

  emit('update-board', filterBoard(list))

  closeModal()

}

const setSelectedElement = (value: T | null, position: number) => {
  if (!value) return;

  isShowSettings.value = true
  selectedEntity.value = value;
  selectedPosition.value = position;
}

const getClassByCell = (cellIdx: number) => {
  cellIdx = cellIdx + 1;
  const classes = [];
  const base = 'board-cell_round';


  if (cellIdx === 1) {
    classes.push(`${base}-top-left`);
  }

  if (cellIdx === columnCount.value) {
    classes.push(`${base}-top-right`);
  }

  if (cellIdx === props.size && cellIdx % columnCount.value === 0) {
    classes.push(`${base}-bottom-right`);
  }


  if (columnCount.value === 1 && /* cellIdx % columnCount.value === 0 && */ cellIdx === props.size
    || cellIdx % columnCount.value === 1 && cellIdx + columnCount.value > props.size
  ) {
    classes.push(`${base}-bottom-left`);
  }


  return classes;
}

const cells = computed(() => {

  const cells: Array<T | null> = [];
  let itemCount = 0;


  Array(props.size).fill(0).map((_, i) => {
    const itemFromList: BoardItemType<T> | null = props.list![itemCount];
    let currentItem = null;

    if (itemFromList) {
      const { position } = itemFromList;

      if (position === i + 1) {
        currentItem = itemFromList.entity;
        ++itemCount
      }
    }

    cells.push(currentItem ? { ...currentItem } : null)

  })
  return cells;
})


const {
  isDragging,
  currentHoverIndex,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  setContainerRef,

} = useDragAndDrop({
  onDrop: ({ fromIndex, toIndex, item }) => {
    const list = [...cells.value]

    // Если целевая ячейка пуста
    if (!list[toIndex]) {
      list[toIndex] = { ...item };
      list[fromIndex] = null;
    }
    // Если предметы одинаковые - объединяем

    else if (list[toIndex].id === item.id) {
      list[toIndex].count += item.count;
      list[fromIndex] = null;
    }
    // Если предметы разные - меняем местами
    else {
      const temp = { ...list[toIndex] };
      list[toIndex] = { ...item };
      list[fromIndex] = temp;
    }

    emit('update-board', filterBoard(list))
  },
  getPreview: props.getPreview
});

const columnCount = computed(() => props.columnCount)

onMounted(() => {
  setContainerRef(boardeRef);
})

</script>

<style lang="scss">
.board-container {
  display: grid;
  grid-template-columns: repeat(var(--column-count), 1fr);
  background-color: var(--base-bg);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.board-cell {
  aspect-ratio: 1;
  background-color: var(--base-bg);
  border: var(--base-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;

  &_round-top-right {
    border-top-right-radius: 12px;
  }

  &_round-top-left {
    border-top-left-radius: 12px;
  }

  &_round-bottom-left {
    border-bottom-left-radius: 12px;
  }

  &_round-bottom-right {
    border-bottom-right-radius: 12px;
  }

  &:hover {
    border-color: #bdc3c7;
  }

  &__count {
    position: absolute;
    bottom: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 16px;
    height: 16px;

    border: var(--base-border);
    border-top-left-radius: 6px;

    font-size: 10px;
    color: #7d7d7d;
    font-weight: 500;

    user-select: none;
  }
}

.board-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  user-select: none;
  width: 60px;
  height: 60px;
  padding: 5px;
  box-sizing: border-box;
}

.board-item:active {
  cursor: grabbing;
}

.cell-highlight {
  background-color: rgba(52, 152, 219, 0.3);
}

.drag-ghost {
  width: 105px;
  height: 100px;
  border-radius: 24px;
  border: var(--base-border);
  border-width: 2px;
  padding: 20px;
  opacity: 1;
}
</style>
