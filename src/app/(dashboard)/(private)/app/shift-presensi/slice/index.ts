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
  status: string
}

export const fetchShiftPresensiAll = createAsyncThunk<any, FetchParamAlls>(
  'shift-presensi/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/shift-presensi/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchShiftPresensiPage = createAsyncThunk<any, FetchParams>(
  'shift-presensi/fetchPage',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/shift-presensi`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchShiftPresensiById = createAsyncThunk<any, string>(
  'shift-presensi/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/app/shift-presensi/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postShiftPresensi = createAsyncThunk<any, any>('shift-presensi/create', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/shift-presensi`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postBatchShiftPresensi = createAsyncThunk<any, any>('shift-presensi/insert', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/shift-presensi/insert`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postShiftPresensiUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'shift-presensi/update',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await api.put(`/app/shift-presensi/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteShiftPresensi = createAsyncThunk<any, string>('shift-presensi/delete', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/app/shift-presensi/${id}`)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postImport = createAsyncThunk<any, any>('shift-presensi/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/shift-presensi/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('shift-presensi/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/shift-presensi/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'shift_presensi',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchShiftPresensiAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchShiftPresensiPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchShiftPresensiById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteShiftPresensi.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postShiftPresensi.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postShiftPresensiUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postBatchShiftPresensi.fulfilled, (state, action) => {
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
