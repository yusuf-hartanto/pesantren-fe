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
import { fetchProgramPesantrenById, postProgramPesantren, postProgramPesantrenUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const tipeOption = {
  values: [
    {
      label: 'Bahasa',
      value: 'Bahasa'
    },
    {
      label: 'Quran',
      value: 'Quran'
    },
    {
      label: 'Ibadah',
      value: 'Ibadah'
    },
    {
      label: 'Kepemimpinan',
      value: 'Kepemimpinan'
    },
    {
      label: 'Lainnya',
      value: 'Lainnya'
    }
  ]
}

const statusOption = {
  values: [
    {
      label: 'Ya',
      value: 'Ya'
    },
    {
      label: 'Tidak',
      value: 'Tidak'
    }
  ]
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.program_pesantren)

  interface FormData {
    tipe_program: {
      value: string
      label: string
    }
    nama_program: string
    wajib: number
    aktif: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    tipe_program: {
      value: 'Bahasa',
      label: 'Bahasa'
    },
    nama_program: '',
    wajib: 1,
    aktif: {
      value: 'Ya',
      label: 'Ya'
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
      dispatch(fetchProgramPesantrenById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.aktif = statusOption.values.find(r => r.value === datas.aktif)
          datas.tipe_program = tipeOption.values.find(r => r.value === datas.tipe_program)

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
        postProgramPesantrenUpdate({
          id: id,
          param: {
            ...state,
            aktif: state.aktif.value,
            tipe_program: state.tipe_program.value,
            wajib: state.wajib ? 1 : 0
          }
        })
      )
    } else {
      dispatch(
        postProgramPesantren({
          ...state,
          aktif: state.aktif.value,
          tipe_program: state.tipe_program.value,
          wajib: state.wajib ? 1 : 0
        })
      )
    }
  }

  const onCancel = () => {
    dispatch(resetRedux())
    router.replace('/app/program-pesantren/list')
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'tipe_program',
        label: 'Tipe Program',
        placeholder: 'Pilih Tipe Program',
        required: true,
        options: tipeOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_program',
        label: 'Nama Program',
        placeholder: 'Input Nama Program',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'checkbox',
        key: 'wajib',
        label: 'Wajib',
        placeholder: 'Pilih Wajib',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'aktif',
        label: 'Aktif',
        placeholder: 'Pilih Aktif',
        required: true,
        options: statusOption,
        readOnly: Boolean(view)
      }),
      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })
    ]
  }

  return (
    <Card>
      <CardHeader title='Form Program Pesantren' />
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
