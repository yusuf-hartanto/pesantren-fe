'use client'

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  santriKamar: any[] // Menyimpan list santri aktif per kamar untuk form ready-view
  currentShift: any  // Menyimpan data shift asrama hasil auto-resolve waktu
  crud: any
  delete: any        // Menggunakan any agar bisa menampung error object atau string
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
  santriKamar: [],
  currentShift: null,
  crud: null,
  delete: null,
  loading: false
}

/* --------------------------
   3. Async Thunks
--------------------------- */

// Fetch History Log Absensi (Index Page) dengan Filter Lengkap
export const fetchAbsenSantriPage = createAsyncThunk('absenSantri/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get('/app/absen-harian-santri', { params })
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Fetch List Santri Aktif di Kamar tertentu untuk Form Input Presensi Kolektif
export const fetchSantriKamarReady = createAsyncThunk('absenSantri/fetchSantriKamar', async (params: { id_lokasi_kamar: string; tanggal?: string }, thunkAPI) => {
  try {
    const response = await api.get('/app/absen-harian-santri/santri-kamar', { params })
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Auto-resolve Shift Asrama aktif berdasarkan window jam saat ini / custom
export const fetchMatchingShiftAsrama = createAsyncThunk('absenSantri/fetchShift', async (params: { waktu_absen: string }, thunkAPI) => {
  try {
    const response = await api.get('/app/absen-harian-santri/shift-presensi', { params })
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Fetch Detail Riwayat Absen berdasarkan ID Absen
export const fetchAbsenSantriById = createAsyncThunk('absenSantri/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/absen-harian-santri/${id}`)
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Presensi Instan via Scan QR Code Kartu Santri
export const postAbsenScanQR = createAsyncThunk(
  'absenSantri/postScanQR',
  async (
    payload: {
      nis: string
      tanggal_custom: string
      waktu_custom: string
      id_lokasi_kamar: string
      id_shift_presensi: string
    },
    thunkAPI
  ) => {
    try {
      // Disamakan menggunakan base path instance Axios 'api' Anda
      const response = await api.post(`/app/absen-harian-santri/scan-qr`, payload)
      return response.data // Mengembalikan object { status, message, data }
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  }
)

// Post / Commit Absen Kamar Kolektif Massal
export const postAbsenSantri = createAsyncThunk('absenSantri/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post('/app/absen-harian-santri', params)
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Update Absen berdasarkan ID Absen
export const postAbsenSantriUpdate = createAsyncThunk('absenSantri/update', async ({ id, params }: any, thunkAPI) => {
  try {
    const response = await api.put(`/app/absen-harian-santri/${id}`, params)
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Delete / Soft Delete Data Absen
export const deleteAbsenSantri = createAsyncThunk('absenSantri/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`/app/absen-harian-santri/${id}`)
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

// Batch Insert Payload hasil validasi final Import Excel
export const postAbsenBatch = createAsyncThunk<any, any>('absenSantri/insert', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/absen-harian-santri/insert`, params)
    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

// Upload File Excel untuk validasi data & Preview Import
export const postAbsenImport = createAsyncThunk<any, any>('absenSantri/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/absen-harian-santri/import`, params)
    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

// Request download data logs / template excel kosongan
export const postAbsenExport = createAsyncThunk<any, any>('absenSantri/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/absen-harian-santri/export`, params)
    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice Definition
--------------------------- */
export const absenHarianSantriSlice = createSlice({
  name: 'absenHarianSantri',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
      state.currentShift = null
    },
    clearSantriKamar: (state) => {
      state.santriKamar = []
    }
  },
  extraReducers: builder => {
    // 1. Fetch Page / History List
    builder.addCase(fetchAbsenSantriPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    // 2. Fetch Santri Kamar (Form Preparation)
    builder.addCase(fetchSantriKamarReady.fulfilled, (state, action) => {
      state.santriKamar = action.payload.data || []
    })

    // 3. Fetch Matching Shift
    builder.addCase(fetchMatchingShiftAsrama.fulfilled, (state, action) => {
      state.currentShift = action.payload.data || null
    })

    // 4. Fetch Detail By ID
    builder.addCase(fetchAbsenSantriById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    // 5. Create / Save Absen Kolektif
    builder.addCase(postAbsenSantri.fulfilled, (state, action) => {
      state.crud = { status: true, message: action.payload.message, data: action.payload.data }
    })
    builder.addCase(postAbsenSantri.rejected, (state, action: any) => {
      state.crud = { status: false, message: action.payload?.message }
    })

    // 6. Post Real-time Scan QR
    builder.addCase(postAbsenScanQR.pending, (state) => {
      state.crud = null
    })
    builder.addCase(postAbsenScanQR.fulfilled, (state, action) => {
      state.crud = { status: true, message: action.payload.message, data: action.payload.data }
    })
    builder.addCase(postAbsenScanQR.rejected, (state, action: any) => {
      state.crud = { status: false, message: action.payload?.message || 'Gagal memproses scan QR kartu' }
    })

    // 7. Update Absen
    builder.addCase(postAbsenSantriUpdate.fulfilled, (state, action) => {
      state.crud = { status: true, message: action.payload.message }
    })
    builder.addCase(postAbsenSantriUpdate.rejected, (state, action: any) => {
      state.crud = { status: false, message: action.payload?.message }
    })

    // 8. Delete Absen
    builder.addCase(deleteAbsenSantri.fulfilled, (state, action) => {
      state.delete = { status: true, message: action.payload.message }
    })

    // Matcher Global untuk mengelola status Loading state secara terpusat
    builder.addMatcher(a => a.type.endsWith('/pending'), (state) => { state.loading = true })
    builder.addMatcher(a => a.type.endsWith('/fulfilled') || a.type.endsWith('/rejected'), (state) => { state.loading = false })
  }
})

export const { resetRedux, clearSantriKamar } = absenHarianSantriSlice.actions
export default absenHarianSantriSlice.reducer
