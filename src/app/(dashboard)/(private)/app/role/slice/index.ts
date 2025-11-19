// ** Fetch Users
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getSession } from "next-auth/react";

export const fetchRoleAll = createAsyncThunk('role/fetchAll', async params => {

  const session = await getSession()

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}` + '/app/role/all-data', {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      },
      params
    })

    return response.data
  } catch (e : any) {
    return e.response.data
  }
})

export const fetchRolePage = createAsyncThunk('role/fetchPage', async (params : any) => {

  const session = await getSession()

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}` +
        '/app/role?q=' +
        params.filter +
        '&page=' +
        params.page +
        '&perPage=' +
        params.rowsPerPage,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      }
    )

    return response.data
  } catch (e: any) {
    return e.response.data
  }
})

export const fetchRoleById = createAsyncThunk('role/fetchById', async params => {

  const session = await getSession()

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}` + '/app/role/' + params, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    return response.data
  } catch (e: any) {
    return e.response.data
  }
})

export const deleteRole = createAsyncThunk('role/delete', async id => {

  const session = await getSession()

  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}` + '/app/role/' + id, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    return response.data
  } catch (e: any) {
    return e.response.data
  }
})

export const postRole = createAsyncThunk('role/create', async params => {
  const session = await getSession()

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}` + '/app/role', params, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    return response.data
  } catch (e: any) {
    return e.response.data
  }
})

export const postRoleUpdate = createAsyncThunk('role/update', async (params : any) => {

  const session = await getSession()

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}` + '/app/role/' + params.id, params.param, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    return response.data
  } catch (e: any) {
    return e.response.data
  }
})

export const resetRedux = createAsyncThunk('role/resetRedux', async params => {
  return {}
})

const initialState = () => ({
  dataPage: {},
  delete: null,
  data: {},
  crud: null,
  datas: [],
})

export const dataSlice = createSlice({
  name: 'role',
  initialState: initialState,
  reducers: {
    resetRedux: () => initialState()
  },
  extraReducers: builder => {

    builder.addCase(fetchRoleAll.fulfilled, (state, action) => {
      // console.log("redux action", action)
      state.datas = action.payload.data
    })

    builder.addCase(fetchRolePage.fulfilled, (state, action) => {
      // console.log("redux action", action)
      state.dataPage = action.payload.data
    })

    builder.addCase(fetchRoleById.fulfilled, (state, action) => {
      // console.log("redux action", action)
      state.data = action.payload.data
    })

    builder.addCase(deleteRole.fulfilled, (state, action) => {
      // console.log("redux action", action)
      state.delete = action.payload.message
    })

    builder.addCase(postRole.fulfilled, (state, action) => {
      //console.log("redux action", action)
      state.crud = action.payload
    })

    builder.addCase(postRoleUpdate.fulfilled, (state, action) => {
      //console.log('redux action on update', action)
      state.crud = action.payload
    })

    builder.addCase(resetRedux.fulfilled, (state, action) => {
      //console.log('redux action reset', action)
      state.data = {}
      state.crud = null
      state.delete = null
    })
  }
})

export default dataSlice.reducer
