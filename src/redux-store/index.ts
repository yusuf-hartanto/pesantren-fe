// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
// import chatReducer from '@/redux-store/slices/chat'
// import calendarReducer from '@/redux-store/slices/calendar'
// import kanbanReducer from '@/redux-store/slices/kanban'
// import emailReducer from '@/redux-store/slices/email'
import role from '@/app/(dashboard)/(private)/app/role/slice/index'

export const store = configureStore({
  reducer: {
    role
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
