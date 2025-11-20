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

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchSemesterById, postSemester, postSemesterUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { fetchTahunAjaranAll } from '../../tahun-ajaran/slice'

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

  const store = useAppSelector(state => state.semester)
  const storeTahunAjaran = useAppSelector(state => state.tahun_ajaran)

  interface FormData {
    nama_semester: string
    keterangan: string
    nomor_urut: any
    status: {
      value: string
      label: string
    }
    id_tahunajaran: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    nama_semester: '',
    keterangan: '',
    nomor_urut: '',
    status: {
      value: 'Aktif',
      label: 'Aktif'
    },
    id_tahunajaran: {
      value: '',
      label: ''
    }
  }

  const [state, setState] = useState<FormData>(defaultValues)

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({defaultValues})

  useEffect(() => {
    dispatch(fetchTahunAjaranAll())

    if (id) {
      dispatch(fetchSemesterById(id)).then(res => {
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
        postSemesterUpdate({
          id: id,
          param: { ...state, status: state.status.value }
        })
      )
    } else {
      dispatch(
        postSemester({
          ...state,
          status: state.status.value
        })
      )
    }
  }

  const onCancel = () => {
    dispatch(resetRedux())
    router.replace('/app/semester/list')
  }

  const fields = () => {
    return [
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
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_semester',
        label: 'Semester',
        placeholder: 'Input Semester',
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
      <CardHeader title='Form Semester' />
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
