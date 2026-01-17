"use client"

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

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import { Typography } from '@mui/material'

import { field, fieldBuildSubmit, formColumn } from '@views/onevour/form/AppFormBuilder'
import { fetchMenuAll, fetchMenuById, postMenu, postMenuUpdate, resetRedux } from '../slice/index'
import { useAppDispatch, useAppSelector } from '@/redux-store/hook'
import { getAllTablerIcons } from '@/@core/utils/globalHelpers'

const statusOption = {
  values: [
    {
      label: 'Nonaktif',
      value: 0
    },
    {
      label: 'Aktif',
      value: 1
    },
  ]
}

const FormValidationBasic = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const view = searchParams.get('view')

  const dispatch = useAppDispatch()

  const store = useAppSelector(state => state.menu)

  interface FormData {
    menu_name: string
    status: {
      value: number
      label: string
    },
    parent_id: {
      value: string
      label: string
    }
  }

  const defaultValues = {
    menu_name: '',
    status: {
      value: 1,
      label: 'Aktif'
    },
    parent_id: {
      value: '',
      label: ''
    },
  }

  const INITIAL_ICON_LIMIT = 120
  const [state, setState] = useState<FormData>(defaultValues)
  const [loading, setLoading] = useState(false)
  const [openIconPicker, setOpenIconPicker] = useState(false)
  const [iconKeyword, setIconKeyword] = useState('')
  const [allIcons, setAllIcons] = useState<string[]>([])
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({defaultValues})

  const onCancel = useCallback(() => {
    dispatch(resetRedux())
    router.replace('/app/menu/list')
  }, [dispatch, router])

  useEffect(() => {
    dispatch(fetchMenuAll({ parent: '1' }))

    if (typeof window !== 'undefined') {
      setAllIcons(getAllTablerIcons())
    }

    if (id) {
      dispatch(fetchMenuById(id)).then(res => {
        const datas = { ...res?.payload?.data }

        if (datas) {
          datas.status = statusOption.values.find(r => r.value === datas.status)

          if (datas.parent) {
            datas.parent_id = {
              value: datas.parent.menu_id,
              label: datas.parent.menu_name,
            }
          }

          setState(datas)
          reset(datas)
        }
      })
    }
  }, [dispatch, id, reset])

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(iconKeyword)
    }, 300)

    return () => clearTimeout(t)
  }, [iconKeyword])

  const filteredIcons = React.useMemo(() => {
    if (!iconKeyword || iconKeyword.length < 2) {
      return allIcons.slice(0, INITIAL_ICON_LIMIT)
    }

    return allIcons.filter(icon =>
      icon.includes(iconKeyword.toLowerCase())
    )
  }, [allIcons, iconKeyword])

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
        postMenuUpdate({
          id: id,
          params: {
            ...state,
            status: state.status.value,
            parent_id: state.parent_id.value,
          }
        })
      )
    } else {
      dispatch(
        postMenu({
          ...state,
          status: state.status.value,
          parent_id: state.parent_id.value,
        })
      )
    }
  }

  const fields = () => {
    return [
      field({
        type: 'select',
        key: 'parent_id',
        label: 'Parent',
        placeholder: 'Pilih Parent',
        required: true,
        options: {
          values: store.datas.map(m => {
            return {
              label: m.menu_name,
              value: m.menu_id
            }
          }),
        },
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'menu_name',
        label: 'Name',
        placeholder: 'Input name',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'text',
        key: 'module_name',
        label: 'Module',
        placeholder: 'Input module',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'numeral',
        key: 'seq_number',
        label: 'Sequence',
        placeholder: 'Input sequence',
        required: true,
        readOnly: Boolean(view)
      }),
      field({
        type: 'icon-picker',
        key: 'menu_icon',
        label: 'Icon Menu',
        placeholder: 'Pilih icon',
        readOnly: true,
        options: {
          onClick: () => setOpenIconPicker(true)
        }
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
    <>
      <Card>
        <CardHeader title='Form Menu' />
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
      
      <Dialog
        open={openIconPicker}
        onClose={() => setOpenIconPicker(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pilih Icon Menu</DialogTitle>
        <DialogContent>
          {iconKeyword.length < 2 && (
            <Typography variant="caption" color="text.secondary">
              Ketik minimal 2 huruf untuk mencari icon
            </Typography>
          )}
          <TextField
            fullWidth
            size="small"
            placeholder="Cari icon (home, user, menu...)"
            value={iconKeyword}
            onChange={e => setIconKeyword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: 2,
              maxHeight: 400,
              overflowY: 'auto'
            }}
          >
            {filteredIcons.map(icon => (
                <Box
                  key={icon}
                  onClick={() => {
                    setState(prev => ({
                      ...prev,
                      menu_icon: icon
                    }))
                    setOpenIconPicker(false)
                  }}
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <i className={icon} style={{ fontSize: 22 }} />
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 6,
                      wordBreak: 'break-word'
                    }}
                  >
                    {icon.replace('tabler-', '')}
                  </div>
                </Box>
              ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FormValidationBasic
