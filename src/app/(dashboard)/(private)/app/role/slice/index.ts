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

export const fetchRoleAll = createAsyncThunk<any>(
  'role/fetchAll',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role/all-data`,
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

export const fetchRolePage = createAsyncThunk<any, FetchParams>(
  'role/fetchPage',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role`,
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

export const fetchRoleById = createAsyncThunk<any, string>(
  'role/fetchById',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role/${id}`,
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

export const postRole = createAsyncThunk<any, any>(
  'role/create',
  async (params, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role`,
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

export const postRoleUpdate = createAsyncThunk<any, { id: string; param: any }>(
  'role/update',
  async ({ id, param }, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role/${id}`,
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

export const deleteRole = createAsyncThunk<any, string>(
  'role/delete',
  async (id, thunkAPI) => {
    const session = await getSession()

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/app/role/${id}`,
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
  name: 'role',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchRoleAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchRolePage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchRoleById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postRole.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postRoleUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
