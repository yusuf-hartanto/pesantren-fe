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

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchKelasMdaById, postKelasMda, postKelasMdaUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { fetchTahunAjaranAll } from '../../tahun-ajaran/slice'
import { fetchTingkatAll } from '../../tingkat/slice'

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

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.kelas_mda)
  const storeTahunAjaran = useAppSelector(state => state.tahun_ajaran)
  const storeTingkat = useAppSelector(state => state.tingkat)

  interface FormData {
    nama_kelas_mda: string
    id_lembaga: {
      value: string
      label: string
    }
    id_tahunajaran: {
      value: string
      label: string
    }
    id_tingkat: {
      value: string
      label: string
    }
    id_wali_kelas: {
      value: string
      label: string
    }
    keterangan: string
    nomor_urut: any
    status: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    nama_kelas_mda: '',
    id_lembaga: {
      value: '',
      label: ''
    },
    id_tahunajaran: {
      value: '',
      label: ''
    },
    id_tingkat: {
      value: '',
      label: ''
    },
    id_wali_kelas: {
      value: '',
      label: ''
    },
    keterangan: '',
    nomor_urut: '',
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
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/kelas-mda/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(
      fetchTahunAjaranAll({
        status: 'Aktif'
      })
    )

    dispatch(
      fetchTingkatAll({
        type: 'PESANTREN'
      })
    )

    if (id) {
      dispatch(fetchKelasMdaById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status) || { label: 'Arsip', value: 'Arsip' }
          datas.id_lembaga = {
            value: datas.lembaga.id_lembaga,
            label: datas.lembaga.nama_lembaga
          }
          datas.id_tahunajaran = {
            value: datas.tahun_ajaran.id_tahunajaran,
            label: datas.tahun_ajaran.tahun_ajaran
          }
          datas.id_tingkat = {
            value: datas.tingkat.id_tingkat,
            label: datas.tingkat.tingkat
          }
          datas.id_wali_kelas = {
            value: datas.pegawai.id_pegawai,
            label: datas.pegawai.nama_lengkap
          }

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
        postKelasMdaUpdate({
          id: id,
          params: { ...state, status: state.status.value, nomor_urut: parseInt(state.nomor_urut) }
        })
      )
    } else {
      dispatch(
        postKelasMda({
          ...state,
          status: state.status.value,
          nomor_urut: parseInt(state.nomor_urut)
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'nama_kelas_mda',
        label: 'Nama Kelas MDA',
        placeholder: 'Input Nama Kelas MDA',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_lembaga',
        label: 'Lembaga',
        placeholder: 'Pilih Lembaga',
        required: true,
        options: {
          values: [{ label: 'Dummy', value: '1' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_tingkat',
        label: 'Tingkat',
        placeholder: 'Pilih Tingkat',
        required: true,
        options: {
          values: storeTingkat.datas.map(r => {
            return {
              label: r.tingkat,
              value: r.id_tingkat
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_tahunajaran',
        label: 'Tahun Ajaran',
        placeholder: 'Pilih Tahun Ajaran',
        required: true,
        options: {
          values: storeTahunAjaran.datas.map(r => {
            return {
              label: r.tahun_ajaran,
              value: r.id_tahunajaran
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_wali_kelas',
        label: 'Wali Kelas',
        placeholder: 'Pilih Wali Kelas',
        required: true,
        options: {
          values: [{ label: 'Dummy', value: '1' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'numeral',
        key: 'nomor_urut',
        label: 'Nomor Urut',
        placeholder: 'Input Nomor Urut',
        required: true,
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
      <CardHeader title='Form Kelas MDA' />
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
