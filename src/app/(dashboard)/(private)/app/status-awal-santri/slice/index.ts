import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSession } from 'next-auth/react'

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

export const fetchStatusAwalSantriAll = createAsyncThunk<any>(
  'status-awal-santri/fetchAll',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/status-awal-santri/all-data`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchStatusAwalSantriPage = createAsyncThunk<any, FetchParams>(
  'status-awal-santri/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/status-awal-santri`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchStatusAwalSantriById = createAsyncThunk<any, string>(
  'status-awal-santri/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/status-awal-santri/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postStatusAwalSantri = createAsyncThunk<any, any>(
  'status-awal-santri/create',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.post(`/app/status-awal-santri`, params, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postStatusAwalSantriUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'status-awal-santri/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.put(`/app/status-awal-santri/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteStatusAwalSantri = createAsyncThunk<any, string>(
  'status-awal-santri/delete',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.delete(`/app/status-awal-santri/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>('status-awal-santri/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/status-awal-santri/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('status-awal-santri/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/status-awal-santri/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'status_awal_santri',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchStatusAwalSantriAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchStatusAwalSantriPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchStatusAwalSantriById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteStatusAwalSantri.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postStatusAwalSantri.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postStatusAwalSantriUpdate.fulfilled, (state, action) => {
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
