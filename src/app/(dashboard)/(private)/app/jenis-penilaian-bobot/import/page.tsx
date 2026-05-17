'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'

import { useAppDispatch } from '@/redux-store/hook'
// Pastikan nama fungsi di bawah ini sesuai dengan slice bobot penilaian Anda
import { postBatch, postExport, postImport, resetRedux } from '../slice'

export interface ImportPayload {
  id_penilaian: string | null
  id_lembaga: string | null
  id_tingkat: string | null
  id_tahunajaran: string | null
  lembaga_type: 'FORMAL' | 'PESANTREN'
  bobot: number
  status: string
}

export interface ImportRow {
  row: number
  valid: boolean
  error: string | null
  payload: ImportPayload
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

export default function ImportExcelBobotPenilaianPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'preview' | 'commit'>('preview')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingImport, setLoadingImport] = useState(false)
  const [preview, setPreview] = useState<ImportPreviewResponse>()

  /** Navigasi kembali ke list bobot penilaian */
  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/jenis-penilaian-bobot/list')
  }, [dispatch, router])

  const downloadTemplate = async () => {
    try {
      const res = await dispatch(postExport({ template: 1 })).unwrap()

      if (res?.status && res?.data) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}${res.data}`
        const link = document.createElement('a')

        link.href = url
        link.download = ''
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

    const allowed = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

    if (!allowed.includes(file.type)) {
      toast.warning('File harus berformat Excel (.xls, .xlsx)')
      e.target.value = ''

      return
    }

    setFileName(file.name)
    setFile(file)
  }

  const onSubmit = async () => {
    if (!file) return alert('File belum dipilih')

    const formData = new FormData()
    formData.append('file_import', file)
    formData.append('mode', mode)

    try {
      setLoading(true)
      const res = await dispatch(postImport(formData)).unwrap()
      const { status, message, data } = res

      if (!status) {
        toast.warning(message)

        return
      }

      if (mode === 'preview') {
        setPreview(data)
      } else {
        toast.success('Import data berhasil')
        onCancel()
      }
    } catch (e) {
      console.error(e)
      toast.error('Gagal import')
    } finally {
      setLoading(false)
    }
  }

  const handleCommit = async () => {
    const payloads = preview?.data.map(d => d.payload)

    try {
      setLoadingImport(true)
      const res = await dispatch(postBatch({ data: payloads })).unwrap()
      const { status, message } = res

      if (!status) {
        toast.warning(message)

        return
      }

      toast.success('Import data bobot penilaian berhasil')
      onCancel()
    } catch (e) {
      console.error(e)
      toast.error('Gagal import data')
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
      <div className='rounded-lg border p-4 bg-white'>
        <div className='text-sm text-gray-500'>{title}</div>
        <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      </div>
    )
  }

  const ImportPreview = ({ result, onCommit }: Props) => {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-3 gap-4'>
          <SummaryCard title='Total Baris' value={result.total} />
          <SummaryCard title='Valid' value={result.valid} color='green' />
          <SummaryCard title='Invalid' value={result.invalid} color='red' />
        </div>

        <div className='overflow-x-auto rounded-lg border bg-white'>
          <table className='min-w-full text-xs whitespace-nowrap'>
            <thead className='bg-gray-100 text-left border-b'>
              <tr>
                <th className='px-4 py-3 font-semibold'>#</th>
                <th className='px-4 py-3 font-semibold'>ID Jenis Penilaian</th>
                <th className='px-4 py-3 font-semibold'>Tipe Lembaga</th>
                <th className='px-4 py-3 font-semibold'>ID Lembaga</th>
                <th className='px-4 py-3 font-semibold'>ID Tingkat</th>
                <th className='px-4 py-3 font-semibold'>ID Tahun Ajaran</th>
                <th className='px-4 py-3 font-semibold'>Bobot (%)</th>
                <th className='px-4 py-3 font-semibold'>Status</th>
                <th className='px-4 py-3 font-semibold'>Keterangan Error</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map(row => (
                <tr key={row.row} className={row.valid ? 'border-t bg-white hover:bg-gray-50' : 'border-t bg-red-50'}>
                  <td className='px-4 py-3'>{row.row}</td>
                  <td className='px-4 py-3 font-mono'>{row.payload.id_penilaian || '-'}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.payload.lembaga_type === 'FORMAL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {row.payload.lembaga_type}
                    </span>
                  </td>
                  <td className='px-4 py-3 font-mono'>{row.payload.id_lembaga || '-'}</td>
                  <td className='px-4 py-3 font-mono'>{row.payload.id_tingkat || '-'}</td>
                  <td className='px-4 py-3 font-mono'>{row.payload.id_tahunajaran || '-'}</td>
                  <td className='px-4 py-3 font-bold text-gray-800'>{row.payload.bobot}%</td>
                  <td className='px-4 py-3'>
                    {row.valid ? (
                      <span className='px-2 py-1 bg-green-100 text-green-700 rounded font-bold text-[9px] uppercase'>
                        ✓ Valid
                      </span>
                    ) : (
                      <span className='px-2 py-1 bg-red-100 text-red-700 rounded font-bold text-[9px] uppercase'>
                        ✕ Tidak Valid
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3'>
                    <span className='text-red-600 text-[10px] leading-tight block min-w-[350px] whitespace-normal'>
                      {row.error || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-end gap-3'>
          <Button size='small' variant='contained' onClick={onCommit} disabled={result.invalid > 0 || loadingImport}>
            {loadingImport ? 'Menyimpan...' : 'Konfirmasi & Simpan'}
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
            href='/app/jenis-penilaian-bobot/list'
            className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
          >
            <i className='tabler-arrow-back-up'></i> Kembali ke List Bobot Penilaian
          </Link>
          <h1 className='text-xl font-semibold mt-2 text-gray-800'>Import Bobot Penilaian</h1>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6 space-y-6'>
          <div className='border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm text-blue-700'>
            <h3 className='font-medium mb-2 font-bold'>Petunjuk Import Bobot Penilaian</h3>
            <ul className='list-disc list-inside space-y-1 opacity-90'>
              <li>Gunakan format file Excel terbaru (.xlsx) sesuai template master.</li>
              <li>
                Input data relasi menggunakan data <b>UUID / ID Master</b> yang valid dari sistem.
              </li>
              <li>
                Sistem akan memvalidasi agar akumulasi total bobot status <b>Aktif</b> pada kombinasi Lembaga, Tingkat,
                dan Tahun Ajaran yang sama tidak melebihi 100%.
              </li>
              <li>Jika kombinasi data relasi sudah ada di database, sistem akan melakukan pembaruan data (Upsert).</li>
            </ul>

            <div className='mt-3'>
              <a
                className='text-blue-600 underline hover:text-blue-400 cursor-pointer font-semibold'
                onClick={downloadTemplate}
              >
                <b>Download Template Excel Bobot Penilaian</b>
              </a>
            </div>
          </div>

          <div>
            <label className='block font-medium mb-2 text-sm text-gray-700'>Pilih Mode</label>
            <div className='flex gap-6 text-sm text-gray-600'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' checked={mode === 'preview'} onChange={() => setMode('preview')} />
                Preview (Cek Validitas & Aturan Bobot)
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' checked={mode === 'commit'} onChange={() => setMode('commit')} />
                Commit (Langsung Simpan)
              </label>
            </div>
          </div>

          {preview ? (
            <ImportPreview result={preview} onCommit={handleCommit} />
          ) : (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                className='border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-400 transition bg-gray-50'
              >
                <div className='flex flex-col items-center gap-3'>
                  <i className='tabler-file-spreadsheet text-4xl text-gray-400'></i>
                  <div className='text-sm text-gray-600'>
                    {fileName ? <b className='text-blue-600'>{fileName}</b> : 'Klik atau seret file Excel ke sini'}
                  </div>
                  <button type='button' className='px-4 py-1.5 bg-gray-800 text-white rounded-md text-xs font-medium'>
                    Pilih File Bobot
                  </button>
                </div>
                <input ref={fileRef} type='file' accept='.xlsx,.xls' className='hidden' onChange={onChangeFile} />
              </div>

              <Button
                size='small'
                fullWidth
                variant='contained'
                sx={{ height: 40, mt: 5 }}
                onClick={onSubmit}
                disabled={loading || !file}
              >
                {loading ? 'Sedang Memproses...' : mode === 'preview' ? 'Lihat Preview Data' : 'Proses Import Bobot'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
