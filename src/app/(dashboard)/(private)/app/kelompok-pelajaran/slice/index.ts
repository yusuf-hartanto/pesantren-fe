import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface FetchParams {
  page?: number
  perPage?: number
  q?: string
  parent?: string
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
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchKelompokPelajaranAll = createAsyncThunk<any, FetchParams>(
  'kelompok_pelajaran/fetchAll',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/kelompok-pelajaran/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchKelompokPelajaranPage = createAsyncThunk<any, FetchParams>(
  'kelompok_pelajaran/fetchPage',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/kelompok-pelajaran`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchKelompokPelajaranById = createAsyncThunk<any, string>(
  'kelompok_pelajaran/fetchById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/kelompok-pelajaran/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postKelompokPelajaran = createAsyncThunk<any, any>(
  'kelompok_pelajaran/create',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/kelompok-pelajaran`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postKelompokPelajaranUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'kelompok_pelajaran/update',
  async ({ id, params }, thunkAPI) => {

    try {
      const response = await api.put(`/app/kelompok-pelajaran/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteKelompokPelajaran = createAsyncThunk<any, string>(
  'kelompok_pelajaran/delete',
  async (id, thunkAPI) => {

    try {
      const response = await api.delete(`/app/kelompok-pelajaran/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'kelompok_pelajaran',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchKelompokPelajaranAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchKelompokPelajaranPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchKelompokPelajaranById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteKelompokPelajaran.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postKelompokPelajaran.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postKelompokPelajaranUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
