'use client'

// ** React Imports
import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { formatDate } from 'date-fns/format'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchShiftPresensiById, postShiftPresensi, postShiftPresensiUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const statusOption = {
  values: [
    {
      label: 'Aktif',
      value: 'Aktif'
    },
    {
      label: 'Nonaktif',
      value: 'Nonaktif'
    }
  ]
}

const kategoriOption = {
  values: [
    {
      label: 'ASRAMA',
      value: 'ASRAMA'
    },
    {
      label: 'PEGAWAI',
      value: 'PEGAWAI'
    },
    {
      label: 'SHOLAT',
      value: 'SHOLAT'
    },
    {
      label: 'UMUM',
      value: 'UMUM'
    }
  ]
}

const setTime = (hour: number, minute = 0) => {
  const date = new Date()

  date.setHours(hour, minute, 0, 0)

  return date
}

const timeToDate = (time: any) => {
  if (!time) return null

  const [hour, minute] = time.split(':').map(Number)

  const date = new Date()

  date.setHours(hour, minute, 0, 0)

  return date
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.shift_presensi)

  interface FormData {
    kode_shift: string
    nama_shift: string
    kategori_shift: {
      value: string
      label: string
    }
    waktu_mulai: string
    waktu_selesai: string
    toleransi_menit: string
    is_wajib: boolean
    keterangan: string
    status: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    kode_shift: '',
    nama_shift: '',
    kategori_shift: {
      value: '',
      label: ''
    },
    waktu_mulai: '',
    waktu_selesai: '',
    toleransi_menit: '',
    is_wajib: false,
    keterangan: '',
    status: {
      value: 'Aktif',
      label: 'Aktif'
    }
  }

  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/shift-presensi/list')
  }, [dispatch, router])

  useEffect(() => {
    if (id) {
      dispatch(fetchShiftPresensiById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status)
          datas.kategori_shift = kategoriOption.values.find(r => r.value === datas.kategori_shift)
          datas.waktu_mulai = datas.waktu_mulai ? timeToDate(datas.waktu_mulai) : null
          datas.waktu_selesai = datas.waktu_selesai ? timeToDate(datas.waktu_selesai) : null

          setState(datas)
          reset(datas)
        }
      })
    }
  }, [dispatch, id, reset])

  useEffect(() => {
    if (!store.crud) return

    if (store.crud.status) {
      toast.success('Success saved')
      onCancel()
    } else {
      toast.error('Error saved: ' + store.crud.message)

      setLoading(false)
    }
  }, [onCancel, store])

  const onSubmit = () => {
    if (loading) return
    setLoading(true)

    if (id) {
      // update
      dispatch(
        postShiftPresensiUpdate({
          id: id,
          params: {
            ...state,
            status: state.status.value,
            kategori_shift: state.kategori_shift.value,
            waktu_mulai: formatDate(state.waktu_mulai, 'HH:mm'),
            waktu_selesai: formatDate(state.waktu_selesai, 'HH:mm'),
            toleransi_menit: parseInt(state.toleransi_menit)
          }
        })
      )
    } else {
      dispatch(
        postShiftPresensi({
          ...state,
          status: state.status.value,
          kategori_shift: state.kategori_shift.value,
          waktu_mulai: formatDate(state.waktu_mulai, 'HH:mm'),
          waktu_selesai: formatDate(state.waktu_selesai, 'HH:mm'),
          toleransi_menit: parseInt(state.toleransi_menit)
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'kode_shift',
        label: 'Kode Shift',
        placeholder: 'Input Kode Shift',
        required: true,
        readOnly: Boolean(view),
        options: {
          onChange: async (value: any) => {
            setValue('kode_shift', value.toUpperCase().trim())
          }
        }
      }),
      field({
        type: 'text',
        key: 'nama_shift',
        label: 'Nama Shift',
        placeholder: 'Input Nama Shift',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'kategori_shift',
        label: 'Kategori Shift',
        placeholder: 'Pilih Kategori Shift',
        required: true,
        options: kategoriOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'time',
        key: 'waktu_mulai',
        label: 'Waktu Mulai',
        placeholder: 'Input Waktu Mulai',
        required: true,
        readOnly: Boolean(view),
        options: {
          onChange: async (value: any) => {
            setValue('waktu_selesai', value)
          }
        }
      }),
      field({
        type: 'time',
        key: 'waktu_selesai',
        label: 'Waktu Selesai',
        placeholder: 'Input Waktu Selesai',
        required: true,
        readOnly: Boolean(view),
        minTime: state.waktu_mulai ? state.waktu_mulai : null,
        maxTime: state.waktu_mulai ? setTime(23, 59) : null
      }),
      field({
        type: 'numeral',
        key: 'toleransi_menit',
        label: 'Toleransi Menit',
        placeholder: 'Input Toleransi Menit',
        required: false,
        readOnly: Boolean(view)
      }),
      field({
        type: 'checkbox',
        key: 'is_wajib',
        label: 'Wajib',
        placeholder: 'Input Wajib',
        required: false,
        readOnly: Boolean(view)
      }),
      field({
        type: 'textarea',
        key: 'keterangan',
        label: 'Keterangan',
        placeholder: 'Input Keterangan',
        required: false,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'status',
        label: 'Status',
        placeholder: 'Pilih Status',
        required: true,
        options: statusOption,
        readOnly: Boolean(view)
      }),
      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })
    ]
  }

  return (
    <Card>
      <CardHeader title='Form Kelas Formal' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          {formColumn({
            control: control,
            errors: errors,
            state: state,
            setState: setState,
            fields: fields()
          })}
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationBasic
