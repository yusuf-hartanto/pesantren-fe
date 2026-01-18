"use client"

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

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { fetchLembagaAll, fetchGuruMataPelajaranById, postGuruMataPelajaran, postGuruMataPelajaranUpdate, resetRedux, fetchPegawaiAll } from '../slice/index'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchTingkatAll } from '../../tingkat/slice'
import { fetchMataPelajaranAll } from '../../mata-pelajaran/slice'

const statusOption = {
  values: [
    {
      label: 'Aktif',
      value: 'A'
    },
    {
      label: 'Nonaktif',
      value: 'N'
    }
  ]
}

const typeOption = {
  values: [
    {
      label: 'Formal',
      value: 'FORMAL'
    },
    {
      label: 'Pesantren',
      value: 'PESANTREN'
    }
  ]
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.guru_mata_pelajaran)
  const storeMapel = useAppSelector(state => state.mata_pelajaran)
  const storeTingkat = useAppSelector(state => state.tingkat)

  interface FormData {
    nama_jenis_guru: string
    keterangan: string
    status: {
      value: string
      label: string
    },
    lembaga_type: {
      value: string
      label: string
    },
    id_lembaga: {
      value: string
      label: string
    },
    id_guru: {
      value: string
      label: string
    },
    id_mapel: {
      value: string
      label: string
    },
    id_tingkat: {
      value: string
      label: string
    },
  }

  const defaultValues = {
    nama_jenis_guru: '',
    keterangan: '',
    status: {
      value: 'A',
      label: 'Aktif'
    },
    lembaga_type: {
      value: '',
      label: ''
    },
    id_lembaga: {
      value: '',
      label: ''
    },
    id_guru: {
      value: '',
      label: ''
    },
    id_mapel: {
      value: '',
      label: ''
    },
    id_tingkat: {
      value: '',
      label: ''
    },
  }

  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({defaultValues})

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/guru-mata-pelajaran/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchLembagaAll({}))
    dispatch(fetchPegawaiAll({}))
    dispatch(fetchMataPelajaranAll({}))
    dispatch(fetchTingkatAll({type: ''}))

    if (id) {
      dispatch(fetchGuruMataPelajaranById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.lembaga_type = typeOption.values.find(r => r.value === datas.lembaga_type)
          datas.status = statusOption.values.find(r => r.value === datas.status)
          datas.id_lembaga = {
            ...datas.lembaga_formal,
            label: datas?.lembaga_formal?.nama_lembaga,
            value: datas?.lembaga_formal?.id_lembaga,
          }
          datas.id_guru = {
            ...datas.pegawai,
            label: datas?.pegawai?.nama_lengkap,
            value: datas?.pegawai?.id_pegawai,
          }
          datas.id_mapel = {
            ...datas.mata_pelajaran,
            label: datas?.mata_pelajaran?.nama_mapel,
            value: datas?.mata_pelajaran?.id_mapel,
          }
          datas.id_tingkat = {
            ...datas.tingkat,
            label: datas?.tingkat?.tingkat,
            value: datas?.tingkat?.id_tingkat,
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
        postGuruMataPelajaranUpdate({
          id: id,
          params: {
            ...state,
            nama_jenis_guru: state.id_guru.label,
            status: state.status.value,
            lembaga_type: state.lembaga_type.value,
          }
        })
      )
    } else {
      dispatch(
        postGuruMataPelajaran({
          ...state,
          nama_jenis_guru: state.id_guru.label,
          status: state.status.value,
          lembaga_type: state.lembaga_type.value,
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'id_guru',
        label: 'Guru',
        placeholder: 'Pilih Guru',
        required: true,
        options: {
          values: store.pegawai.map(m => {
            return {
              label: m.nama_lengkap,
              value: m.id_pegawai
            }
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_mapel',
        label: 'Mata Pelajaran',
        placeholder: 'Pilih Mata Pelajaran',
        required: true,
        options: {
          values: storeMapel.datas.map(m => {
            return {
              label: m.nama_mapel,
              value: m.id_mapel
            }
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'lembaga_type',
        label: 'Tipe',
        placeholder: 'Pilih Tipe',
        required: true,
        options: typeOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_lembaga',
        label: 'Lembaga',
        placeholder: 'Pilih Lembaga',
        required: true,
        options: {
          values: store.lembaga.map(m => {
            return {
              label: m.nama_lembaga,
              value: m.id_lembaga
            }
          }),
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
          values: storeTingkat.datas.map(m => {
            return {
              label: m.tingkat,
              value: m.id_tingkat
            }
          }),
        },
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
      field({
        type: 'textarea',
        key: 'keterangan',
        label: 'Keterangan',
        placeholder: 'Input keterangan',
        required: false,
        readOnly: Boolean(view)
      }),
      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })
    ]
  }

  return (
    <>
      <Card>
        <CardHeader title='Form Guru Mata Pelajaran' />
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
    </>
  )
}

export default FormValidationBasic
