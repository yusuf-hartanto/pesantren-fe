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
  import: any,
  export: any,
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
  export: null,
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchParamGlobalAll = createAsyncThunk<any, FetchParams>(
  'param-global/fetchAll',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/param-global/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchParamGlobalPage = createAsyncThunk<any, FetchParams>(
  'param-global/fetchPage',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/param-global`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchParamGlobalById = createAsyncThunk<any, string>(
  'param-global/fetchById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/param-global/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postParamGlobal = createAsyncThunk<any, any>(
  'param-global/create',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/param-global`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postParamGlobalUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'param-global/update',
  async ({ id, params }, thunkAPI) => {

    try {
      const response = await api.put(`/app/param-global/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteParamGlobal = createAsyncThunk<any, string>(
  'param-global/delete',
  async (id, thunkAPI) => {

    try {
      const response = await api.delete(`/app/param-global/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postBatch = createAsyncThunk<any, any>(
  'param-global/insert',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/param-global/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>(
  'param-global/import',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/param-global/import`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postExport = createAsyncThunk<any, any>(
  'param-global/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/param-global/export`, params)

      return response.data;
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

/* --------------------------
   4. Slice + Reducers
--------------------------- */

export const slice = createSlice({
  name: 'param_global',
  initialState,
  reducers: {
    resetRedux: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchParamGlobalAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || []
    })

    builder.addCase(fetchParamGlobalPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })

    builder.addCase(fetchParamGlobalById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })

    builder.addCase(deleteParamGlobal.fulfilled, (state, action) => {
      state.delete = action.payload.message
    })

    builder.addCase(postParamGlobal.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(postParamGlobalUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
        
    builder.addCase(postBatch.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    
    builder.addCase(postImport.fulfilled, (state, action) => {
      state.import = action.payload
    })

    builder.addCase(postExport.fulfilled, (state, action) => {
      state.export = action.payload
    })
  },
})

export const { resetRedux } = slice.actions
export default slice.reducer
