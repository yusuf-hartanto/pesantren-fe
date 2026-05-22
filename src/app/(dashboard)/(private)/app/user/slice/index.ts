'use client'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api from '@/libs/axios'

/* --------------------------
   1. Types
--------------------------- */
export interface InitialState {
  dataPage: {
    values: any[]
    total: number
  }
  data: any
  datas: any[] // Untuk fetch all (kebutuhan dropdown)
  crud: any
  delete: any // Menggunakan any agar bisa menampung error object atau string
  loading: boolean
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
  loading: false
}

/* --------------------------
   3. Async Thunks
--------------------------- */

export const fetchUserPage = createAsyncThunk('user/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get('/app/resource', { params })
    
  return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const fetchUserById = createAsyncThunk('user/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/resource/${id}`)
    
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const fetchUserByUsername = createAsyncThunk('user/fetchByUsername', async (username: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/resource/check/${username}?type=data`)
    
    return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postUser = createAsyncThunk('user/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post('/app/resource', params)
    
  return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postUserUpdate = createAsyncThunk('user/update', async ({ id, params }: any, thunkAPI) => {
  try {
    const response = await api.put(`/app/resource/${id}`, params)
    
  return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postUserUpdatePassword = createAsyncThunk('user/updatePassword', async ({ id, params }: any, thunkAPI) => {
  try {
    const response = await api.put(`/app/resource/update-password/${id}`, params)
    
  return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const deleteUser = createAsyncThunk('user/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`/app/resource/${id}`)
    
  return response.data
  } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data) }
})

export const postExport = createAsyncThunk<any, any>(
  'user/export',
  async (params, thunkAPI) => {

    try {
      const response = await api.post(`/app/resource/export`, params)

      return response.data;
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetRedux: (state) => {
      state.crud = null
      state.delete = null
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      }
    })
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(fetchUserByUsername.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
    builder.addCase(postUser.rejected, (state, action: any) => {
      state.crud = action.payload
    })
    builder.addCase(postUserUpdate.fulfilled, (state, action) => {
      state.crud = action.payload
    })
    builder.addCase(postUserUpdatePassword.fulfilled, (state, action: any) => {
      state.crud = action.payload
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.crud = action.payload
    })
  }
})

export const { resetRedux } = userSlice.actions
export default userSlice.reducer
