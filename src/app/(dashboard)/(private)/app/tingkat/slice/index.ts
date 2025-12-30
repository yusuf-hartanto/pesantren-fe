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

export interface FetchParamAlls {
  type: string
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchTingkatAll = createAsyncThunk<any, FetchParamAlls>('tingkat/fetchAll', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/tingkat/all-data`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const fetchTingkatPage = createAsyncThunk<any, FetchParams>('tingkat/fetchPage', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/tingkat`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const fetchTingkatById = createAsyncThunk<any, string>('tingkat/fetchById', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/tingkat/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postTingkat = createAsyncThunk<any, any>('tingkat/create', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.post(`/app/tingkat`, params, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postTingkatUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'tingkat/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.put(`/app/tingkat/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteTingkat = createAsyncThunk<any, string>('tingkat/delete', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.delete(`/app/tingkat/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postImport = createAsyncThunk<any, any>('tingkat/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/tingkat/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('tingkat/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/tingkat/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'tingkat',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchTingkatAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchTingkatPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchTingkatById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteTingkat.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postTingkat.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postTingkatUpdate.fulfilled, (state, action) => {
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
