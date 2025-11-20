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
  delete: null,
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchTahunAjaranAll = createAsyncThunk<any>(
  'tahun-ajaran/fetchAll',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran/all-data`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
          params
        },
      )

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchTahunAjaranPage = createAsyncThunk<any, FetchParams>(
  'tahun-ajaran/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
          params
        }
      )

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchTahunAjaranById = createAsyncThunk<any, string>(
  'tahun-ajaran/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran/${id}`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      )

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postTahunAjaran = createAsyncThunk<any, any>(
  'tahun-ajaran/create',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran`,
        params,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      )

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postTahunAjaranUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'tahun-ajaran/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran/${id}`,
        param,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      )

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteTahunAjaran = createAsyncThunk<any, string>(
  'tahun-ajaran/delete',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/app/tahun-ajaran/${id}`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      )

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
  name: 'tahun_ajaran',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchTahunAjaranAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchTahunAjaranPage.fulfilled, (state, action) => {
       state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchTahunAjaranById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteTahunAjaran.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postTahunAjaran.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postTahunAjaranUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
