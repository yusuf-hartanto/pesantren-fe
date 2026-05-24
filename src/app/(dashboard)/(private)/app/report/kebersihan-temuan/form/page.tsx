'use client'

// ** React Imports
import React, { useCallback, useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchKebersihanTemuanById, resetRedux } from '../../../kebersihan-temuan/slice/index'
import { field, formColumn, fieldBuildSubmit } from '@views/onevour/form/AppFormBuilder'
import { fetchKebersihanInspeksiAll } from '../../../kebersihan-inspeksi/slice'

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const dispatch = useAppDispatch()
  const storeInspeksi = useAppSelector(state => state.kebersihan_inspeksi)

  interface FormData {
    id_inspeksi: {
      value: string
      label: string
    } | null
    kategori: string
    deskripsi: string
    tingkat: {
      value: number
      label: string
    } | null
    perlu_tindak_lanjut: boolean
    foto_path: string
  }

  const defaultValues = {
    id_inspeksi: null,
    kategori: '',
    deskripsi: '',
    tingkat: null,
    perlu_tindak_lanjut: false,
    foto_path: ''
  }

  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/report/kebersihan-temuan/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchKebersihanInspeksiAll({}))

    if (id) {
      dispatch(fetchKebersihanTemuanById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          const tanggalArr = datas.kebersihan_inspeksi?.tanggal?.split('-') ?? []

          datas.petugas = datas.kebersihan_inspeksi?.pegawai?.nama_lengkap
          datas.id_inspeksi = {
            value: datas.kebersihan_inspeksi?.id_inspeksi,
            label: `${datas.kebersihan_inspeksi?.cabang.nama_cabang} - ${datas.kebersihan_inspeksi?.lokasi?.nama_lokasi} - ${tanggalArr[2]}/${tanggalArr[1]}/${tanggalArr[0]} - ${datas.kebersihan_inspeksi?.waktu.slice(0, -3)}`
          }

          datas.tingkat = convertOptionTingkat().find(d => d.value === datas.tingkat)

          setState(datas)
          reset(datas)
        }
      })
    }
  }, [dispatch, id, reset])

  const convertOptionTingkat = () => {
    return [
      {
        label: 'Ringan',
        value: 1
      },
      {
        label: 'Sedang',
        value: 2
      },
      {
        label: 'Berat',
        value: 3
      }
    ]
  }

  const fields = () => {
    return [
      field({
        type: 'text',
        key: 'petugas',
        label: 'Petugas',
        placeholder: 'Input Petugas',
        readOnly: true
      }),
      field({
        type: 'select',
        key: 'id_inspeksi',
        label: 'Inspeksi',
        placeholder: 'Pilih Inspeksi',
        required: true,
        options: {
          values: storeInspeksi.datas.map(r => {
            const tanggalArr = r.tanggal?.split('-')

            return {
              label: `${r.cabang?.nama_cabang} - ${r.lokasi?.nama_lokasi} - ${tanggalArr[2]}/${tanggalArr[1]}/${tanggalArr[0]} - ${r.waktu.slice(0, -3)}`,
              value: r.id_inspeksi
            }
          })
        },
        readOnly: true
      }),
      field({
        type: 'text',
        key: 'kategori',
        label: 'Kategori',
        placeholder: 'Input Kategori',
        readOnly: true
      }),
      field({
        type: 'select',
        key: 'tingkat',
        label: 'Tingkat',
        placeholder: 'Input Tingkat',
        options: {
          values: convertOptionTingkat()
        },
        readOnly: true
      }),
      field({
        type: 'textarea',
        key: 'deskripsi',
        label: 'Deskripsi',
        placeholder: 'Input Deskripsi',
        required: false,
        readOnly: true
      }),
      field({
        type: 'image',
        key: 'foto_path',
        label: 'Foto',
        placeholder: 'Upload foto',
        urlImage: '',
        required: false,
        readOnly: true
      }),
      field({
        type: 'checkbox',
        key: 'perlu_tindak_lanjut',
        label: 'Perlu Tindak Lanjut',
        placeholder: 'Input Perlu Tindak Lanjut',
        readOnly: true
      }),
      fieldBuildSubmit({ onCancel: onCancel, loading: loading, disabled: true, cancel: 'Kembali' })
    ]
  }

  return (
    <Card>
      <CardHeader title='Inspeksi Temuan' />
      <CardContent>
        <form autoComplete='off'>
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
