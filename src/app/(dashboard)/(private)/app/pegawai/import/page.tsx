'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Button from '@mui/material/Button'

import { useAppDispatch } from '@/redux-store/hook'
// Pastikan nama fungsi di bawah ini sesuai dengan slice pegawai Anda
import { postBatch, postExport, postImport, resetRedux } from '../slice'

export interface ImportPayload {
  nik: string
  nip: string
  nama_lengkap: string
  email: string
  no_hp: string
  jenis_kelamin: string
  tempat_lahir: string
  tanggal_lahir: string
  pendidikan: string
  bidang_ilmu: string
  tmt: string
  status_pegawai: string
  foto: string
  alamat: string
  id_orgunit: string | null
  id_jabatan: string | null
  province_id: string | null
  city_id: string | null
  district_id: string | null
  sub_district_id: string | null
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

export default function ImportExcelPegawaiPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'preview' | 'commit'>('preview')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingImport, setLoadingImport] = useState(false)
  const [preview, setPreview] = useState<ImportPreviewResponse>()

  /** Navigasi kembali ke list pegawai */
  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/pegawai/list')
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

      toast.success('Import data pegawai berhasil')
      onCancel()
    } catch (e) {
      console.error(e)
      toast.error('Gagal simpan data')
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
    const colorMap = { gray: 'text-gray-800', green: 'text-green-600', red: 'text-red-600' }
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
                <th className='px-3 py-2'>#</th>
                <th className='px-3 py-2'>NIK / NIP</th>
                <th className='px-3 py-2'>Nama Lengkap</th>
                <th className='px-3 py-2'>Kontak</th>
                <th className='px-3 py-2'>Alamat</th> {/* Kolom Alamat murni */}
                <th className='px-3 py-2'>ID Wilayah</th> {/* Kolom Wilayah murni */}
                <th className='px-3 py-2'>L / P</th>
                <th className='px-3 py-2'>Lahir</th>
                <th className='px-3 py-2'>Pendidikan</th>
                <th className='px-3 py-2'>Unit / Jabatan</th>
                <th className='px-3 py-2'>TMT / Status</th>
                <th className='px-3 py-2'>Validasi</th>
                <th className='px-3 py-2'>Error</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {result.data.map(row => (
                <tr key={row.row} className={row.valid ? 'hover:bg-gray-50' : 'bg-red-50'}>
                  {/* 1. Nomor Row */}
                  <td className='px-3 py-2'>{row.row}</td>

                  {/* 2. NIK / NIP */}
                  <td className='px-3 py-2'>
                    <div className='font-mono text-[12px]'>
                      NIK: {row.payload.nik || '-'} <br />
                      NIP: {row.payload.nip || '-'}
                    </div>
                  </td>

                  {/* 3. Nama */}
                  <td className='px-3 py-2 font-medium'>{row.payload.nama_lengkap}</td>

                  {/* 4. Kontak */}
                  <td className='px-3 py-2'>
                    <div className='text-[12px]'>
                      {row.payload.email || '-'} <br />
                      {row.payload.no_hp || '-'}
                    </div>
                  </td>

                  {/* 5. Alamat (Murni Teks Alamat Jalan) */}
                  <td className='px-3 py-2'>
                    <div className='text-[12px] min-w-[200px] whitespace-normal leading-tight text-gray-700 font-medium'>
                      {row.payload.alamat || '-'}
                    </div>
                  </td>

                  {/* 6. ID Wilayah (Dibuat Grid Baris Bersih & Rapih) */}
                  <td className='px-3 py-2 text-[11px] font-mono'>
                    <div className='flex flex-col gap-1 min-w-[120px]'>
                      <div className='flex justify-between border-b border-gray-50 pb-0.5'>
                        <span className='text-gray-400 font-sans'>Prov:</span>
                        <span className='text-gray-700 font-semibold'>{row.payload.province_id || '-'}</span>
                      </div>
                      <div className='flex justify-between border-b border-gray-50 pb-0.5'>
                        <span className='text-gray-400 font-sans'>Kota:</span>
                        <span className='text-gray-700 font-semibold'>{row.payload.city_id || '-'}</span>
                      </div>
                      <div className='flex justify-between border-b border-gray-50 pb-0.5'>
                        <span className='text-gray-400 font-sans'>Kec :</span>
                        <span className='text-gray-700 font-semibold'>{row.payload.district_id || '-'}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400 font-sans'>Kel :</span>
                        <span className='text-gray-700 font-semibold'>{row.payload.sub_district_id || '-'}</span>
                      </div>
                    </div>
                  </td>

                  {/* 7. Jenis Kelamin */}
                  <td className='px-3 py-2'>{row.payload.jenis_kelamin}</td>

                  {/* 8. Tempat/Tanggal Lahir */}
                  <td className='px-3 py-2'>
                    <div className='text-[12px]'>
                      {row.payload.tempat_lahir}, <br />
                      {row.payload.tanggal_lahir}
                    </div>
                  </td>

                  {/* 9. Pendidikan */}
                  <td className='px-3 py-2'>
                    <div className='text-[12px]'>
                      {row.payload.pendidikan} <br />
                      <span className='text-gray-400'>{row.payload.bidang_ilmu}</span>
                    </div>
                  </td>

                  {/* 10. Org Unit / Jabatan */}
                  <td className='px-3 py-2 text-[12px]'>
                    Org: {row.payload.id_orgunit || '-'} <br />
                    Jab: {row.payload.id_jabatan || '-'}
                  </td>

                  {/* 11. TMT / Status Pegawai */}
                  <td className='px-3 py-2 text-[12px]'>
                    TMT: {row.payload.tmt || '-'} <br />
                    <span
                      className={`font-semibold ${row.payload.status_pegawai === 'Aktif' ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      {row.payload.status_pegawai || '-'}
                    </span>
                  </td>

                  {/* 12. Status Validasi */}
                  <td className='px-3 py-2'>
                    {row.valid ? (
                      <span className='px-2 py-1 bg-green-100 text-green-700 rounded font-bold text-[9px] uppercase'>
                        Valid
                      </span>
                    ) : (
                      <span className='px-2 py-1 bg-red-100 text-red-700 rounded font-bold text-[9px] uppercase'>
                        Tidak Valid
                      </span>
                    )}
                  </td>

                  {/* 13. Error Info */}
                  <td className='px-3 py-2'>
                    <span className='text-red-600 text-[12px] leading-tight block min-w-[300px] whitespace-normal'>
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
            href='/app/pegawai/list'
            className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
          >
            <i className='tabler-arrow-back-up'></i> Kembali ke List Pegawai
          </Link>
          <h1 className='text-xl font-semibold mt-2'>Import Data Pegawai</h1>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6 space-y-6'>
          <div className='border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm text-blue-700'>
            <h3 className='font-medium mb-2 font-bold'>Petunjuk Import Pegawai</h3>
            <ul className='list-disc list-inside space-y-1 opacity-90'>
              <li>Gunakan format file Excel (.xlsx) sesuai template.</li>
              <li>
                Pastikan <b>NIK</b> dan <b>NIP</b> bersifat unik dan tidak duplikat.
              </li>
              <li>Gunakan format tanggal YYYY-MM-DD (Contoh: 1990-08-17).</li>
              <li>
                Mode <b>Commit</b> akan langsung menyimpan data yang valid.
              </li>
            </ul>
            <div className='mt-3'>
              <a className='text-blue-600 underline hover:text-blue-400 cursor-pointer' onClick={downloadTemplate}>
                <b>Download Template Excel Pegawai</b>
              </a>
            </div>
          </div>

          <div>
            <label className='block font-medium mb-2 text-sm'>Pilih Mode</label>
            <div className='flex gap-6 text-sm'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' checked={mode === 'preview'} onChange={() => setMode('preview')} />
                Preview (Cek Validitas)
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
                  <button type='button' className='px-4 py-1.5 bg-gray-800 text-white rounded-md text-xs'>
                    Pilih File Pegawai
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
                {loading ? 'Sedang Memproses...' : mode === 'preview' ? 'Lihat Preview Data' : 'Proses Import Pegawai'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
