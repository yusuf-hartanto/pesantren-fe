'use client'

// ** React Imports
import React, { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchJenisBeasiswaById, postJenisBeasiswa, postJenisBeasiswaUpdate, resetRedux } from '../slice/index'
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

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.jenis_beasiswa)

  interface FormData {
    kode_beasiswa: string
    nama_beasiswa: string
    keterangan: string
    nomor_urut: any
    status: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    kode_beasiswa: '',
    nama_beasiswa: '',
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

  useEffect(() => {
    if (id) {
      dispatch(fetchJenisBeasiswaById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status)

          //console.log('prament', datas)

          setState(datas)
          reset(datas)
        }
      })
    }
  }, [dispatch, reset])

  useEffect(() => {
    if (!store.crud) return

    if (store.crud.status) {
      toast.success('Success saved')
      onCancel()
    } else {
      toast.error('Error saved: ' + store.crud.message)

      setLoading(false)
    }
  }, [store])

  const onSubmit = () => {
    if (loading) return
    setLoading(true)

    if (id) {
      // update
      dispatch(
        postJenisBeasiswaUpdate({
          id: id,
          param: { ...state, status: state.status.value }
        })
      )
    } else {
      dispatch(
        postJenisBeasiswa({
          ...state,
          status: state.status.value
        })
      )
    }
  }

  const onCancel = () => {
    dispatch(resetRedux())
    router.replace('/app/jenis-beasiswa/list')
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'kode_beasiswa',
        label: 'Kode Beasiswa',
        placeholder: 'Input Kode Beasiswa',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_beasiswa',
        label: 'Nama Beasiswa',
        placeholder: 'Input Nama Beasiswa',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'keterangan',
        label: 'Keterangan',
        placeholder: 'Input Keterangan',
        required: false,
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
      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })
    ]
  }

  return (
    <Card>
      <CardHeader title='Form Jenis Beasiswa' />
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
