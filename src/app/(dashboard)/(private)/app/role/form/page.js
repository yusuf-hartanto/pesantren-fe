"use client"

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

import { useDispatch, useSelector } from 'react-redux'

import { fetchRoleById, postRole, postRoleUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

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

const freeOption = {
  values: [
    {
      label: 'Ya',
      value: true
    },
    {
      label: 'Tidak',
      value: false
    }
  ]
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useDispatch()

  const store = useSelector(state => state.role)

  const [state, setState] = useState({})

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {

    if (id) {
      dispatch(fetchRoleById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status)
          console.log('prament', datas)
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
      if (store.crud?.errors) {
        store.crud?.errors?.forEach(e => {
          toast.error(e)
        })
      } else {
        toast.error('Error saved: ' + store.crud.message)
      }

      setLoading(false)
    }
  }, [store])

  const onSubmit = () => {
    if (loading) return
    setLoading(true)

    if (id) {
      // update
      dispatch(
        postRoleUpdate({
          id: id,
          param: { ...state, status: state.status.value }
        })
      )
    } else {
      dispatch(
        postRole({
          ...state,
          status: state.status.value
        })
      )
    }
  }

  const onCancel = () => {
    dispatch(resetRedux())
    router.replace('/app/role/list')
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'role_name',
        label: 'Role Name',
        placeholder: 'Input role name',
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
      <CardHeader title='Form Role' />
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
