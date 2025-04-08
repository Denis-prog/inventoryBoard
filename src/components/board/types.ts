export type BaseEntityType = { count: number; id: number }

export type BoardItemType<T extends BaseEntityType> = {
  position: number
  entity: T
}

export interface IBoard<T extends BaseEntityType> {
  list?: Array<BoardItemType<T>>
  size: number
  getPreview: (event: Event, item: T) => HTMLElement
}
