'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface FetchParams {
  page?: number
  perPage: number
  q?: string // Akan dipetakan ke 'keyword' di API
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
  export: any,
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

export const fetchProvinces = createAsyncThunk('area/fetchProvinces', async (_, thunkAPI) => {
  try {
    const response = await api.get('/app/area/province')


    // Backend mengembalikan array langsung dalam response.data.data
      return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

export const fetchRegenciesByProvince = createAsyncThunk('area/fetchRegencies', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/area/regency/${id}`)

    
  return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Ambil semua data tanpa paginasi (untuk dropdown dll)
export const fetchCabangAll = createAsyncThunk<any, any>(
  'cabang/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/cabang/all-data`, { params })

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

// Ambil data dengan paginasi & keyword
export const fetchCabangPage = createAsyncThunk<any, FetchParams>(
  'cabang/fetchPage',
  async (params, thunkAPI) => {
    try {
      // Mapping 'q' ke 'keyword' sesuai logic repository backend kamu
      const response = await api.get(`/app/cabang`, {
        params: {
          page: params.page,
          perPage: params.perPage,
          keyword: params.q
        }
      })

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchCabangById = createAsyncThunk<any, string>(
  'cabang/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/app/cabang/${id}`)

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  })

export const postCabang = createAsyncThunk<any, any>(
  'cabang/create',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/cabang`, params)

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  })

export const postCabangUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'cabang/update',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await api.put(`/app/cabang/${id}`, params)

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteCabang = createAsyncThunk<any, string>(
  'cabang/delete',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/app/cabang/${id}`)

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  })

  
export const postBatchCabang = createAsyncThunk<any, any>(
  'app/cabang/insert',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/cabang/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImportCabang = createAsyncThunk<any, any>('cabang/import', async (params, thunkAPI) => {
  try {
    // Gunakan header multipart/form-data jika mengirim file
    const response = await api.post(`/app/cabang/import`, params)

    
  return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExportCabang = createAsyncThunk<any, any>(
  'cabang/export',
  async (params, thunkAPI) => {
    try {
      // Sesuaikan endpoint export jika ada
      const response = await api.post(`/app/cabang/export`, params)

      
  return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  })

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'cabang',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    // List All
    builder.addCase(fetchCabangAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    // List Paged
    builder.addCase(fetchCabangPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // Detail
    builder.addCase(fetchCabangById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(fetchCabangById.rejected, (state, action) => {
      state.data = action.payload || action.error.message;
    });

    // Delete
    builder.addCase(deleteCabang.fulfilled, (state, action) => {
      state.delete = action.payload.message || 'Deleted'
    })
    builder.addCase(deleteCabang.rejected, (state, action) => {
      state.data = action.payload || 'Failed to delete';
    });

    // Create & Update
    builder.addCase(postCabang.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postCabang.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal menyimpan data';
    });

    builder.addCase(postCabangUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postCabangUpdate.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal memperbarui data';
    });

    builder.addCase(postImportCabang.fulfilled, (state, action) => {
      state.import = action.payload
    })
    builder.addCase(postImportCabang.rejected, (state, action) => {
      state.import = action.payload || 'Gagal import data';
    });

    // Export
    builder.addCase(postExportCabang.fulfilled, (state, action) => {
      state.export = action.payload
    })
    builder.addCase(postExportCabang.rejected, (state, action) => {
      state.export = action.payload || 'Gagal export data';
    });
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
