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

export const fetchTahunAngkatanAll = createAsyncThunk<any>('tahun-angkatan/fetchAll', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan/all-data`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      params
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const fetchTahunAngkatanPage = createAsyncThunk<any, FetchParams>(
  'tahun-angkatan/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchTahunAngkatanById = createAsyncThunk<any, string>(
  'tahun-angkatan/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postTahunAngkatan = createAsyncThunk<any, any>('tahun-angkatan/create', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan`, params, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postTahunAngkatanUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'tahun-angkatan/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteTahunAngkatan = createAsyncThunk<any, string>('tahun-angkatan/delete', async (id, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/app/tahun-angkatan/${id}`, {
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
  name: 'tahun_angkatan',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchTahunAngkatanAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchTahunAngkatanPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchTahunAngkatanById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteTahunAngkatan.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postTahunAngkatan.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postTahunAngkatanUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
