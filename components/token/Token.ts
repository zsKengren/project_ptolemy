import { token } from './ui.config'
import type { NestedKeyOf } from "#ui/types/utils";
import colors from '#ui-colors'

export type TokenSize = keyof typeof token.size
export type TokenColor = keyof typeof token.color | typeof colors[number]
export type TokenVariant = keyof typeof token.variant | NestedKeyOf<typeof token.color>

export interface Token {
  label?: String
  color?: TokenColor
  variant?: TokenVariant
  class?: [String, Object, Array]
  icon?: String 
  value?: Object
  disabled?: boolean
  readonly?: boolean
  selected?: boolean
}
