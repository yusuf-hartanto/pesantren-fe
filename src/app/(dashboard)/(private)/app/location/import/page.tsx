'use client'

import { useCallback, useRef, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'
import Button from '@mui/material/Button'

import { useAppDispatch } from '@/redux-store/hook'
import { postImportLocation, postExportLocation, resetRedux, postBatch } from '../slice'

/* --------------------------
  Interfaces & Types
--------------------------- */
export interface LocationImportPayload {
  nama_lokasi: string
  jenis_lokasi: string
  parent: string | null
  cabang: string | null
  latitude: string | number | null
  longitude: string | number | null
  map_zoom: number | null
  kode_lokasi: string
  kapasitas: number | null
  lantai: string | number | null
  keterangan: string | null
  parent_nama: string | null
  cabang_nama: string | null
}

export interface ImportRow {
  row: number
  valid: boolean
  error: string | null
  payload: LocationImportPayload
}

export interface ImportPreviewResponse {
  mode: 'preview' | 'commit'
  total: number
  valid: number
  invalid: number
  data: ImportRow[]
}

interface Props {
  result: ImportPreviewResponse
  onCommit: () => void
}

/* --------------------------
  Main Component
--------------------------- */
export default function ImportLocationPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'preview' | 'commit'>('preview')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingImport, setLoadingImport] = useState(false)
  const [preview, setPreview] = useState<ImportPreviewResponse>()

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/location/list')
  }, [dispatch, router])

  const downloadTemplate = async () => {
    try {
      const res = await dispatch(postExportLocation({ template: 1 })).unwrap()

      if (res?.status && res?.data) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}${res.data}`
        const link = document.createElement('a')

        link.href = url
        link.download = 'Template_Import_Lokasi.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch {
      toast.error('Gagal download template')
    }
  }

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowed = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowed.includes(file.type)) {
      toast.warning('File harus Excel (.xls, .xlsx) atau CSV')
      e.target.value = ''

      return
    }

    setFileName(file.name)
    setFile(file)
  }

  const onSubmit = async () => {
    if (!file) return toast.error('File belum dipilih')

    const formData = new FormData()

    formData.append('file_import', file)
    formData.append('mode', mode)

    try {
      setLoading(true)
      const res = await dispatch(postImportLocation(formData)).unwrap()
      const { status, message, data } = res

      if (!status) {
        toast.warning(message)

        return
      }

      if (mode == 'preview') {
        setPreview(data)
      } else {
        toast.success('Import data lokasi berhasil')
        onCancel()
      }
    } catch (e) {
      console.error(e)
      toast.error('Gagal import data')
    } finally {
      setLoading(false)
    }
  }

  const handleCommit = async () => {
    const payloads = preview?.data.map(d => d.payload)

    try {
      setLoadingImport(true)
      const res = await dispatch(postBatch({ data: payloads, mode: 'commit' })).unwrap()

      if (!res.status) {
        toast.warning(res.message)
        
return
      }

      toast.success('Simpan data lokasi berhasil')
      onCancel()
    } catch (e) {
      toast.error('Gagal menyimpan data import')
    } finally {
      setLoadingImport(false)
    }
  }

  const SummaryCard = ({
    title,
    value,
    color = 'gray'
  }: {
    title: string
    value: number
    color?: 'gray' | 'green' | 'red'
  }) => {
    const colorMap = {
      gray: 'text-gray-800',
      green: 'text-green-600',
      red: 'text-red-600'
    }

    return (
      <div className='rounded-lg border p-4'>
        <div className='text-sm text-gray-500 font-medium'>{title}</div>
        <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      </div>
    )
  }

  const ImportPreview = ({ result, onCommit }: Props) => {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-3 gap-4'>
          <SummaryCard title='Total Data' value={result.total} />
          <SummaryCard title='Valid' value={result.valid} color='green' />
          <SummaryCard title='Invalid' value={result.invalid} color='red' />
        </div>

        <div className='overflow-x-auto rounded-lg border'>
          <table className='min-w-full text-[11px] lg:text-xs'>
            <thead className='bg-gray-100 text-left uppercase tracking-wider'>
              <tr>
                <th className='px-3 py-3'>#</th>
                <th className='px-3 py-3'>Nama Lokasi / Kode</th>
                <th className='px-3 py-3'>Jenis / Lantai</th>
                <th className='px-3 py-3'>Parent / Cabang</th>
                <th className='px-3 py-3'>Koordinat & Zoom</th>
                <th className='px-3 py-3'>Kapasitas</th>
                <th className='px-3 py-3'>Validasi</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {result.data.map(row => (
                <tr key={row.row} className={row.valid ? 'bg-white hover:bg-gray-50 transition' : 'bg-red-50'}>
                  <td className='px-3 py-2 text-gray-400'>{row.row}</td>
                  <td className='px-3 py-2'>
                    <div className='font-bold text-gray-800'>{row.payload.nama_lokasi}</div>
                    <div className='font-mono text-[10px] text-blue-600'>{row.payload.kode_lokasi}</div>
                  </td>
                  <td className='px-3 py-2'>
                    <div>{row.payload.jenis_lokasi}</div>
                    <div className='text-gray-500'>Lt. {row.payload.lantai ?? '-'}</div>
                  </td>
                  <td className='px-3 py-2'>
                    <div className='text-[10px]'>P: {row.payload.parent_nama ?? '-'}</div>
                    <div className='text-[10px]'>C: {row.payload.cabang_nama ?? '-'}</div>
                  </td>
                  <td className='px-3 py-2 font-mono text-[10px] text-gray-500'>
                    <div>{row.payload.latitude ?? 0}, {row.payload.longitude ?? 0}</div>
                    <div>Zoom: {row.payload.map_zoom ?? '-'}</div>
                  </td>
                  <td className='px-3 py-2 text-center font-medium'>
                    {row.payload.kapasitas ?? 0}
                  </td>
                  <td className='px-3 py-2'>
                    {row.valid ? (
                      <span className='text-green-600 font-semibold flex items-center gap-1'>
                        <i className='tabler-check'></i>
                      </span>
                    ) : (
                      <span className='text-red-600 text-[10px] italic leading-tight block'>{row.error}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            size='small'
            variant='contained'
            sx={{ height: 32, fontSize: '0.75rem', px: 2 }}
            onClick={onCommit}
            disabled={result.invalid > 0 || loadingImport}
            startIcon={<i className='tabler-file-import' />}
          >
            {loadingImport ? 'Menyimpan...' : 'Import Data Lokasi'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <Link
            href='/app/location/list'
            className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition'
          >
            <i className='tabler-arrow-back-up'></i> Kembali
          </Link>
          <h1 className='text-xl font-bold mt-2 text-gray-800'>Import Location Excel</h1>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6 space-y-6'>
          <div className='border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm text-blue-700'>
            <h3 className='font-bold mb-2 flex items-center gap-2'>
              <i className='tabler-info-circle'></i> Petunjuk Import Lokasi
            </h3>
            <ul className='list-disc list-inside space-y-1 ml-1 text-xs'>
              <li>Format file: Excel (.xlsx atau .xls) dengan encoding UTF-8.</li>
              <li>Sistem menggunakan <b>Kode Lokasi</b> sebagai identifier unik.</li>
              <li>Jika <b>Kode Lokasi</b> sudah ada di database → Sistem melakukan <b>UPDATE</b>.</li>
              <li>Pastikan <b>Parent</b> dan <b>Cabang</b> merujuk pada Kode Lokasi yang sudah terdaftar.</li>
              <li>Koordinat menggunakan format desimal (contoh: -6.12345, 106.12345).</li>
            </ul>

            <div className='mt-3'>
              <a className='text-blue-600 underline hover:text-blue-400 cursor-pointer font-bold' onClick={downloadTemplate}>
                Download Template Excel Lokasi
              </a>
            </div>
          </div>

          <div>
            <label className='block font-bold text-sm mb-3'>Pilih Mode Import</label>
            <div className='flex gap-8 text-sm'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='mode'
                  className='w-4 h-4 text-blue-600'
                  value='preview'
                  checked={mode === 'preview'}
                  onChange={() => setMode('preview')}
                />
                <span className={mode === 'preview' ? 'font-bold' : ''}>Preview (Hanya Validasi)</span>
              </label>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='mode'
                  className='w-4 h-4 text-blue-600'
                  value='commit'
                  checked={mode === 'commit'}
                  onChange={() => setMode('commit')}
                />
                <span className={mode === 'commit' ? 'font-bold' : ''}>Commit (Langsung Simpan)</span>
              </label>
            </div>
          </div>

          {preview ? (
            <ImportPreview result={preview} onCommit={handleCommit} />
          ) : (
            <div className='space-y-4'>
              <label className='block font-bold text-sm'>File Excel</label>

              <div
                onClick={() => fileRef.current?.click()}
                className='border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all'
              >
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                    <i className='tabler-upload text-2xl text-gray-400'></i>
                  </div>
                  <div className='text-sm text-gray-600 font-medium'>Klik untuk pilih file Excel Lokasi</div>

                  <button type='button' className='px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition'>
                    Pilih File
                  </button>

                  {fileName && (
                    <div className='mt-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200'>
                      <i className='tabler-file-check'></i> {fileName}
                    </div>
                  )}
                </div>

                <input ref={fileRef} type='file' accept='.xls,.xlsx,.csv' className='hidden' onChange={onChangeFile} />
              </div>

              <Button
                size='small'
                fullWidth
                variant='contained'
                sx={{ height: 40, fontSize: '0.875rem', fontWeight: 'bold', borderRadius: '8px' }}
                onClick={onSubmit}
                startIcon={<i className='tabler-circle-check' />}
              >
                {loading ? 'Sedang Memproses..' : mode === 'preview' ? 'Preview Data Lokasi' : 'Import & Simpan Sekarang'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
