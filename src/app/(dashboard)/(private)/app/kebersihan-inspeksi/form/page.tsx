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

// ** Styled Component
import { formatDate } from 'date-fns/format'

import DatePickerWrapper from '@core/styles/libs/react-datepicker'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import {
  fetchKebersihanInspeksiById,
  postKebersihanInspeksi,
  postKebersihanInspeksiUpdate,
  resetRedux
} from '../slice/index'
import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { fetchCabangAll } from '../../cabang/slice'
import { fetchPegawaiAll } from '../../guru-mata-pelajaran/slice'
import { fetchLocationAll } from '../../location/slice'
import { fetchJadwalInspeksiKebersihanAll } from '../../jadwal-inspeksi-kebersihan/slice'
import { fetchMasterSlotWaktuAll } from '../../master-slot-waktu/slice'
import TemuanItemForm from '../../../../../../views/onevour/components/temuan-item-form'

const statusOption = {
  values: [
    {
      label: 'BERSIH',
      value: 'BERSIH'
    },
    {
      label: 'KOTOR',
      value: 'KOTOR'
    }
  ]
}

const timeToDate = (time: any) => {
  if (!time) return null

  const [hour, minute] = time.split(':').map(Number)

  const date = new Date()

  date.setHours(hour, minute, 0, 0)

  return date
}

const haris = [
  {
    label: 'Senin',
    value: 1
  },
  {
    label: 'Selasa',
    value: 2
  },
  {
    label: 'Rabu',
    value: 3
  },
  {
    label: 'Kamis',
    value: 4
  },
  {
    label: 'Jumat',
    value: 5
  },
  {
    label: 'Sabtu',
    value: 6
  },
  {
    label: 'Ahad',
    value: 7
  }
]

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.kebersihan_inspeksi)
  const storeCabang = useAppSelector(state => state.cabang)
  const storeLokasi = useAppSelector(state => state.location)
  const storePegawai = useAppSelector(state => state.guru_mata_pelajaran)
  const storeJadwal = useAppSelector(state => state.jadwal_inspeksi_kebersihan)
  const storeSlot = useAppSelector(state => state.master_slot_waktu)

  interface FormData {
    id_cabang: {
      value: string
      label: string
    }
    id_petugas: {
      value: string
      label: string
    }
    id_lokasi: {
      value: string
      label: string
    }
    id_jadwal: {
      value: string
      label: string
    }
    tanggal: Date
    waktu: Date
    kode_slot: {
      value: string
      label: string
    }
    catatan_umum: string
    status_kondisi: {
      value: string
      label: string
    }
    temuans: any[]
  }

  const defaultValues = {
    id_cabang: {
      value: '',
      label: ''
    },
    id_petugas: {
      value: '',
      label: ''
    },
    id_lokasi: {
      value: '',
      label: ''
    },
    id_jadwal: {
      value: '',
      label: ''
    },
    tanggal: new Date(),
    waktu: new Date(),
    kode_slot: {
      value: '',
      label: ''
    },
    catatan_umum: '',
    status_kondisi: {
      value: '',
      label: ''
    },
    temuans: []
  }

  interface FormItemData {
    values: any[]
    element_total: number
  }

  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)
  const [item, setItem] = useState<FormItemData>({ values: [], element_total: 0 })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/kebersihan-inspeksi/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchPegawaiAll({}))

    dispatch(fetchCabangAll({}))

    dispatch(fetchLocationAll({}))

    dispatch(fetchMasterSlotWaktuAll({ is_active: true }))

    if (id) {
      dispatch(fetchKebersihanInspeksiById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status_kondisi = statusOption.values.find(r => r.value === datas.status_kondisi)
          datas.kode_slot = {
            value: datas.kode_slot,
            label: datas.kode_slot
          }
          datas.waktu = datas.waktu ? timeToDate(datas.waktu) : null
          datas.id_cabang = {
            value: datas.cabang.id_cabang,
            label: datas.cabang.nama_cabang
          }
          datas.id_lokasi = {
            value: datas.lokasi.id_lokasi,
            label: datas.lokasi.nama_lokasi
          }
          datas.id_petugas = {
            value: datas.pegawai.id_pegawai,
            label: datas.pegawai.nama_lengkap
          }
          datas.id_jadwal = {
            value: datas.jadwal_inspeksi_kebersihan.id_jadwal,
            label: `${haris.find(d => d.value === datas.jadwal_inspeksi_kebersihan.hari)?.label}`
          }

          setItem({
            values: datas.temuans,
            element_total: datas.temuans.length
          })

          // get jadwal sesuai petugas
          dispatch(fetchJadwalInspeksiKebersihanAll({ is_active: 'true', id_petugas: datas.id_petugas.value }))

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
        postKebersihanInspeksiUpdate({
          id: id,
          params: {
            ...state,
            status_kondisi: state.status_kondisi.value,
            kode_slot: state.kode_slot.value,
            waktu: formatDate(state.waktu, 'HH:mm'),
            temuans: item.values.map(r => {
              return {
                kategori: r.kategori,
                tingkat: r.tingkat?.value ?? r.tingkat,
                perlu_tindak_lanjut: r.perlu_tindak_lanjut,
                deskripsi: r.deskripsi,
                foto_path: 'dummy'

                //foto_path: r.foto_path
              }
            })
          }
        })
      )
    } else {
      dispatch(
        postKebersihanInspeksi({
          ...state,
          status_kondisi: state.status_kondisi.value,
          kode_slot: state.kode_slot.value,
          waktu: formatDate(state.waktu, 'HH:mm'),
          temuans: item.values.map(r => {
            return {
              kategori: r.kategori,
              tingkat: r.tingkat?.value ?? r.tingkat,
              perlu_tindak_lanjut: r.perlu_tindak_lanjut,
              deskripsi: r.deskripsi,
              foto_path: 'dummy'

              //foto_path: r.foto_path
            }
          })
        })
      )
    }
  }

  const handleJadwal = (e: any) => {
    if (!e) return
    setValue('id_jadwal', {
      value: '',
      label: ''
    })
    setState(prevState => ({
      ...prevState,
      id_jadwal: {
        value: '',
        label: ''
      }
    }))
    dispatch(fetchJadwalInspeksiKebersihanAll({ is_active: 'true', id_petugas: e.value }))
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'id_cabang',
        label: 'Cabang',
        placeholder: 'Pilih Cabang',
        required: true,
        options: {
          values: storeCabang.datas.map(r => {
            return {
              label: r.nama_cabang,
              value: r.id_cabang
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_lokasi',
        label: 'Lokasi',
        placeholder: 'Pilih Lokasi',
        required: true,
        options: {
          values: storeLokasi.datas.map(r => {
            return {
              label: r.nama_lokasi,
              value: r.id_lokasi
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_petugas',
        label: 'Petugas',
        placeholder: 'Pilih Petugas',
        required: true,
        options: {
          values: storePegawai.pegawai.map(r => {
            return {
              label: r.nama_lengkap,
              value: r.id_pegawai
            }
          }),
          onChange: handleJadwal
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'id_jadwal',
        label: 'Jadwal',
        placeholder: 'Pilih Jadwal',
        required: false,
        options: {
          values: storeJadwal.datas.map(r => {
            return {
              label: `${haris.find(d => d.value === r.hari)?.label}`,
              value: r.id_jadwal
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'select',
        key: 'kode_slot',
        label: 'Slot',
        placeholder: 'Pilih Slot',
        required: true,
        options: {
          values: storeSlot.datas.map(r => {
            return {
              label: r.kode_slot,
              value: r.kode_slot
            }
          })
        },
        readOnly: Boolean(view)
      }),
      field({ type: 'date', key: 'tanggal', label: 'Tanggal', required: true, readOnly: Boolean(view) }),
      field({ type: 'time', key: 'waktu', label: 'Waktu', required: true, readOnly: Boolean(view) }),
      field({
        type: 'select',
        key: 'status_kondisi',
        label: 'Status Kondisi',
        placeholder: 'Pilih Status Kondisi',
        required: true,
        options: statusOption,
        readOnly: Boolean(view)
      }),
      field({
        type: 'textarea',
        key: 'catatan_umum',
        label: 'Catatan Umum',
        placeholder: 'Input Catatan Umum',
        required: false,
        readOnly: Boolean(view)
      })
    ]
  }

  const onAddTemuanDetail = (row: any) => {
    let values = [...item.values]

    if (row.edit) {
      values = values.filter(r => r.temuan_id !== row.temuan_id)
      values.push(row)
      setItem({
        values: values,
        element_total: values.length
      })
    } else {
      values.push(row)
      setItem({
        values: values,
        element_total: values.length
      })
    }
  }

  const onDeleteTemuanDetail = (id: string) => {
    const values = [...item.values]

    const index = values.findIndex(o => {
      return o.id === id
    })

    values.splice(index, 1)
    setItem({
      values: values,
      element_total: values.length
    })
  }

  return (
    <DatePickerWrapper>
      <Card>
        <CardHeader title='Form Kebersihan Inspeksi' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            {formColumn({
              control: control,
              errors: errors,
              state: state,
              setState: setState,
              fields: fields()
            })}
            <TemuanItemForm
              temuanDetailsSelected={item.values}
              onAddTemuanDetail={onAddTemuanDetail}
              onDeleteTemuanDetail={onDeleteTemuanDetail}
            />
            {formColumn({
              control: control,
              errors: errors,
              state: state,
              setState: setState,
              fields: [fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: Boolean(view) })]
            })}
          </form>
        </CardContent>
      </Card>
    </DatePickerWrapper>
  )
}

export default FormValidationBasic
