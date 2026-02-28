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
export const fetchLembagaAll = createAsyncThunk<any, any>(
  'lembagaKepesantrenan/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/lembaga-kepesantrenan/all-data`, { params })
      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

// Fetch Paginasi (Index)
export const fetchLembagaPage = createAsyncThunk(
  'lembagaKepesantrenan/fetchPage',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.get('/app/lembaga-kepesantrenan', { params })
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Fetch Detail by ID
export const fetchLembagaById = createAsyncThunk(
  'lembagaKepesantrenan/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.get(`/app/lembaga-kepesantrenan/${id}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Create New Lembaga
export const postLembaga = createAsyncThunk(
  'lembagaKepesantrenan/post',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.post('/app/lembaga-kepesantrenan', params)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Update Lembaga
export const postLembagaUpdate = createAsyncThunk(
  'lembagaKepesantrenan/update',
  async ({ id, params }: { id: string; params: any }, thunkAPI) => {
    try {
      const response = await api.put(`/app/lembaga-kepesantrenan/${id}`, params)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Delete Lembaga
export const deleteLembaga = createAsyncThunk(
  'lembagaKepesantrenan/delete',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.delete(`/app/lembaga-kepesantrenan/${id}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice
--------------------------- */
export const lembagaKepesantrenanSlice = createSlice({
  name: 'lembagaKepesantrenan',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    // List All
    builder.addCase(fetchLembagaAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // List Paged
    builder.addCase(fetchLembagaPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // Detail
    builder.addCase(fetchLembagaById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(fetchLembagaById.rejected, (state, action) => {
      state.data = action.payload || action.error.message
    })

    // Delete
    builder.addCase(deleteLembaga.fulfilled, (state, action) => {
      state.delete = action.payload.message || 'Data berhasil dihapus'
    })
    builder.addCase(deleteLembaga.rejected, (state, action) => {
      state.delete = null
      state.crud = action.payload || 'Gagal menghapus data'
    })

    // Create
    builder.addCase(postLembaga.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postLembaga.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal menyimpan data'
    })

    // Update
    builder.addCase(postLembagaUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postLembagaUpdate.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal memperbarui data'
    })
  }
})

export const { resetRedux } = lembagaKepesantrenanSlice.actions
export default lembagaKepesantrenanSlice.reducer
