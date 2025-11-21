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

export const fetchProgramPesantrenAll = createAsyncThunk<any>(
  'program-pesantren/fetchAll',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren/all-data`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchProgramPesantrenPage = createAsyncThunk<any, FetchParams>(
  'program-pesantren/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        params
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchProgramPesantrenById = createAsyncThunk<any, string>(
  'program-pesantren/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postProgramPesantren = createAsyncThunk<any, any>('program-pesantren/create', async (params, thunkAPI) => {
  const session = await getSession()

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren`, params, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })

    return response.data
  } catch (e: any) {
    return thunkAPI.fulfillWithValue(e.response?.data)
  }
})

export const postProgramPesantrenUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'program-pesantren/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren/${id}`, param, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteProgramPesantren = createAsyncThunk<any, string>(
  'program-pesantren/delete',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/app/program-pesantren/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })

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
  name: 'program_pesantren',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchProgramPesantrenAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchProgramPesantrenPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchProgramPesantrenById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteProgramPesantren.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postProgramPesantren.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postProgramPesantrenUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  }
})

export const { resetRedux } = slice.actions
export default slice.reducer
