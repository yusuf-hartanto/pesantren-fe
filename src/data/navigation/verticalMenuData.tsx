// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

import api from '@/libs/axios'
import { mapMenu } from '@/@core/utils/menuHelpers'

export const verticalMenuData = async (): Promise<VerticalMenuDataType[]> => {
  try {
    const res = await api.get(`/navigation`)
    const { status, data } = res.data

    if (status) {
      return data.map((menu: any) => mapMenu(menu))
    }

    return []
  } catch (error) {
    return []
  }
}

export default verticalMenuData
