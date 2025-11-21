// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import role from '@/app/(dashboard)/(private)/app/role/slice/index'
import tahun_ajaran from '@/app/(dashboard)/(private)/app/tahun-ajaran/slice/index'
import semester from '@/app/(dashboard)/(private)/app/semester/slice/index'
import tingkat from '@/app/(dashboard)/(private)/app/tingkat/slice/index'

export const store = configureStore({
  reducer: {
    role,
    tahun_ajaran,
    semester,
    tingkat
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
