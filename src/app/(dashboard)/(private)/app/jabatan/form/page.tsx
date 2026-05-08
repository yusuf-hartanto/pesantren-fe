'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { Card, CardHeader, CardContent, Grid } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import {
  fetchJabatanById,
  postJabatan,
  postJabatanUpdate,
  resetRedux
} from '../slice/index'
import { fetchOrgUnitAll } from '../../organisasi/slice/index'

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const JabatanForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')
  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.jabatan)

  // Opsi Dropdown
  const [opt, setOpt] = useState({
    orgUnits: [] as any[],
    sifat: [
      { label: 'Biro', value: 'Biro' },
      { label: 'Bagian', value: 'Bagian' },
      { label: 'Lembaga', value: 'Lembaga' },
      { label: 'Sub-Unit', value: 'Sub-Unit' },
      { label: 'Umum', value: 'Umum' }
    ]
  })

  const [state, setState] = useState<any>({
    nama_jabatan: '',
    kode_jabatan: '',
    id_orgunit: null,
    level_jabatan: 1,
    sifat_jabatan: null,
    keterangan: ''
  })

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    values: state
  })

  /* -----------------------------------------------------------
     1. Inisialisasi Data (Dropdown & Detail)
  ----------------------------------------------------------- */
  const initForm = useCallback(async () => {
    try {
      // Fetch Unit Organisasi untuk dropdown
      const resOrg = await dispatch(fetchOrgUnitAll({ perPage: 1000 })).unwrap()

      const orgOptions = (resOrg?.data || [])
        .map((item: any) => ({ label: item.nama_orgunit, value: item.id_orgunit }))

      setOpt(prev => ({ ...prev, orgUnits: orgOptions }))

      // Jika Mode Edit / View
      if (id) {
        const resDetail = await dispatch(fetchJabatanById(id)).unwrap()
        const d = resDetail?.data

        if (d) {
          const formatted = {
            ...d,

            // Format untuk react-select/autocomplete
            id_orgunit: d.id_orgunit ? orgOptions.find((o: any) => o.value === d.id_orgunit) : null,
            sifat_jabatan: d.sifat_jabatan ? { label: d.sifat_jabatan, value: d.sifat_jabatan } : null,
          }

          setState(formatted)
          reset(formatted)
        }
      }
    } catch (err) {
      console.log(err)
      toast.error("Gagal memuat referensi data")
    }
  }, [id, dispatch, reset])

  useEffect(() => {
    initForm()
  }, [initForm])

  /* -----------------------------------------------------------
     2. Submit Handler
  ----------------------------------------------------------- */
  useEffect(() => {
    if (store.crud) {
      if (store.crud.status === true) {
        toast.success(store.crud.message || 'Data berhasil disimpan')
        dispatch(resetRedux())
        router.replace('/app/jabatan/list')
      } else {
        // Menampilkan error spesifik dari Backend (Duplikasi Nama/Kode atau Zod Error)
        toast.error(store.crud.message || 'Gagal menyimpan data jabatan')
        dispatch(resetRedux())
      }
    }
  }, [store.crud, dispatch, router])

  const onSubmit = () => {
    const payload = {
      ...state,
      id_orgunit: state.id_orgunit?.value || null,
      sifat_jabatan: state.sifat_jabatan?.value || null,
      level_jabatan: state.level_jabatan ? Number(state.level_jabatan) : 1,
    }

    if (id) {
      dispatch(postJabatanUpdate({ id, params: payload }))
    } else {
      // Sesuai Controller Backend yang menggunakan bulkCreate([payload])
      dispatch(postJabatan([payload]))
    }
  }

  /* -----------------------------------------------------------
     3. Form Fields Configuration
  ----------------------------------------------------------- */
  const fields = () => [
    // --- Informasi Utama Jabatan ---
    field({
      type: 'text',
      key: 'nama_jabatan',
      label: 'Nama Jabatan',
      required: true,
      readOnly: !!view
    }),
    field({
      type: 'text',
      key: 'kode_jabatan',
      label: 'Kode Jabatan',
      required: true,
      readOnly: !!view
    }),

    field({
      type: 'select',
      key: 'id_orgunit',
      label: 'Unit Organisasi',
      options: { values: opt.orgUnits },
      required: true,
      readOnly: !!view
    }),

    field({
      type: 'select',
      key: 'sifat_jabatan',
      label: 'Sifat Jabatan',
      options: { values: opt.sifat },
      required: true,
      readOnly: !!view
    }),

    field({
      type: 'numeral',
      key: 'level_jabatan',
      label: 'Level Jabatan (Senioritas)',
      required: true,
      readOnly: !!view
    }),

    // --- Lainnya ---
    field({
      type: 'textarea',
      key: 'keterangan',
      label: 'Keterangan / Job Desk Singkat',
      readOnly: !!view
    }),

    fieldBuildSubmit({
      onCancel: () => router.push('/app/jabatan/list'),
      loading: store.loading,
      disabled: !!view
    })
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={id ? (view ? 'Detail Jabatan' : 'Edit Jabatan') : 'Tambah Jabatan'}
            subheader='Tentukan posisi jabatan dalam unit organisasi yang tepat'
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {formColumn({ control, errors, state, setState, fields: fields() })}
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default JabatanForm
