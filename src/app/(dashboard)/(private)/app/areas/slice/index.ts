'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface AreaState {
  provinces: any[]
  regencies: any[]
  districts: any[]
  subdistricts: any[]
  loading: boolean
  error: any
}

/* --------------------------
   2. Initial State
--------------------------- */

const initialState: AreaState = {
  provinces: [],
  regencies: [],
  districts: [],
  subdistricts: [],
  loading: false,
  error: null
}

/* --------------------------
   3. Async Thunks
--------------------------- */

// Ambil semua Provinsi
export const fetchProvinces = createAsyncThunk(
  'area/fetchProvinces',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/area/province')
      return response.data // Mengharapkan { status: true, data: [...] }
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  })

// Ambil Kabupaten/Kota berdasarkan ID Provinsi
export const fetchRegenciesByProvince = createAsyncThunk(
  'area/fetchRegencies',
  async (provinceId: string, thunkAPI) => {
    try {
      const response = await api.get(`/area/regency/${provinceId}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  })

// Ambil Kecamatan berdasarkan ID Kabupaten/Kota
export const fetchDistrictsByRegency = createAsyncThunk(
  'area/fetchDistricts',
  async (regencyId: string, thunkAPI) => {
    try {
      const response = await api.get(`/area/district/${regencyId}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  })

// Ambil Kelurahan berdasarkan ID Kecamatan
export const fetchSubDistrictsByDistrict = createAsyncThunk(
  'area/fetchSubDistricts',
  async (districtId: string, thunkAPI) => {
    try {
      const response = await api.get(`/area/subdistrict/${districtId}`)
      return response.data
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data)
    }
  })

/* --------------------------
   4. Slice
--------------------------- */

export const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    // Reducer untuk membersihkan data saat form di-reset atau ganti pilihan
    clearRegencies: (state) => { state.regencies = [] },
    clearDistricts: (state) => { state.districts = [] },
    clearSubDistricts: (state) => { state.subdistricts = [] },
    resetArea: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Province
      .addCase(fetchProvinces.pending, (state) => { state.loading = true })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false
        state.provinces = action.payload.data || []
      })

      // Regency
      .addCase(fetchRegenciesByProvince.fulfilled, (state, action) => {
        state.regencies = action.payload.data || []
      })

      // District
      .addCase(fetchDistrictsByRegency.fulfilled, (state, action) => {
        state.districts = action.payload.data || []
      })

      // SubDistrict
      .addCase(fetchSubDistrictsByDistrict.fulfilled, (state, action) => {
        state.subdistricts = action.payload.data || []
      })
  }
})

export const { clearRegencies, clearDistricts, clearSubDistricts, resetArea } = areaSlice.actions
export default areaSlice.reducer
