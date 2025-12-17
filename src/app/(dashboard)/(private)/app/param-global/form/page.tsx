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
import { fetchParamGlobalById, postParamGlobal, postParamGlobalUpdate, resetRedux } from '../slice/index'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'

const statusOption = {
  values: [
    {
      label: 'Aktif',
      value: 1
    },
    {
      label: 'Nonaktif',
      value: 2
    }
  ]
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.param_global)

  interface FormData {
    param_key: string
    param_value: string
    param_desc: string
    status: {
      value: number
      label: string
    },
  }

  const defaultValues = {
    param_key: '',
    param_value: '',
    param_desc: '',
    status: {
      value: 1,
      label: 'Aktif'
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
    router.replace('/app/param-global/list')
  }, [dispatch, router])

  useEffect(() => {
    if (id) {
      dispatch(fetchParamGlobalById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
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
        postParamGlobalUpdate({
          id: id,
          params: {
            ...state,
            status: state.status.value,
          }
        })
      )
    } else {
      dispatch(
        postParamGlobal({
          ...state,
          status: state.status.value,
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'param_key',
        label: 'Key',
        placeholder: 'Input key',
        required: true,
        readOnly: Boolean(view) || Boolean(id)
      }),
      field({
        type: 'text',
        key: 'param_value',
        label: 'Value',
        placeholder: 'Input value',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'textarea',
        key: 'param_desc',
        label: 'Deskripsi',
        placeholder: 'Input dekripsi',
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
      <CardHeader title='Form ParamGlobal' />
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
