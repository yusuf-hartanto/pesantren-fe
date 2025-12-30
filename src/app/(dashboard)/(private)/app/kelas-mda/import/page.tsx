'use client'

import { useRef, useState } from 'react'

import Link from 'next/link'

import { toast } from 'react-toastify'

import Button from '@mui/material/Button'

import { useAppDispatch } from '@/redux-store/hook'

import { postExport } from '../slice'

export default function ImportCSVPage() {
  const dispatch = useAppDispatch()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<'preview' | 'commit'>('commit')
  const [fileName, setFileName] = useState<string | null>(null)

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
    } finally {
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
      alert('File harus CSV atau Excel')
      e.target.value = ''

      return
    }

    setFileName(file.name)
  }

  const onSubmit = async () => {
    console.warn(mode, fileName, fileRef)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-6'>
          <Link
            href='/app/kelas-mda/list'
            className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
          >
            <i className='tabler-arrow-back-up'></i> Kembali
          </Link>
          <h1 className='text-xl font-semibold mt-2'>Import CSV</h1>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6 space-y-6'>
          <div className='border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm text-blue-700'>
            <h3 className='font-medium mb-2'>Petunjuk Import</h3>
            <ul className='list-disc list-inside space-y-1'>
              <li>Format file: CSV (encoding UTF-8)</li>
              <li>
                Jika <b>nama_kelas_mda</b> kosong → INSERT (data baru)
              </li>
              <li>
                Jika <b>nama_kelas_mda</b> ada → UPDATE (perbarui data)
              </li>
              <li>Mode Preview: hanya validasi tanpa menyimpan</li>
              <li>Mode Commit: validasi dan simpan ke database</li>
            </ul>

            <div className='mt-3'>
              <a className='text-blue-600 underline hover:text-blue-400 cursor-pointer' onClick={downloadTemplate}>
                <b>Download Template CSV</b>
              </a>
            </div>
          </div>

          <div>
            <label className='block font-medium mb-2'>Mode Import</label>
            <div className='flex gap-6 text-sm'>
              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='mode'
                  value='preview'
                  checked={mode === 'preview'}
                  onChange={() => setMode('preview')}
                />
                Preview (Validasi saja)
              </label>

              <label className='flex items-center gap-2'>
                <input
                  type='radio'
                  name='mode'
                  value='commit'
                  checked={mode === 'commit'}
                  onChange={() => setMode('commit')}
                />
                Commit (Simpan data)
              </label>
            </div>
          </div>

          <div>
            <label className='block font-medium mb-2'>File CSV</label>

            <div
              onClick={() => fileRef.current?.click()}
              className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition'
            >
              <div className='flex flex-col items-center gap-3'>
                <div className='text-gray-400'>
                  <i className='tabler-arrow-big-up'></i>
                </div>
                <div className='text-sm text-gray-600'>Klik untuk upload file CSV</div>

                <button type='button' className='px-2 py-1 bg-blue-600 text-white rounded-md text-sm'>
                  Pilih File
                </button>

                {fileName && <div className='text-xs text-gray-500 mt-2'>{fileName}</div>}
              </div>

              <input ref={fileRef} type='file' accept='.csv,.xls,.xlsx' className='hidden' onChange={onChangeFile} />
            </div>
          </div>

          <Button
            size='small'
            fullWidth
            variant='contained'
            sx={{ height: 32, fontSize: '0.75rem', px: 2 }}
            onClick={onSubmit}
            startIcon={<i className='tabler-file-import' />}
          >
            Import & Simpan
          </Button>
        </div>
      </div>
    </div>
  )
}
