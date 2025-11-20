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

export const fetchSemesterAll = createAsyncThunk<any>(
  'semester/fetchAll',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester/all-data`,
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

export const fetchSemesterPage = createAsyncThunk<any, FetchParams>(
  'semester/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester`,
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

export const fetchSemesterById = createAsyncThunk<any, string>(
  'semester/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester/${id}`,
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

export const postSemester = createAsyncThunk<any, any>(
  'semester/create',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester`,
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

export const postSemesterUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'semester/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester/${id}`,
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

export const deleteSemester = createAsyncThunk<any, string>(
  'semester/delete',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/app/semester/${id}`,
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
  name: 'semester',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchSemesterAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchSemesterPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchSemesterById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteSemester.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postSemester.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postSemesterUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
