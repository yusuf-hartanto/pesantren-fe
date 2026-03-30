'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { fetchCabangById, postCabang, postCabangUpdate, resetRedux } from '../slice/index'
import {
  fetchProvinces,
  fetchRegenciesByProvince,
  fetchDistrictsByRegency,
  fetchSubDistrictsByDistrict
} from '../../areas/slice/index';

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'

const CabangForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')
  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.cabang)

  // State Lokal untuk Opsi Dropdown
  const [opt, setOpt] = useState({
    provinces: [] as any[],
    cities: [] as any[],
    districts: [] as any[],
    subDistricts: [] as any[]
  })

  const [state, setState] = useState<any>({
    nama_cabang: '',
    contact: '',
    email: '',
    alamat: '',
    keterangan: '',
    province_id: null,
    city_id: null,
    district_id: null,
    sub_district_id: null
  })

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    values: state // Menggunakan 'values' agar form sinkron dengan state lokal
  })

  const mapToDropdown = (data: any[]) => data?.map(item => ({ label: item.name, value: item.id })) || []

  /* -----------------------------------------------------------
     1. FLOW EDIT: Fetch Detail & Opsi Wilayah Secara Berurutan
  ----------------------------------------------------------- */
  const initForm = useCallback(async () => {
    try {
      // 1. Fetch Provinsi Selalu
      const resProv = await dispatch(fetchProvinces()).unwrap()
      const provinceOptions = mapToDropdown(resProv?.data)

      if (id) {
        // 2. Fetch Detail Cabang
        const resDetail = await dispatch(fetchCabangById(id)).unwrap()
        const d = resDetail?.data

        if (d) {
          // 3. Fetch Opsi Child secara paralel
          const [resCity, resDist, resSub] = await Promise.all([
            d.province_id ? dispatch(fetchRegenciesByProvince(d.province_id)).unwrap() : Promise.resolve(null),
            d.city_id ? dispatch(fetchDistrictsByRegency(d.city_id)).unwrap() : Promise.resolve(null),
            d.district_id ? dispatch(fetchSubDistrictsByDistrict(d.district_id)).unwrap() : Promise.resolve(null)
          ])

          const cityOptions = mapToDropdown(resCity?.data)
          const distOptions = mapToDropdown(resDist?.data)
          const subOptions = mapToDropdown(resSub?.data)

          // 4. Update daftar opsi ke state
          setOpt({
            provinces: provinceOptions,
            cities: cityOptions,
            districts: distOptions,
            subDistricts: subOptions
          })

          // 5. MAPPING: Cari object yang SAMA dari daftar opsi (Kunci utama Auto Select)
          const formatted = {
            ...d,
            province_id: provinceOptions.find(o => o.value === d.province_id) || null,
            city_id: cityOptions.find(o => o.value === d.city_id) || null,
            district_id: distOptions.find(o => o.value === d.district_id) || null,
            sub_district_id: subOptions.find(o => o.value === d.sub_district_id) || null,
          }

          // 6. Set state dan reset dengan delay kecil (agar UI sempat merender opsi)
          setState(formatted)
          setTimeout(() => {
            reset(formatted)
          }, 100)
        }
      } else {
        setOpt(prev => ({ ...prev, provinces: provinceOptions }))
      }
    } catch (err) {
      toast.error("Gagal memuat data")
    }
  }, [id, dispatch, reset])
  useEffect(() => {
    initForm()
  }, [initForm])


  /* -----------------------------------------------------------
     2. EVENT HANDLERS: Perubahan Dropdown (Reset Child)
  ----------------------------------------------------------- */

  const handleProvinceChange = async (val: any) => {
    setState((p: any) => ({ ...p, province_id: val, city_id: null, district_id: null, sub_district_id: null }))
    if (val?.value) {
      const res = await dispatch(fetchRegenciesByProvince(val.value)).unwrap()
      setOpt(prev => ({ ...prev, cities: mapToDropdown(res?.data), districts: [], subDistricts: [] }))
    }
  }

  const handleCityChange = async (val: any) => {
    setState((p: any) => ({ ...p, city_id: val, district_id: null, sub_district_id: null }))
    if (val?.value) {
      const res = await dispatch(fetchDistrictsByRegency(val.value)).unwrap()
      setOpt(prev => ({ ...prev, districts: mapToDropdown(res?.data), subDistricts: [] }))
    }
  }

  const handleDistrictChange = async (val: any) => {
    setState((p: any) => ({ ...p, district_id: val, sub_district_id: null }))
    if (val?.value) {
      const res = await dispatch(fetchSubDistrictsByDistrict(val.value)).unwrap()
      setOpt(prev => ({ ...prev, subDistricts: mapToDropdown(res?.data) }))
    }
  }

  /* -----------------------------------------------------------
     3. SUBMIT LOGIC
  ----------------------------------------------------------- */

  useEffect(() => {
    if (store.crud?.status) {
      toast.success(store.crud?.message || 'Data berhasil disimpan')
      dispatch(resetRedux())
      router.replace('/app/cabang/list')
    } else {
      if (store.crud?.message) {
        toast.error(store.crud?.message || 'Gagal menyimpan data lokasi')
      }

      dispatch(resetRedux())
    }
  }, [store.crud, dispatch, router])

  const onSubmit = () => {
    const payload = {
      ...state,
      province_id: state.province_id?.value,
      city_id: state.city_id?.value,
      district_id: state.district_id?.value,
      sub_district_id: state.sub_district_id?.value,
    }
    if (id) {
      dispatch(postCabangUpdate({ id, params: payload }))
    } else {
      dispatch(postCabang(payload))
    }
  }

  const fields = () => [
    field({ type: 'text', key: 'nama_cabang', label: 'Nama Cabang', required: true, readOnly: !!view }),

    // Dropdowns
    field({
      type: 'select',
      key: 'province_id',
      label: 'Provinsi',
      options: { values: opt.provinces },
      readOnly: !!view,
      onChange: handleProvinceChange
    }),
    field({
      type: 'select',
      key: 'city_id',
      label: 'Kota/Kabupaten',
      options: { values: opt.cities },
      disabled: !state.province_id,
      readOnly: !!view,
      onChange: handleCityChange
    }),
    field({
      type: 'select',
      key: 'district_id',
      label: 'Kecamatan',
      options: { values: opt.districts },
      disabled: !state.city_id,
      readOnly: !!view,
      onChange: handleDistrictChange
    }),
    field({
      type: 'select',
      key: 'sub_district_id',
      label: 'Kelurahan',
      options: { values: opt.subDistricts },
      disabled: !state.district_id,
      readOnly: !!view,
      onChange: (val: any) => setState((p: any) => ({ ...p, sub_district_id: val }))
    }),

    field({ type: 'textarea', key: 'alamat', label: 'Alamat Lengkap', required: true, readOnly: !!view }),
    field({ type: 'text', key: 'contact', label: 'Kontak', readOnly: !!view }),
    field({ type: 'text', key: 'email', label: 'Email', readOnly: !!view }),
    field({ type: 'textarea', key: 'keterangan', label: 'Keterangan', readOnly: !!view }),

    fieldBuildSubmit({ onCancel: () => router.push('/app/cabang/list'), loading: store.loading, disabled: !!view })
  ]

  return (
    <Card>
      <CardHeader title={id ? (view ? 'Detail Cabang' : 'Edit Cabang') : 'Tambah Cabang'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {formColumn({ control, errors, state, setState, fields: fields() })}
        </form>
      </CardContent>
    </Card>
  )
}

export default CabangForm
