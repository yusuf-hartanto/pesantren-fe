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
  datas: any[]
  crud: any
  delete: string | null
  import: any
  export: any,
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
  import: null,
  export: null,
  loading: false
}

/* --------------------------
   3. Async Thunks
--------------------------- */
export const fetchLocationAll = createAsyncThunk<any, any>(
  'location/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get(`/app/location/all-data`, { params })
      return response.data
    } catch (e: any) {
      return thunkAPI.fulfillWithValue(e.response?.data)
    }
  }
)

// Fetch Paginasi
export const fetchLocationPage = createAsyncThunk('location/fetchPage', async (params: any, thunkAPI) => {
  try {
    const response = await api.get('/app/location', { params })
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Fetch Detail by ID
export const fetchLocationById = createAsyncThunk('location/fetchById', async (id: string, thunkAPI) => {
  try {
    const response = await api.get(`/app/location/${id}`)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Create New Location
export const postLocation = createAsyncThunk('location/post', async (params: any, thunkAPI) => {
  try {
    const response = await api.post('/app/location', params)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Update Location
export const postLocationUpdate = createAsyncThunk('location/update', async ({ id, params }: { id: string, params: any }, thunkAPI) => {
  try {
    const response = await api.put(`/app/location/${id}`, params)
    return response.data
  } catch (e: any) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Delete Location
export const deleteLocation = createAsyncThunk('location/delete', async (id: string, thunkAPI) => {
  try {
    const response = await api.delete(`/app/location/${id}`)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// Export CSV
export const postExportLocation = createAsyncThunk('location/export', async (params: any, thunkAPI) => {
  try {
    const response = await api.post('/app/location/export', params)
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

// --- FUNGSI IMPORT ---
export const postImportLocation = createAsyncThunk('location/import', async (formData: FormData, thunkAPI) => {
  try {
    const response = await api.post('/app/location/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data)
  }
})

/* --------------------------
   4. Slice
--------------------------- */
export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    resetRedux: () => initialState
  },
  extraReducers: builder => {
    // Helper untuk menangani status pending (optional jika Anda butuh loading state)
    // builder.addMatcher(action => action.type.endsWith('/pending'), (state) => { state.loading = true; })

    // List All
    builder.addCase(fetchLocationAll.fulfilled, (state, action) => {
      state.datas = action.payload.data || [];
    });

    // List Paged
    builder.addCase(fetchLocationPage.fulfilled, (state, action) => {
      state.dataPage = {
        values: action.payload.data?.values || [],
        total: action.payload.data?.total || 0
      };
    });

    // Detail
    builder.addCase(fetchLocationById.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });
    builder.addCase(fetchLocationById.rejected, (state, action) => {
      state.data = action.payload || action.error.message;
    });

    // Delete
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.delete = action.payload.message || 'Deleted';
    });
    builder.addCase(deleteLocation.rejected, (state, action) => {
      state.data = action.payload || 'Failed to delete';
    });

    // Create & Update
    builder.addCase(postLocation.fulfilled, (state, action) => {
      state.crud = action.payload;
    });
    builder.addCase(postLocation.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal menyimpan data';
    });

    builder.addCase(postLocationUpdate.fulfilled, (state, action) => {
      state.crud = action.payload;
    });
    builder.addCase(postLocationUpdate.rejected, (state, action) => {
      state.crud = action.payload || 'Gagal memperbarui data';
    });

    // Import & Export
    builder.addCase(postImportLocation.fulfilled, (state, action) => {
      state.import = action.payload;
    });
    builder.addCase(postImportLocation.rejected, (state, action) => {
      state.import = action.payload || 'Gagal import data';
    });

    builder.addCase(postExportLocation.fulfilled, (state, action) => {
      state.export = action.payload;
    });
    builder.addCase(postExportLocation.rejected, (state, action) => {
      state.export = action.payload || 'Gagal export data';
    });
  }
})

export const { resetRedux } = locationSlice.actions
export default locationSlice.reducer
