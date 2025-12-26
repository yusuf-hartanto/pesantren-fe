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

export const fetchJenisBeasiswaAll = createAsyncThunk<any>('jenis-beasiswa/fetchAll', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.get(`/app/jenis-beasiswa/all-data`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const fetchJenisBeasiswaPage = createAsyncThunk<any, FetchParams>(
  'jenis-beasiswa/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/jenis-beasiswa`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchJenisBeasiswaById = createAsyncThunk<any, string>(
  'jenis-beasiswa/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.get(`/app/jenis-beasiswa/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postJenisBeasiswa = createAsyncThunk<any, any>('jenis-beasiswa/create', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.post(`/app/jenis-beasiswa`, params, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postJenisBeasiswaUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'jenis-beasiswa/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await api.put(`/app/jenis-beasiswa/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteJenisBeasiswa = createAsyncThunk<any, string>('jenis-beasiswa/delete', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await api.delete(`/app/jenis-beasiswa/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postImport = createAsyncThunk<any, any>('jenis-beasiswa/import', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/jenis-beasiswa/import`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postExport = createAsyncThunk<any, any>('jenis-beasiswa/export', async (params, thunkAPI) => {
  try {
    const response = await api.post(`/app/jenis-beasiswa/export`, params)

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'jenis_beasiswa',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchJenisBeasiswaAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchJenisBeasiswaPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchJenisBeasiswaById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteJenisBeasiswa.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postJenisBeasiswa.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postJenisBeasiswaUpdate.fulfilled, (state, action) => {
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
