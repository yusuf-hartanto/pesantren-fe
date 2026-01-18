// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import emailReducer from './slices/email'
import kanbanReducer from './slices/kanban'
import role from '@/app/(dashboard)/(private)/app/role/slice/index'
import menu from '@/app/(dashboard)/(private)/app/menu/slice/index'
import tahun_ajaran from '@/app/(dashboard)/(private)/app/tahun-ajaran/slice/index'
import semester from '@/app/(dashboard)/(private)/app/semester/slice/index'
import tingkat from '@/app/(dashboard)/(private)/app/tingkat/slice/index'
import tahun_angkatan from '@/app/(dashboard)/(private)/app/tahun-angkatan/slice/index'
import status_awal_santri from '@/app/(dashboard)/(private)/app/status-awal-santri/slice/index'
import jenis_beasiswa from '@/app/(dashboard)/(private)/app/jenis-beasiswa/slice/index'
import program_pesantren from '@/app/(dashboard)/(private)/app/program-pesantren/slice/index'
import param_global from '@/app/(dashboard)/(private)/app/param-global/slice/index'
import kelompok_pelajaran from '@/app/(dashboard)/(private)/app/kelompok-pelajaran/slice/index'
import orang_tua_wali from '@/app/(dashboard)/(private)/app/orang-tua-wali/slice/index'
import kelas_mda from '@/app/(dashboard)/(private)/app/kelas-mda/slice/index'
import kelas_formal from '@/app/(dashboard)/(private)/app/kelas-formal/slice/index'
import jenis_jam_pelajaran from '@/app/(dashboard)/(private)/app/jenis-jam-pelajaran/slice/index'
import mata_pelajaran from '@/app/(dashboard)/(private)/app/mata-pelajaran/slice/index'
import jam_pelajaran from '@/app/(dashboard)/(private)/app/jam-pelajaran/slice/index'
import guru_mata_pelajaran from '@/app/(dashboard)/(private)/app/guru-mata-pelajaran/slice/index'

export const store = configureStore({
  reducer: {
    emailReducer,
    kanbanReducer,
    role,
    menu,
    tahun_ajaran,
    semester,
    tingkat,
    tahun_angkatan,
    status_awal_santri,
    jenis_beasiswa,
    program_pesantren,
    param_global,
    kelompok_pelajaran,
    orang_tua_wali,
    kelas_mda,
    kelas_formal,
    jenis_jam_pelajaran,
    mata_pelajaran,
    jam_pelajaran,
    guru_mata_pelajaran
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
