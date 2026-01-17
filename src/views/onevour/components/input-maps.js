'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Box, debounce, TextField } from '@mui/material'

const keyMap = process.env.NEXT_PUBLIC_KEY_MAP

const DEFAULT_LOCATION = {
  lat: -6.9174639,
  lng: 107.6191228
}

const MapGoogle = ({ selected, gridProps, handleChange }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [zoom, setZoom] = useState(12)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: keyMap
  })

  const onMarkerDragEnd = useCallback(e => {
    if (!e?.latLng) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    setLocation({ lat, lng })
    handleChange({ lat, lng })
  }, [handleChange])

  const handleChangeAddress = async e => {
    if (!e.target.value) return

    const region = e.target.value.replace(/ /g, '+')
    const url = `https://maps.google.com/maps/api/geocode/json?key=${keyMap}&address=${region}&region=id`

    const res = await fetch(url)
    const { results } = await res.json()

    if (!results?.length) return

    const { lat, lng } = results[0].geometry.location

    setLocation({ lat, lng })
    handleChange({ lat, lng })
  }

  useEffect(() => {
    if (selected) {
      setLocation(selected)
    }
  }, [selected])

  return (
    <Box {...gridProps}>
      <TextField
        fullWidth
        size='small'
        label='Search Location'
        placeholder='Ex: Bandung Jawa Barat'
        sx={{ mb: 2 }}
        onChange={debounce(handleChangeAddress, 1000)}
      />

      {isLoaded && (
        <GoogleMap
          center={location}
          zoom={zoom}
          mapContainerStyle={{ width: '100%', height: 400 }}
        >
          <Marker
            position={location}
            draggable
            onDragEnd={onMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </Box>
  )
}

export default MapGoogle
