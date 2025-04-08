import type { ImgHTMLAttributes } from 'vue'

export type UserInfoData = {
  [key: string]: unknown
}

export interface IUserInfo {
  avatar?: Partial<ImgHTMLAttributes>
  userInfo?: UserInfoData
}
