'use client'

import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify'

import { postUserUpdatePassword } from '@/app/(dashboard)/(private)/app/user/slice'

import CustomTextField from '@core/components/mui/TextField'

import { useAppDispatch, useAppSelector } from '@/redux-store/hook'

type FormValues = {
  current_password: string
  password: string
  confirm_password: string
}

const ChangePasswordCard = ({ detail }: { detail?: any }) => {
  const dispatch = useAppDispatch()
  const store = useAppSelector(state => state.user)

  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      current_password: '',
      password: '',
      confirm_password: ''
    }
  })

  const password = watch('password')

  useEffect(() => {
    if (!store.crud) return

    if (store.crud.status) {
      toast.success('Password berhasil diubah.')
      reset()
    } else {
      toast.error(store.crud.message)
    }
  }, [reset, store])

  const onSubmit = async (values: FormValues) => {
    const id = detail?.resource_id

    dispatch(
      postUserUpdatePassword({
        id,
        params: values
      })
    )
  }

  return (
    <Card>
      <CardHeader title='Ubah Password' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Current Password'
                type={isCurrentPasswordShown ? 'text' : 'password'}
                placeholder='············'
                error={!!errors.current_password}
                helperText={errors.current_password?.message}
                {...register('current_password', {
                  required: 'Current password wajib diisi'
                })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setIsCurrentPasswordShown(!isCurrentPasswordShown)
                          }
                        >
                          <i
                            className={
                              isCurrentPasswordShown
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>
          </Grid>
          
          <Grid container className='mt-5' spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='New Password'
                type={isNewPasswordShown ? 'text' : 'password'}
                placeholder='············'
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 8,
                    message: 'Minimal 8 karakter'
                  }
                })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setIsNewPasswordShown(!isNewPasswordShown)
                          }
                        >
                          <i
                            className={
                              isNewPasswordShown
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Confirm New Password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                placeholder='············'
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
                {...register('confirm_password', {
                  required: 'Confirm password wajib diisi',
                  validate: value =>
                    value === password || 'Confirm password tidak sama'
                })}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setIsConfirmPasswordShown(
                              !isConfirmPasswordShown
                            )
                          }
                        >
                          <i
                            className={
                              isConfirmPasswordShown
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex flex-col gap-4'>
              <Typography variant='h6'>
                Password Requirements:
              </Typography>

              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  Minimum 8 characters
                </div>

                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  At least one uppercase & lowercase
                </div>

                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  At least one number or symbol
                </div>
              </div>
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button
                type='submit'
                variant='contained'
                disabled={store.loading}
              >
                Save Changes
              </Button>

              <Button
                variant='tonal'
                color='secondary'
                type='button'
                onClick={() => reset()}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
