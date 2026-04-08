import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface FetchParams {
  page: number
  perPage: number
  q: string
}

export interface InitialState {
  dataPage: {
    values: any[]
    total: number
  }
  data: any
  datas: any[]
  crud: any
  delete: string | null
  import: any
  export: any
}

/* --------------------------
   2. Initial State
--------------------------- */

const initialState: InitialState = {
  dataPage: {
    values: [],
    total: 0
  },
  data: {},
  datas: [],
  crud: null,
  delete: null,
  import: null,
  export: null
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export interface FetchParamAlls {
  is_active: string
}

export const fetchMasterSlotWaktuAll = createAsyncThunk<any, FetchParamAlls>(
  'master-slot-waktu/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/master-slot-waktu/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchMasterSlotWaktuPage = createAsyncThunk<any, FetchParams>(
  'master-slot-waktu/fetchPage',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/master-slot-waktu`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchMasterSlotWaktuById = createAsyncThunk<any, string>(
  'master-slot-waktu/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/app/master-slot-waktu/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postMasterSlotWaktu = createAsyncThunk<any, any>('master-slot-waktu/create', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/master-slot-waktu`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postBatchMasterSlotWaktu = createAsyncThunk<any, any>(
  'master-slot-waktu/insert',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/master-slot-waktu/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postMasterSlotWaktuUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'master-slot-waktu/update',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await api.put(`/app/master-slot-waktu/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteMasterSlotWaktu = createAsyncThunk<any, string>('master-slot-waktu/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/app/master-slot-waktu/${id}`)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postImport = createAsyncThunk<any, any>('master-slot-waktu/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/master-slot-waktu/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('master-slot-waktu/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/master-slot-waktu/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'master_slot_waktu',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchMasterSlotWaktuAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchMasterSlotWaktuPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchMasterSlotWaktuById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteMasterSlotWaktu.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postMasterSlotWaktu.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postBatchMasterSlotWaktu.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postMasterSlotWaktuUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postImport.fulfilled, (state, action) => {
      state.import = action.payload
    })

    builder.addCase(postExport.fulfilled, (state, action) => {
      state.export = action.payload
    })
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
