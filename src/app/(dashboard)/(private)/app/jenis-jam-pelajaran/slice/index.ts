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
  import: any
  export: any
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
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchJenisJamPelajaranAll = createAsyncThunk<any, FetchParams>(
  'jenis_jam_pelajaran/fetchAll',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/jenis-jam-pelajaran/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchJenisJamPelajaranPage = createAsyncThunk<any, FetchParams>(
  'jenis_jam_pelajaran/fetchPage',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/jenis-jam-pelajaran`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchJenisJamPelajaranById = createAsyncThunk<any, string>(
  'jenis_jam_pelajaran/fetchById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/jenis-jam-pelajaran/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postJenisJamPelajaran = createAsyncThunk<any, any>(
  'jenis_jam_pelajaran/create',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/jenis-jam-pelajaran`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postBatchJenisJamPelajaran = createAsyncThunk<any, any>(
  'jenis_jam_pelajaran/insert',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/jenis-jam-pelajaran/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postJenisJamPelajaranUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'jenis_jam_pelajaran/update',
  async ({ id, params }, thunkAPI) => {

    try {
      const response = await api.put(`/app/jenis-jam-pelajaran/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteJenisJamPelajaran = createAsyncThunk<any, string>(
  'jenis_jam_pelajaran/delete',
  async (id, thunkAPI) => {

    try {
      const response = await api.delete(`/app/jenis-jam-pelajaran/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>(
  'jenis_jam_pelajaran/import',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/jenis-jam-pelajaran/import`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postExport = createAsyncThunk<any, any>(
  'jenis_jam_pelajaran/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/jenis-jam-pelajaran/export`, params)

      return response.data;
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'jenis_jam_pelajaran',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchJenisJamPelajaranAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchJenisJamPelajaranPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchJenisJamPelajaranById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteJenisJamPelajaran.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postJenisJamPelajaran.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postBatchJenisJamPelajaran.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postJenisJamPelajaranUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postImport.fulfilled, (state, action) => {
      state.import = action.payload
    })

    builder.addCase(postExport.fulfilled, (state, action) => {
      state.export = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
