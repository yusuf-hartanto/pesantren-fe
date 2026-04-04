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
  datas: any[] // Untuk fetch all (kebutuhan dropdown)
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

// Menggunakan base route /app/jenis-penilaian sesuai standar API Anda sebelumnya
const BASE_URL = '/app/jenis-penilaian'

export const fetchJenisPenilaianPage = createAsyncThunk('jenisPenilaian/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get(BASE_URL, { params })

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const fetchJenisPenilaianList = createAsyncThunk('jenisPenilaian/fetchAllData', async (params: any, thunkAPI) => {
  try {
    const response = await api.get(`${BASE_URL}/all-data`, { params })

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const fetchJenisPenilaianById = createAsyncThunk('jenisPenilaian/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postJenisPenilaian = createAsyncThunk('jenisPenilaian/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post(BASE_URL, params)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postJenisPenilaianUpdate = createAsyncThunk('jenisPenilaian/update', async ({ id, params }: any, thunkAPI) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, params)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const deleteJenisPenilaian = createAsyncThunk('jenisPenilaian/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`)

    
return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postBatch = createAsyncThunk<any, any>(
  'jenisPenilaian/batch',
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
  'jenisPenilaian/import',
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
  'jenisPenilaian/export',
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
export const jenisPenilaianSlice = createSlice({
  name: 'jenisPenilaian',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
    }
  },
  extraReducers: builder => {
    // Index/Pagination
    builder.addCase(fetchJenisPenilaianPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // List All (Dropdown)
    builder.addCase(fetchJenisPenilaianList.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // Detail
    builder.addCase(fetchJenisPenilaianById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    // Create
    builder.addCase(postJenisPenilaian.fulfilled, (state, action) => {
      state.crud = { status: true, message: action.payload.message }
    })
    builder.addCase(postJenisPenilaian.rejected, (state, action: any) => {
      state.crud = { status: false, message: action.payload?.message }
    })

    // Update
    builder.addCase(postJenisPenilaianUpdate.fulfilled, (state, action) => {
      state.crud = { status: true, message: action.payload.message }
    })
    builder.addCase(postJenisPenilaianUpdate.rejected, (state, action: any) => {
      state.crud = { status: false, message: action.payload?.message }
    })

    // Delete
    builder.addCase(deleteJenisPenilaian.fulfilled, (state, action) => {
      state.delete = { status: true, message: action.payload.message }
    })

    // Global Matcher for Loading State
    builder.addMatcher(a => a.type.endsWith('/pending'), (state) => { state.loading = true })
    builder.addMatcher(a => a.type.endsWith('/fulfilled') || a.type.endsWith('/rejected'), (state) => { state.loading = false })
  }
})

export const { resetRedux } = jenisPenilaianSlice.actions
export default jenisPenilaianSlice.reducer
