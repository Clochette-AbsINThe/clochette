import type { IconName } from '@styles/utils';


export interface ItemTypes {
    id: number
    name: string
    price: number
    isGlass?: boolean
    icon?: IconName
    value: number
}
