'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, Grid, Divider } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import {
  fetchJenisPenilaianById,
  postJenisPenilaian,
  postJenisPenilaianUpdate,
  resetRedux
} from '../slice'

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const JenisPenilaianForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.jenis_penilaian)

  // Opsi untuk select field
  const [opt] = useState<any>({
    lembaga: [
      { label: 'FORMAL', value: 'FORMAL' },
      { label: 'PESANTREN', value: 'PESANTREN' }
    ],
    status: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ],
    ujian: [
      { label: 'Ya', value: 1 },
      { label: 'Tidak', value: 0 }
    ]
  })

  // State awal form
  const [state, setState] = useState<any>({
    singkatan: '',
    jenis_pengujian: '',
    lembaga_type: null,
    is_ujian: { label: 'Tidak', value: 0 },
    status: { label: 'Active', value: 'active' },
    keterangan: ''
  })

  const { control, handleSubmit, formState: { errors }, reset } = useForm({ values: state })

  const initForm = useCallback(async () => {
    try {
      if (id) {
        const resDetail = await dispatch(fetchJenisPenilaianById(id)).unwrap()
        const d = resDetail?.data
        if (d) {
          const formatted = {
            ...d,
            lembaga_type: opt.lembaga.find((o: any) => o.value === d.lembaga_type),
            status: opt.status.find((o: any) => o.value === d.status),
            is_ujian: opt.ujian.find((o: any) => o.value === d.is_ujian)
          }
          setState(formatted)
          reset(formatted)
        }
      }
    } catch (err) {
      toast.error("Gagal memuat data detail")
    }
  }, [id, dispatch, reset, opt])

  useEffect(() => { initForm() }, [initForm])

  useEffect(() => {
    if (store.crud) {
      if (store.crud.status) {
        toast.success(store.crud.message)
        dispatch(resetRedux())
        router.replace('/app/jenis-penilaian/list')
      } else {
        toast.error(store.crud.message || "Terjadi kesalahan")
        dispatch(resetRedux())
      }
    }
  }, [store.crud, dispatch, router])

  const onSubmit = () => {
    const payload = {
      ...state,
      lembaga_type: state.lembaga_type?.value,
      is_ujian: state.is_ujian?.value,
      status: state.status?.value,
    }

    if (id) {
      dispatch(postJenisPenilaianUpdate({ id, params: payload }))
    } else {
      // Backend menggunakan bulkCreate, kirim dalam array jika perlu (sesuai controller)
      dispatch(postJenisPenilaian([payload]))
    }
  }

  const fields = () => [
    { section: 'Konfigurasi Penilaian' },
    field({
      type: 'text',
      key: 'jenis_pengujian',
      label: 'Nama Pengujian',
      placeholder: 'Contoh: Ujian Tengah Semester',
      required: true,
      readOnly: !!view
    }),
    field({
      type: 'text',
      key: 'singkatan',
      label: 'Singkatan',
      placeholder: 'Contoh: UTS',
      readOnly: !!view
    }),
    field({
      type: 'select',
      key: 'lembaga_type',
      label: 'Tipe Lembaga',
      options: { values: opt.lembaga },
      required: true,
      readOnly: !!view
    }),

    { section: 'Aturan & Status' },
    field({
      type: 'select',
      key: 'is_ujian',
      label: 'Kategori Ujian?',
      options: { values: opt.ujian },
      required: true,
      readOnly: !!view
    }),
    field({
      type: 'select',
      key: 'status',
      label: 'Status',
      options: { values: opt.status },
      readOnly: !!view
    }),
    field({
      type: 'textarea',
      key: 'keterangan',
      label: 'Keterangan Tambahan',
      readOnly: !!view
    }),

    fieldBuildSubmit({
      onCancel: () => router.push('/app/jenis-penilaian/list'),
      loading: store.loading,
      disabled: !!view
    })
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={id ? (view ? 'Detail Jenis Penilaian' : 'Edit Jenis Penilaian') : 'Tambah Jenis Penilaian'} />
          <Divider sx={{ m: '0 !important' }} />
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

export default JenisPenilaianForm
