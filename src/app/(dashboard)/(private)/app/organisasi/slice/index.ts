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

// Fetch Paged (Untuk Table List)
export const fetchOrgUnitPage = createAsyncThunk(
  'orgUnit/fetchPage',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.get('/app/organization-unit', { params })

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Fetch All (Untuk Dropdown Parent di Form)
export const fetchOrgUnitAll = createAsyncThunk(
  'orgUnit/fetchAll',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.get('/app/organization-unit/all-data', { params })

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Fetch Detail by ID
export const fetchOrgUnitById = createAsyncThunk(
  'orgUnit/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.get(`/app/organization-unit/${id}`)

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Create New Unit (Support Bulk/Single)
export const postOrgUnit = createAsyncThunk(
  'orgUnit/post',
  async (params: any, thunkAPI) => {
    try {
      const response = await api.post('/app/organization-unit', params)

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Update Unit
export const postOrgUnitUpdate = createAsyncThunk(
  'orgUnit/update',
  async ({ id, params }: { id: string; params: any }, thunkAPI) => {
    try {
      const response = await api.put(`/app/organization-unit/${id}`, params)

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Delete Unit (Soft Delete)
export const deleteOrgUnit = createAsyncThunk(
  'orgUnit/delete',
  async (id: string, thunkAPI) => {
    try {
      const response = await api.delete(`/app/organization-unit/${id}`)

      
return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

export const postBatch = createAsyncThunk<any, any>(
  'orgUnit/insert',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/organization-unit/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>(
  'orgUnit/import',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/organization-unit/import`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postExport = createAsyncThunk<any, any>(
  'orgUnit/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/organization-unit/export`, params)

      return response.data;
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice
--------------------------- */
export const orgUnitSlice = createSlice({
  name: 'orgUnit',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
      state.loading = false
    }
  },
  extraReducers: builder => {
    // List Page
    builder.addCase(fetchOrgUnitPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // List All
    builder.addCase(fetchOrgUnitAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // Detail
    builder.addCase(fetchOrgUnitById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    // CRUD Ops
    builder.addCase(postOrgUnit.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postOrgUnit.rejected, (state, action) => {
      state.crud = action.payload || { status: false, message: 'Terjadi kesalahan' }
    })

    builder.addCase(postOrgUnitUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    // Delete
    builder.addCase(deleteOrgUnit.fulfilled, (state, action) => {
      state.delete = action.payload.message || 'Data berhasil dihapus'
    })
    builder.addCase(deleteOrgUnit.rejected, (state, action) => {
      state.crud = action.payload || { status: false, message: 'Data gagal dihapus' }
    })

    // Handling Loading State
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => { state.loading = true }
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
      (state) => { state.loading = false }
    )
  }
})

export const { resetRedux } = orgUnitSlice.actions
export default orgUnitSlice.reducer
