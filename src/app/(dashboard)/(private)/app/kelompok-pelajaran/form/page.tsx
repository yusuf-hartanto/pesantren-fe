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
import { fetchKelompokPelajaranAll, fetchKelompokPelajaranById, postKelompokPelajaran, postKelompokPelajaranUpdate, resetRedux } from '../slice/index'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'

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

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.kelompok_pelajaran)

  interface FormData {
    nama_kelpelajaran: string
    keterangan: string
    nomor_urut: string
    status: {
      value: string
      label: string
    },
    parent_id: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    nama_kelpelajaran: '',
    keterangan: '',
    nomor_urut: '',
    status: {
      value: 'A',
      label: 'Aktif'
    },
    parent_id: {
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
    router.replace('/app/kelompok-pelajaran/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchKelompokPelajaranAll({ parent: '1' }))

    if (id) {
      dispatch(fetchKelompokPelajaranById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status)

          if (datas.parent) {
            datas.parent_id = {
              value: datas.parent.id_kelpelajaran,
              label: datas.parent.nama_kelpelajaran,
            }
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
        postKelompokPelajaranUpdate({
          id: id,
          params: {
            ...state,
            status: state.status.value,
            parent_id: state.parent_id.value,
          }
        })
      )
    } else {
      dispatch(
        postKelompokPelajaran({
          ...state,
          status: state.status.value,
          parent_id: state.parent_id.value,
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'parent_id',
        label: 'Parent',
        placeholder: 'Pilih Parent',
        required: true,
        options: {
          values: store.datas.map(m => {
            return {
              label: m.nama_kelpelajaran,
              value: m.id_kelpelajaran
            }
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_kelpelajaran',
        label: 'Name',
        placeholder: 'Input nama',
        required: true,
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
        <CardHeader title='Form Kelompok Mata Pelajaran' />
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
