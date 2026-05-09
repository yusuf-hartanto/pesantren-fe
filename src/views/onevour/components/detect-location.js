import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'

import { useForm } from 'react-hook-form'

import { field, formSingleColumn } from '../form/AppFormBuilder'

export default function GetLocation({ result, active, locations, selected }) {
  const defaultValues = {}

  const [state, setState] = useState(defaultValues)
  const [error, setError] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  useEffect(() => {
    if (active) {
      startGps()
    }
  }, [active])

  const startGps = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')

      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        result({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      err => {
        setError(err.message)
      }
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item size={12}>
        {active &&
          formSingleColumn({
            control: control,
            errors: errors,
            state: state,
            setState: setState,
            field: field({
              type: 'select',
              key: 'location',
              label: 'Lokasi',
              placeholder: 'Input Lokasi',
              required: true,
              options: {
                values: locations.map(r => {
                  return {
                    label: r.nama_lokasi,
                    value: r.id_lokasi
                  }
                }),
                onChange: e => {
                  selected(e)
                }
              }
            })
          })}
      </Grid>
    </Grid>
  )
}
