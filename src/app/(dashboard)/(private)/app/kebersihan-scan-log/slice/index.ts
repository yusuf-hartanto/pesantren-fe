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

export interface FetchParamAlls {}

export const fetchKebersihanScanLogAll = createAsyncThunk<any, FetchParamAlls>(
  'kebersihan-scan-log/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/kebersihan-scan-log/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchKebersihanScanLogPage = createAsyncThunk<any, FetchParams>(
  'kebersihan-scan-log/fetchPage',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/kebersihan-scan-log`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchKebersihanScanLogById = createAsyncThunk<any, string>(
  'kebersihan-scan-log/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/app/kebersihan-scan-log/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postKebersihanScanLog = createAsyncThunk<any, any>(
  'kebersihan-scan-log/create',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/kebersihan-scan-log`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postBatchKebersihanScanLog = createAsyncThunk<any, any>(
  'kebersihan-scan-log/insert',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/kebersihan-scan-log/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postKebersihanScanLogUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'kebersihan-scan-log/update',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await api.put(`/app/kebersihan-scan-log/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteKebersihanScanLog = createAsyncThunk<any, string>(
  'kebersihan-scan-log/delete',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/app/kebersihan-scan-log/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>('kebersihan-scan-log/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/kebersihan-scan-log/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('kebersihan-scan-log/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/kebersihan-scan-log/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'kebersihan_scan_log',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchKebersihanScanLogAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchKebersihanScanLogPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchKebersihanScanLogById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteKebersihanScanLog.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postKebersihanScanLog.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postKebersihanScanLogUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postBatchKebersihanScanLog.fulfilled, (state, action) => {
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
