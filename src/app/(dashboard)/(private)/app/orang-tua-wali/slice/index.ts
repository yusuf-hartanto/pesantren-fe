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

export const fetchOrangTuaWaliAll = createAsyncThunk<any>('orang-tua-wali/fetchAll', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/orang-tua-wali/all-data`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const fetchOrangTuaWaliPage = createAsyncThunk<any, FetchParams>(
  'orang-tua-wali/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/orang-tua-wali`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchOrangTuaWaliById = createAsyncThunk<any, string>('orang-tua-wali/fetchById', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/orang-tua-wali/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postOrangTuaWali = createAsyncThunk<any, any>('orang-tua-wali/create', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.post(`/app/orang-tua-wali`, params, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postOrangTuaWaliUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'orang-tua-wali/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.put(`/app/orang-tua-wali/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteOrangTuaWali = createAsyncThunk<any, string>('orang-tua-wali/delete', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.delete(`/app/orang-tua-wali/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postImport = createAsyncThunk<any, any>('orang-tua-wali/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/orang-tua-wali/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('orang-tua-wali/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/orang-tua-wali/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'orang_tua_wali',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchOrangTuaWaliAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchOrangTuaWaliPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchOrangTuaWaliById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteOrangTuaWali.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postOrangTuaWali.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postOrangTuaWaliUpdate.fulfilled, (state, action) => {
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
