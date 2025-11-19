import React, { useState, useEffect } from 'react'

import MapPicker from 'react-google-map-picker'
import { Box, debounce, TextField } from '@mui/material'

const keyMap = process.env.NEXT_PUBLIC_KEY_MAP

const MapGoogle = props => {
  // ** Props
  const { data, name, selected, gridProps, handleChange, color = 'grey' } = props

  const [defaultLocation, setDefaultLocation] = useState({ lat: Number('-6.9174639'), lng: Number('107.6191228') })

  const [location, setLocation] = useState(defaultLocation)
  const [zoom, setZoom] = useState(Number(12))
  const [mounted, setMounted] = useState(false)

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng })
    handleChange({ lat: lat, lng: lng })
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom)
  }

  const handleChangeAddress = async data => {
    if (data.target.value == '') return

    let region = data.target.value.replace(' ', '+')
    let url = `https://maps.google.com/maps/api/geocode/json?key=${keyMap}&address=${region}&sensor=false&region=id`

    const response = await fetch(url)
    const { results, status } = await response.json()

    console.log(results)

    if (results.length === 0) {
      return
    }

    let lat = results[0].geometry.location.lat
    let lng = results[0].geometry.location.lng

    setLocation({ lat: lat, lng: lng })
    setDefaultLocation({ lat: lat, lng: lng })
    handleChange({ lat: lat, lng: lng })
  }

  useEffect(() => {
    if (selected) {
      setDefaultLocation(selected)
    }

    setTimeout(() => {
      setMounted(true)
    }, 1000)
  }, [selected])

  return (
    <Box item {...gridProps}>
      <TextField
        fullWidth
        size='small'
        label={'Search Location'}
        placeholder={'Ex: Bandung Jawa Barat'}
        sx={{ marginBottom: 2 }}
        onChange={debounce(handleChangeAddress, 1000)}
      ></TextField>
      {mounted && (
        <MapPicker
          defaultLocation={defaultLocation}
          zoom={zoom}
          style={{ height: 400 }}
          onChangeLocation={handleChangeLocation}
          onChangeZoom={handleChangeZoom}
          apiKey={keyMap}
        />
      )}
    </Box>
  )
}

export default MapGoogle
