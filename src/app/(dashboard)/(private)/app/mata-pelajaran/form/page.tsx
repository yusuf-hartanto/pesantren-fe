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
import { fetchLembagaAll, fetchMataPelajaranById, postMataPelajaran, postMataPelajaranUpdate, resetRedux } from '../slice/index'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchKelompokPelajaranAll } from '../../kelompok-pelajaran/slice'

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

  const store = useAppSelector(state => state.mata_pelajaran)
  const storeKelpel = useAppSelector(state => state.kelompok_pelajaran)

  interface FormData {
    kode_mapel: string
    nama_mapel: string
    keterangan: string
    kkm: string
    status: {
      value: string
      label: string
    },
    lembaga_type: {
      value: string
      label: string
    },
    lembaga: {
      value: string
      label: string
    },
    kelompok: {
      value: string
      label: string
    },
  }

  const defaultValues = {
    kode_mapel: '',
    nama_mapel: '',
    keterangan: '',
    kkm: '',
    status: {
      value: 'A',
      label: 'Aktif'
    },
    lembaga_type: {
      value: '',
      label: ''
    },
    lembaga: {
      value: '',
      label: ''
    },
    kelompok: {
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
    router.replace('/app/mata-pelajaran/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchLembagaAll({}))
    dispatch(fetchKelompokPelajaranAll({}))

    if (id) {
      dispatch(fetchMataPelajaranById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.lembaga_type = typeOption.values.find(r => r.value === datas.lembaga_type)
          datas.status = statusOption.values.find(r => r.value === datas.status)

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
        postMataPelajaranUpdate({
          id: id,
          params: {
            ...state,
            status: state.status.value,
            lembaga_type: state.lembaga_type.value,
            lembaga: state.lembaga.value,
            kelompok: state.kelompok.value,
          }
        })
      )
    } else {
      dispatch(
        postMataPelajaran({
          ...state,
          status: state.status.value,
          lembaga_type: state.lembaga_type.value,
          lembaga: state.lembaga.value,
          kelompok: state.kelompok.value,
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'kode_mapel',
        label: 'Kode',
        placeholder: 'Input kode',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_mapel',
        label: 'Name',
        placeholder: 'Input nama',
        required: true,
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
        key: 'id_kelpelajaran',
        label: 'Kelompok',
        placeholder: 'Pilih Kelompok',
        required: true,
        options: {
          values: storeKelpel.datas.map(m => {
            return {
              label: m.nama_kelpelajaran,
              value: m.id_kelpelajaran
            }
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'numeral',
        key: 'kkm',
        label: 'KKM',
        placeholder: 'Input KKM',
        required: true,
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
        <CardHeader title='Form Mata Pelajaran' />
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
