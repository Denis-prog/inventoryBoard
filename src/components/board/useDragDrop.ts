import { ref, type Ref } from 'vue'
import type { BaseEntityType } from './types'

interface DragEventCallbacks<T extends BaseEntityType> {
  onDragStart?: (params: { index: number; item: T; event: DragEvent }) => void
  onDragEnd?: (params: { event: DragEvent }) => void
  onDrop?: (params: { fromIndex: number; toIndex: number; item: T; event: DragEvent }) => void
  canDrag?: (item: T | null) => boolean
  getPreview: (event: Event, item: T) => HTMLElement
}

interface DragAndDropReturn<T extends BaseEntityType> {
  draggedItem: Ref<T | null>
  draggedIndex: Ref<number | null>
  isDragging: Ref<boolean>
  currentHoverIndex: Ref<number | null>
  handleDragStart: (index: number, event: DragEvent, item: T) => void
  handleDragEnd: (event: DragEvent) => void
  handleDragOver: (event: DragEvent) => void
  handleDrop: (event: DragEvent) => void
  setContainerRef: (ref: Ref<HTMLElement | null>) => void
}

export function useDragAndDrop<T extends BaseEntityType>(
  config: DragEventCallbacks<T>,
): DragAndDropReturn<T> {
  const { onDragStart, onDragEnd, onDrop, canDrag = () => true, getPreview } = config

  const draggedItem: Ref<T | null> = ref(null)
  const draggedIndex: Ref<number | null> = ref(null)
  const isDragging: Ref<boolean> = ref(false)
  const currentHoverIndex: Ref<number | null> = ref(null)
  const containerRef: Ref<HTMLElement | null> = ref(null)

  let currentPreview: HTMLElement | null = null

  const setContainerRef = (ref: Ref<HTMLElement | null>) => {
    containerRef.value = ref.value
  }

  const handleDragStart = (index: number, event: DragEvent, item: T): void => {
    if (!canDrag(item)) {
      event.preventDefault()
      return
    }

    draggedIndex.value = index
    draggedItem.value = item
    isDragging.value = true

    currentPreview = getPreview(event, item)
    currentPreview.style.position = 'absolute'
    currentPreview.style.top = '-1000px'

    document.body.appendChild(currentPreview)

    if (currentPreview) {
      event.dataTransfer?.setDragImage(
        currentPreview,
        currentPreview.offsetWidth / 2,
        currentPreview.offsetHeight / 2,
      )
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }

    onDragStart?.({ index, item, event })
  }

  const handleDragEnd = (event: DragEvent): void => {
    if (currentPreview) {
      document.body.removeChild(currentPreview)
      currentPreview = null
    }

    isDragging.value = false
    currentHoverIndex.value = null

    onDragEnd?.({ event })
  }

  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault()

    if (!isDragging.value || !containerRef.value) return

    const cells = containerRef.value.querySelectorAll<HTMLElement>('[data-draggable-target]')
    const mouseX = event.clientX
    const mouseY = event.clientY
    let hoverIndex: number | null = null

    cells.forEach((cell, index) => {
      const rect = cell.getBoundingClientRect()

      if (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      ) {
        hoverIndex = index
      }
    })

    currentHoverIndex.value = hoverIndex
  }

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault()

    if (!isDragging.value || currentHoverIndex.value === null || draggedIndex.value === null) return

    const targetIndex = currentHoverIndex.value
    const sourceIndex = draggedIndex.value

    if (targetIndex === sourceIndex) {
      return
    }

    if (onDrop && draggedItem.value) {
      onDrop({
        fromIndex: sourceIndex,
        toIndex: targetIndex,
        item: draggedItem.value,
        event,
      })
    }

    isDragging.value = false
    currentHoverIndex.value = null
  }

  return {
    draggedItem,
    draggedIndex,
    isDragging,
    currentHoverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    setContainerRef,
  }
}
