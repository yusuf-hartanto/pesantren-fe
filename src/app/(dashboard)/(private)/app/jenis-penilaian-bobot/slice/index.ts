'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */
export interface InitialState {
  dataPage: {
    values: any[]
    total: number
  }
  data: any
  datas: any[] // Untuk keperluan list tanpa pagination
  crud: any
  delete: any
  loading: boolean
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
  loading: false
}

/* --------------------------
   3. Async Thunks
--------------------------- */

const BASE_URL = '/app/bobot-penilaian'

// Fetch data dengan pagination (Index)
export const fetchBobotPenilaianPage = createAsyncThunk('bobotPenilaian/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get(BASE_URL, { params })

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Fetch data list (Tanpa pagination)
export const fetchBobotPenilaianList = createAsyncThunk('bobotPenilaian/fetchList', async (params: any, thunkAPI) => {
  try {
    const response = await api.get(`${BASE_URL}/list`, { params })

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Fetch detail berdasarkan id_bobot
export const fetchBobotPenilaianById = createAsyncThunk('bobotPenilaian/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Create (Mendukung single object atau array sesuai controller)
export const postBobotPenilaian = createAsyncThunk('bobotPenilaian/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post(BASE_URL, params)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Update berdasarkan id_bobot
export const postBobotPenilaianUpdate = createAsyncThunk('bobotPenilaian/update', async ({ id, params }: any, thunkAPI) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, params)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Delete berdasarkan id_bobot
export const deleteBobotPenilaian = createAsyncThunk('bobotPenilaian/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postBatch = createAsyncThunk<any, any>(
  'bobotPenilaian/batch',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`${BASE_URL}/batch`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>(
  'bobotPenilaian/import',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`${BASE_URL}/import`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postExport = createAsyncThunk<any, any>(
  'bobotPenilaian/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`${BASE_URL}/export`, params)

      return response.data;
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice
--------------------------- */
export const bobotPenilaianSlice = createSlice({
  name: 'bobotPenilaian',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
    }
  },
  extraReducers: builder => {
    // Pagination
    builder.addCase(fetchBobotPenilaianPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // List All
    builder.addCase(fetchBobotPenilaianList.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // Detail
    builder.addCase(fetchBobotPenilaianById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    // Create & Update Actions
    const crudActions = [postBobotPenilaian, postBobotPenilaianUpdate]

    crudActions.forEach(action => {
      builder.addCase(action.fulfilled, (state, action: any) => {
        state.crud = { status: true, message: action.payload.message }
      })
      builder.addCase(action.rejected, (state, action: any) => {
        state.crud = { status: false, message: action.payload?.message || 'Terjadi kesalahan' }
      })
    })

    // Delete
    builder.addCase(deleteBobotPenilaian.fulfilled, (state, action) => {
      state.delete = { status: true, message: action.payload.message }
    })

    // Global Loading Matcher
    builder.addMatcher(a => a.type.endsWith('/pending'), (state) => { state.loading = true })
    builder.addMatcher(a => a.type.endsWith('/fulfilled') || a.type.endsWith('/rejected'), (state) => { state.loading = false })
  }
})

export const { resetRedux } = bobotPenilaianSlice.actions
export default bobotPenilaianSlice.reducer
