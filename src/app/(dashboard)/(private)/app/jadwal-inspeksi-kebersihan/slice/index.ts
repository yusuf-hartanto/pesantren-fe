import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface FetchParams {
  page: number
  perPage: number
  q: string
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
  export: null
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export interface FetchParamAlls {
  is_active: string
}

export const fetchJadwalInspeksiKebersihanAll = createAsyncThunk<any, FetchParamAlls>(
  'jadwal-inspeksi-kebersihan/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/jadwal-inspeksi-kebersihan/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchJadwalInspeksiKebersihanPage = createAsyncThunk<any, FetchParams>(
  'jadwal-inspeksi-kebersihan/fetchPage',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/jadwal-inspeksi-kebersihan`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchJadwalInspeksiKebersihanById = createAsyncThunk<any, string>(
  'jadwal-inspeksi-kebersihan/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/app/jadwal-inspeksi-kebersihan/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postJadwalInspeksiKebersihan = createAsyncThunk<any, any>(
  'jadwal-inspeksi-kebersihan/create',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/jadwal-inspeksi-kebersihan`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postBatchJadwalInspeksiKebersihan = createAsyncThunk<any, any>(
  'jadwal-inspeksi-kebersihan/insert',
  async (params, thunkAPI) => {
    try {
      const response = await api.post(`/app/jadwal-inspeksi-kebersihan/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postJadwalInspeksiKebersihanUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'jadwal-inspeksi-kebersihan/update',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await api.put(`/app/jadwal-inspeksi-kebersihan/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteJadwalInspeksiKebersihan = createAsyncThunk<any, string>(
  'jadwal-inspeksi-kebersihan/delete',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/app/jadwal-inspeksi-kebersihan/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>('jadwal-inspeksi-kebersihan/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/jadwal-inspeksi-kebersihan/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('jadwal-inspeksi-kebersihan/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/jadwal-inspeksi-kebersihan/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'jadwal_inspeksi_kebersihan',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchJadwalInspeksiKebersihanAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchJadwalInspeksiKebersihanPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchJadwalInspeksiKebersihanById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteJadwalInspeksiKebersihan.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postJadwalInspeksiKebersihan.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postBatchJadwalInspeksiKebersihan.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postJadwalInspeksiKebersihanUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postImport.fulfilled, (state, action) => {
      state.import = action.payload
    })

    builder.addCase(postExport.fulfilled, (state, action) => {
      state.export = action.payload
    })
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
