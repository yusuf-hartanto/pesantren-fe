import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getSession } from 'next-auth/react'

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
  delete: null
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchJenisBeasiswaAll = createAsyncThunk<any>('jenis-beasiswa/fetchAll', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa/all-data`, {
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa`, {
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa/${id}`, {
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa`, params, {
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
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa/${id}`, param, {
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
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/app/jenis-beasiswa/${id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

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
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
