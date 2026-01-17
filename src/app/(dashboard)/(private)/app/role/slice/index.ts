import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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

  navigation: any[]
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

  navigation: []
}

/* --------------------------
   3. Async Thunks (typed)
--------------------------- */

export const fetchRoleAll = createAsyncThunk<any>(
  'role/fetchAll',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/role/all-data`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchRolePage = createAsyncThunk<any, FetchParams>(
  'role/fetchPage',
  async (params, thunkAPI) => {

    try {
      const response = await api.get(`/app/role`, { params })

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchRoleById = createAsyncThunk<any, string>(
  'role/fetchById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/role/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postRole = createAsyncThunk<any, any>(
  'role/create',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/role`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postRoleUpdate = createAsyncThunk<any, { id: string; params: any }>(
  'role/update',
  async ({ id, params }, thunkAPI) => {

    try {
      const response = await api.put(`/app/role/${id}`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const deleteRole = createAsyncThunk<any, string>(
  'role/delete',
  async (id, thunkAPI) => {

    try {
      const response = await api.delete(`/app/role/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchRoleMenuById = createAsyncThunk<any, string>(
  'role/fetchRoleMenuById',
  async (id, thunkAPI) => {

    try {
      const response = await api.get(`/app/role-menu/${id}`)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postRoleMenu = createAsyncThunk<any, any>(
  'role/postRoleMenu',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/role-menu`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const fetchNavigation = createAsyncThunk<any>(
  'role/fetchNavigation',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/navigation', {
        headers: {
          Authorization: undefined,
        },
      })
      
      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postBatchRole = createAsyncThunk<any, any>(
  'role/insert',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/role/insert`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postImport = createAsyncThunk<any, any>(
  'role/import',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/role/import`, params)

      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const postExport = createAsyncThunk<any, any>(
  'role/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/role/export`, params)

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
  name: 'role',
  initialState,
  reducers: {
    resetRedux: () => initialState,
    setNavigation: (state, action) => {
      state.navigation = action.payload
    },
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

    builder.addCase(postRoleMenu.fulfilled, (state, action) => {
      state.crud = action.payload
    })

    builder.addCase(fetchNavigation.fulfilled, (state, action) => {
      state.navigation = action.payload.data || []
    })
        
    builder.addCase(postBatchRole.fulfilled, (state, action) => {
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

export const { resetRedux, setNavigation } = slice.actions
export default slice.reducer
