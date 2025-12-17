import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */

export interface FetchParams {
  page?: number
  perPage?: number
  q?: string
  parent?: string
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

export const fetchMenuAll = createAsyncThunk<any, FetchParams>(
  'menu/fetchAll',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/menu/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchMenuPage = createAsyncThunk<any, FetchParams>(
  'menu/fetchPage',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/menu`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchMenuById = createAsyncThunk<any, string>(
  'menu/fetchById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/menu/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postMenu = createAsyncThunk<any, any>(
  'menu/create',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/menu`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postMenuUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'menu/update',
  async ({ id, params }, thunkAPI) => {

    try {
      const response = await api.put(`/app/menu/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteMenu = createAsyncThunk<any, string>(
  'menu/delete',
  async (id, thunkAPI) => {

    try {
      const response = await api.delete(`/app/menu/${id}`)

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
  name: 'menu',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchMenuAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchMenuPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchMenuById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteMenu.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postMenu.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postMenuUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
