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
  delete: any // Menggunakan any agar bisa menampung error object atau string
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

// Fetch Semua Jabatan (Tanpa Paginasi - biasanya untuk relasi di modul lain)
export const fetchJabatanAll = createAsyncThunk('jabatan/fetchAll', async (params: any, thunkAPI) => {
  try {
    const response = await api.get(`/app/jabatan/all-data`, { params })
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Fetch Paginasi (List Utama)
export const fetchJabatanPage = createAsyncThunk('jabatan/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get('/app/jabatan', { params })
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Fetch Detail by ID
export const fetchJabatanById = createAsyncThunk('jabatan/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/jabatan/${id}`)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Create New Jabatan (Menerima array karena controller menggunakan bulkCreate)
export const postJabatan = createAsyncThunk('jabatan/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post('/app/jabatan', params)
    return response.data
  } catch (e: any) {
    // Di sini error duplikasi (400/409) ditangkap dan dilempar ke rejected
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Update Jabatan
export const postJabatanUpdate = createAsyncThunk('jabatan/update', async ({ id, params }: { id: string, params: any }, thunkAPI) => {
  try {
    const response = await api.put(`/app/jabatan/${id}`, params)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Delete Jabatan
export const deleteJabatan = createAsyncThunk('jabatan/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`/app/jabatan/${id}`)
    return response.data
  } catch (e: any) {
    // Menangkap error proteksi relasi (misal: masih ada pegawai)
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice
--------------------------- */
export const jabatanSlice = createSlice({
  name: 'jabatan',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
      state.loading = false
      // Kita tidak mereset dataPage agar UI tidak flicker saat pindah form
    }
  },
  extraReducers: builder => {

    // List All
    builder.addCase(fetchJabatanAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || [];
    });

    // List Paged
    builder.addCase(fetchJabatanPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      };
    });

    // Detail
    builder.addCase(fetchJabatanById.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });

    // Create & Update (Handling Sukses & Error Duplicate/Validation)
    const handleCrudFulfilled = (state: any, action: any) => {
      state.crud = {
        status: true,
        message: action.payload.message || 'Berhasil menyimpan data',
        data: action.payload.data
      }
    }

    const handleCrudRejected = (state: any, action: any) => {
      state.crud = {
        status: false,
        // Mengambil pesan error dari Zod atau Error buatan di Controller
        message: action.payload?.message || 'Terjadi kesalahan sistem'
      }
    }

    builder.addCase(postJabatan.fulfilled, handleCrudFulfilled);
    builder.addCase(postJabatan.rejected, handleCrudRejected);
    builder.addCase(postJabatanUpdate.fulfilled, handleCrudFulfilled);
    builder.addCase(postJabatanUpdate.rejected, handleCrudRejected);

    // Delete (Handling Error Proteksi Relasi)
    builder.addCase(deleteJabatan.fulfilled, (state, action) => {
      state.delete = {
        status: true,
        message: action.payload.message || 'Data berhasil dihapus'
      };
    });
    builder.addCase(deleteJabatan.rejected, (state, action: any) => {
      state.delete = {
        status: false,
        message: action.payload?.message || 'Gagal menghapus. Data mungkin masih digunakan.'
      };
    });

    // --- Loading State ---
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

export const { resetRedux } = jabatanSlice.actions
export default jabatanSlice.reducer
