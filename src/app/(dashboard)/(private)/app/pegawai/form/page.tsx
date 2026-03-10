'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, Grid, Divider, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchPegawaiById, postPegawai, postPegawaiUpdate, resetRedux } from '../slice'
import { fetchOrgUnitPage } from '../../organisasi/slice'
import { fetchJabatanPage } from '../../jabatan/slice'

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { formatDate } from 'date-fns/format'

const PegawaiForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.pegawai)

  const [opt, setOpt] = useState<any>({
    units: [],
    jabatans: [],
    gender: [{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }],
    status: [{ label: 'Aktif', value: 'Aktif' }, { label: 'Tidak Aktif', value: 'Tidak Aktif' }, { label: 'Pensiun', value: 'Pensiun' }]
  })

  const [state, setState] = useState<any>({
    nama_lengkap: '',
    nik: '',
    nip: '',
    email: '',
    id_orgunit: null,
    id_jabatan: null,
    jenis_kelamin: null,
    status_pegawai: { label: 'Aktif', value: 'Aktif' },
    tanggal_lahir: '',
    umur: 0
  })

  const { control, handleSubmit, formState: { errors }, reset } = useForm({ values: state })

  const initForm = useCallback(async () => {
    try {
      const [resUnit, resJabatan] = await Promise.all([
        dispatch(fetchOrgUnitPage({ perPage: 1000 })).unwrap(),
        dispatch(fetchJabatanPage({ perPage: 1000 })).unwrap()
      ])

      const unitOpts = (resUnit?.data?.values || []).map((i: any) => ({ label: i.nama_orgunit, value: i.id_orgunit }))
      const jabOpts = (resJabatan?.data?.values || []).map((i: any) => ({ label: i.nama_jabatan, value: i.id_jabatan }))

      setOpt((prev: any) => ({ ...prev, units: unitOpts, jabatans: jabOpts }))

      if (id) {
        const resDetail = await dispatch(fetchPegawaiById(id)).unwrap()
        const d = resDetail?.data
        if (d) {
          const formatted = {
            ...d,
            id_orgunit: unitOpts.find((o: any) => o.value === d.id_orgunit),
            id_jabatan: jabOpts.find((o: any) => o.value === d.id_jabatan),
            jenis_kelamin: { label: d.jenis_kelamin, value: d.jenis_kelamin },
            status_pegawai: { label: d.status_pegawai, value: d.status_pegawai }
          }
          setState(formatted)
          reset(formatted)
        }
      }
    } catch (err) { toast.error("Gagal memuat referensi data") }
  }, [id, dispatch, reset])

  useEffect(() => { initForm() }, [initForm])

  useEffect(() => {
    if (store.crud) {
      if (store.crud.status) {
        toast.success(store.crud.message)
        dispatch(resetRedux())
        router.replace('/app/pegawai/list')
      } else {
        toast.error(store.crud.message)
        dispatch(resetRedux())
      }
    }
  }, [store.crud, dispatch, router])

  const onSubmit = () => {
    const payload = {
      ...state,
      id_orgunit: state.id_orgunit?.value,
      id_jabatan: state.id_jabatan?.value,
      jenis_kelamin: state.jenis_kelamin?.value,
      status_pegawai: state.status_pegawai?.value,
      tanggal_lahir: state.tanggal_lahir ? formatDate(state.tanggal_lahir, 'yyyy-MM-dd') : null,
      tmt: state.tmt ? formatDate(state.tmt, 'yyyy-MM-dd') : null
    }

    id ? dispatch(postPegawaiUpdate({ id, params: payload })) : dispatch(postPegawai([payload]))
  }

  const fields = () => [
    { section: 'Informasi Pribadi' },
    field({ type: 'text', key: 'nama_lengkap', label: 'Nama Lengkap', required: true, readOnly: !!view }),
    field({ type: 'text', key: 'nik', label: 'NIK', required: true, readOnly: !!view }),
    field({ type: 'text', key: 'nip', label: 'NIP', readOnly: !!view }),
    field({ type: 'select', key: 'jenis_kelamin', label: 'Jenis Kelamin', options: { values: opt.gender }, readOnly: !!view }),
    field({ type: 'date_custom', key: 'tanggal_lahir', label: 'Tanggal Lahir', readOnly: !!view }),
    field({ type: 'numeral', key: 'umur', label: 'Umur (Otomatis)', readOnly: true }),

    { section: 'Kontak & Alamat' },
    field({ type: 'text', key: 'email', label: 'Email', readOnly: !!view }),
    field({ type: 'text', key: 'no_hp', label: 'No. HP', readOnly: !!view }),
    field({ type: 'textarea', key: 'alamat', label: 'Alamat Lengkap', readOnly: !!view }),

    { section: 'Kepegawaian' },
    field({ type: 'select', key: 'id_orgunit', label: 'Unit Organisasi', options: { values: opt.units }, required: true, readOnly: !!view }),
    field({ type: 'select', key: 'id_jabatan', label: 'Jabatan', options: { values: opt.jabatans }, required: true, readOnly: !!view }),
    field({ type: 'select', key: 'status_pegawai', label: 'Status Pegawai', options: { values: opt.status }, readOnly: !!view }),
    field({ type: 'date_custom', key: 'tmt', label: 'TMT (Terhitung Mulai Tanggal)', readOnly: !!view }),

    fieldBuildSubmit({ onCancel: () => router.push('/app/pegawai/list'), loading: store.loading, disabled: !!view })
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={id ? (view ? 'Detail Pegawai' : 'Edit Pegawai') : 'Tambah Pegawai'} />
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

export default PegawaiForm
