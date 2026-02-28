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
  datas: any[]
  crud: any
  delete: string | null
  import: any
  export: any
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
  import: null,
  export: null,
  loading: false
}

/* --------------------------
   3. Async Thunks
--------------------------- */

// Fetch All Data (Tanpa Paginasi)
export const fetchLembagaFormalAll = createAsyncThunk<any, any>(
  'lembagaFormal/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/lembaga-formal/all-data`, { params })
      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

// Fetch Paginasi (Index)
export const fetchLembagaFormalPage = createAsyncThunk(
  'lembagaFormal/fetchPage',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.get('/app/lembaga-formal', { params })
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Fetch Detail by ID
export const fetchLembagaFormalById = createAsyncThunk(
  'lembagaFormal/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.get(`/app/lembaga-formal/${id}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Create New Lembaga Formal
export const postLembagaFormal = createAsyncThunk(
  'lembagaFormal/post',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.post('/app/lembaga-formal', params)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Update Lembaga Formal
export const postLembagaFormalUpdate = createAsyncThunk(
  'lembagaFormal/update',
  async ({ id, params }: { id: string; params: any }, thunkAPI) => {
    try {
      const response = await api.put(`/app/lembaga-formal/${id}`, params)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Delete Lembaga Formal (Soft Delete)
export const deleteLembagaFormal = createAsyncThunk(
  'lembagaFormal/delete',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.delete(`/app/lembaga-formal/${id}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice
--------------------------- */
export const lembagaFormalSlice = createSlice({
  name: 'lembagaFormal',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    // List All
    builder.addCase(fetchLembagaFormalAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // List Paged
    builder.addCase(fetchLembagaFormalPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // Detail
    builder.addCase(fetchLembagaFormalById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(fetchLembagaFormalById.rejected, (state, action) => {
      state.data = action.payload || action.error.message
    })

    // Delete (Update state.delete untuk trigger toast di list.tsx)
    builder.addCase(deleteLembagaFormal.fulfilled, (state, action) => {
      state.delete = action.payload.message || 'Data berhasil dihapus'
    })
    builder.addCase(deleteLembagaFormal.rejected, (state, action) => {
      state.delete = null
      state.crud = action.payload || 'Gagal menghapus data'
    })

    // Create
    builder.addCase(postLembagaFormal.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postLembagaFormal.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal menyimpan data'
    })

    // Update
    builder.addCase(postLembagaFormalUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postLembagaFormalUpdate.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal memperbarui data'
    })
  }
})

export const { resetRedux } = lembagaFormalSlice.actions
export default lembagaFormalSlice.reducer
