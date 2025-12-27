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
import { fetchOrangTuaWaliById, postOrangTuaWali, postOrangTuaWaliUpdate, resetRedux } from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const hubunganOption = {
  values: [
    {
      label: 'Ayah',
      value: 'Ayah'
    },
    {
      label: 'Ibu',
      value: 'Ibu'
    },
    {
      label: 'Wali',
      value: 'Wali'
    }
  ]
}

const pekerjaanOption = {
  values: [
    {
      label: 'Tidak Bekerja',
      value: 'Tidak Bekerja'
    },
    {
      label: 'Ibu Rumah Tangga',
      value: 'Ibu Rumah Tangga'
    },
    {
      label: 'Petani',
      value: 'Petani'
    },
    {
      label: 'Buruh Harian',
      value: 'Buruh Harian'
    },
    {
      label: 'Nelayan',
      value: 'Nelayan'
    },
    {
      label: 'Wiraswasta',
      value: 'Wiraswasta'
    },
    {
      label: 'Pedagang',
      value: 'Pedagang'
    },
    {
      label: 'Karyawan Swasta',
      value: 'Karyawan Swasta'
    },
    {
      label: 'PNS',
      value: 'PNS'
    },
    {
      label: 'TNI / POLRI',
      value: 'TNI / POLRI'
    },
    {
      label: 'Guru / Dosen',
      value: 'Guru / Dosen'
    },
    {
      label: 'Pekerja Migran',
      value: 'Pekerja Migran'
    },
    {
      label: 'Pensiunan',
      value: 'Pensiunan'
    },
    {
      label: 'Lainnya',
      value: 'Lainnya'
    }
  ]
}

const pendidikanOption = {
  values: [
    {
      label: 'Tidak Sekolah',
      value: 'Tidak Sekolah'
    },
    {
      label: 'SD / MI',
      value: 'SD / MI'
    },
    {
      label: 'SMP / MTs',
      value: 'SMP / MTs'
    },
    {
      label: 'SMA / MA',
      value: 'SMA / MA'
    },
    {
      label: 'SMK',
      value: 'SMK'
    },
    {
      label: 'D1',
      value: 'D1'
    },
    {
      label: 'D2',
      value: 'D2'
    },
    {
      label: 'D3',
      value: 'D3'
    },
    {
      label: 'S1',
      value: 'S1'
    },
    {
      label: 'S2',
      value: 'S2'
    },
    {
      label: 'S3',
      value: 'S3'
    },
    {
      label: 'Lainnya',
      value: 'Lainnya'
    }
  ]
}

const penghasilanOption = {
  values: [
    {
      label: '< 1 juta',
      value: '< 1 juta'
    },
    {
      label: '1–2 juta',
      value: '1–2 juta'
    },
    {
      label: '2–3 juta',
      value: '2–3 juta'
    },
    {
      label: '3–5 juta',
      value: '3–5 juta'
    },
    {
      label: '> 5 juta',
      value: '> 5 juta'
    },
    {
      label: 'Tidak berpenghasilan',
      value: 'Tidak berpenghasilan'
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
    nama_wali: string
    hubungan: string
    nik: string
    keterangan: string
    id_santri: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    nama_wali: '',
    hubungan: '',
    nik: '',
    keterangan: '',
    id_santri: {
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
    setValue,
    reset
  } = useForm({ defaultValues })

  useEffect(() => {
    if (id) {
      dispatch(fetchOrangTuaWaliById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
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
        postOrangTuaWaliUpdate({
          id: id,
          param: { ...state }
        })
      )
    } else {
      dispatch(
        postOrangTuaWali({
          ...state
        })
      )
    }
  }

  const onCancel = () => {
    dispatch(resetRedux())
    router.replace('/app/orang-tua-wali/list')
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'id_santri',
        label: 'Santri',
        placeholder: 'Pilih Santri',
        required: true,
        options: {
          values: [{ label: 'Dummy', value: '47304cb3-cf08-43a0-900c-7896ac33d973' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nama_wali',
        label: 'Nama Wali',
        placeholder: 'Input Nama Wali',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'hubungan',
        label: 'Hubungan',
        placeholder: 'Pilih Hubungan',
        required: true,
        options: hubunganOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'nik',
        label: 'Nik',
        placeholder: 'Input Nik',
        required: false,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'no_hp',
        label: 'No. Hp',
        placeholder: 'Input No. Hp',
        required: false,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'pendidikan',
        label: 'Pendidikan',
        placeholder: 'Pilih Pendidikan',
        required: true,
        options: pendidikanOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'pekerjaan',
        label: 'Pekerjaan',
        placeholder: 'Pilih Pekerjaan',
        required: true,
        options: pekerjaanOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'penghasilan',
        label: 'Penghasilan',
        placeholder: 'Pilih Penghasilan',
        required: true,
        options: penghasilanOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'province_id',
        label: 'Provinsi',
        placeholder: 'Pilih Provinsi',
        required: true,
        options: {
          values: [{ label: 'Aceh', value: '11' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'city_id',
        label: 'Kabupaten/Kota',
        placeholder: 'Pilih Kabupaten/Kota',
        required: true,
        options: {
          values: [{ label: 'Simuele', value: '11.09' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'district_id',
        label: 'Kabupaten/Kota',
        placeholder: 'Pilih Kabupaten/Kota',
        required: true,
        options: {
          values: [{ label: 'Teupah', value: '11.09.07' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'sub_district_id',
        label: 'Kelurahan',
        placeholder: 'Pilih Kelurahan',
        required: true,
        options: {
          values: [{ label: 'Latiung', value: '11.09.07.2008' }]
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'textarea',
        key: 'alamat',
        label: 'Alamat',
        placeholder: 'Input Alamat',
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

      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })
    ]
  }

  return (
    <Card>
      <CardHeader title='Form Orang Tua Wali' />
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
