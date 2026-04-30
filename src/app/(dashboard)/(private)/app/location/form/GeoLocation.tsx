'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  Chip,
  Divider,
  IconButton
} from '@mui/material'

// Import CSS (Pastikan urutan Leaflet -> Geoman)
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

/* -----------------------------------------------------------
   MapLogic: Integrasi Geoman
----------------------------------------------------------- */
const MapLogic = ({ tipeArea, setGeoData }: any) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const initGeoman = async () => {
      // Import dinamis
      await import('@geoman-io/leaflet-geoman-free')

      // Pastikan objek map dan container DOM tersedia
      const container = map.getContainer()
      if (!container) return

      // PENTING: Cek jika toolbar sudah terpasang agar tidak duplikasi
      // Jika MapContainer tidak di-reset, kita harus memastikan kontrol tidak dibuat berulang kali
      if (map.pm) {
        // Hapus kontrol lama jika ada sebelum membuat baru
        map.pm.removeControls()

        map.pm.addControls({
          position: 'topleft',
          drawMarker: true,
          drawCircle: true,
          drawPolygon: true,
          editMode: true,
          removalMode: true,
          dragMode: true,
          cutLayer: false
        })

        // Event listener: Gunakan .off() sebelum .on() agar tidak double listener
        map.off('pm:create')
        map.on('pm:create', (e: any) => {
          const layer = e.layer
          const data = layer.toGeoJSON()
          if (e.shape === 'Circle') data.properties.radius = layer.getRadius()
          setGeoData(data)

          layer.on('pm:edit', (editEvent: any) => {
            const editedLayer = editEvent.target
            const editedData = editedLayer.toGeoJSON()
            if (editEvent.shape === 'Circle') editedData.properties.radius = editedLayer.getRadius()
            setGeoData(editedData)
          })

          layer.on('pm:remove', () => setGeoData(null))
        })
      }
    }

    initGeoman()

    return () => {
      if (map.pm) {
        map.pm.removeControls()
        map.off('pm:create')
      }
    }
  }, [map, setGeoData])

  // Sinkronisasi mode gambar kursor (Point/Circle/Polygon)
  useEffect(() => {
    if (!map || !map.pm) return

    // Matikan mode sebelumnya
    map.pm.disableDraw()

    const modes: any = { Point: 'Marker', Circle: 'Circle', Polygon: 'Polygon' }
    if (modes[tipeArea]) {
      map.pm.enableDraw(modes[tipeArea])
    }
  }, [map, tipeArea])

  return null
}

/* -----------------------------------------------------------
   Main Component: GeoLocationForm
----------------------------------------------------------- */
const GeoLocation = ({ data, onClose }: any) => {
  const [form, setForm] = useState({
    nama_area: data?.nama_lokasi || '',
    tipe_area: 'Polygon',
    toleransi: 10,
    is_aktif: 1,
    keterangan: ''
  })

  const [geoData, setGeoData] = useState<any>(null)

  // Titik tengah peta
  const centerPosition = useMemo((): [number, number] => {
    const lat = Number(data?.latitude)
    const lng = Number(data?.longitude)
    return (lat && lng) ? [lat, lng] : [-6.2088, 106.8456]
  }, [data])

  // Hitung titik polygon (kurangi 1 karena titik terakhir=awal)
  const pointCount = geoData?.geometry?.type === 'Polygon'
    ? (geoData.geometry.coordinates[0]?.length || 1) - 1
    : 0

  useEffect(() => {
    // Teknik "Sapu Bersih" sebelum render:
    // Cari elemen map container, jika ada ID Leaflet lama, hapus manual
    const container = document.getElementById('map-geo-internal');
    if (container) {
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }
    }
  }, [data?.id_lokasi]);

  return (
    <Grid container spacing={5}>
      {/* Sisi Kiri: Form Input */}
      <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>FORM AREA BARU</Typography>

          <TextField
            fullWidth
            label="Nama Area *"
            size="small"
            value={form.nama_area}
            onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
          />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>Tipe Area *</Typography>
            <select
              className="form-select form-select-sm"
              value={form.tipe_area}
              onChange={(e) => {
                setForm({ ...form, tipe_area: e.target.value })
                setGeoData(null)
              }}
            >
              <option value="Point">Point</option>
              <option value="Circle">Circle</option>
              <option value="Polygon">Polygon</option>
            </select>

            {form.tipe_area === 'Polygon' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px dashed #007bff' }}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', display: 'block' }}>
                  Titik Polygon: {pointCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {pointCount < 3 ? `Minimal 3 titik diperlukan (kurang ${3 - pointCount})` : 'Area valid'}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Toleransi Meter"
            type="number"
            size="small"
            value={form.toleransi}
            onChange={(e) => setForm({ ...form, toleransi: Number(e.target.value) })}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.is_aktif === 1}
                onChange={(e) => setForm({ ...form, is_aktif: e.target.checked ? 1 : 0 })}
              />
            }
            label="Area Aktif"
          />

          <TextField
            fullWidth
            label="Keterangan"
            multiline
            rows={2}
            size="small"
            value={form.keterangan}
            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="inherit" fullWidth onClick={() => setGeoData(null)}>
              Clear Drawing
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!geoData || (form.tipe_area === 'Polygon' && pointCount < 3)}
              sx={{ bgcolor: '#1a1d23', '&:hover': { bgcolor: '#000' } }}
            >
              Simpan Area
            </Button>
          </Box>

          <Divider />

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>AREA GEO TERSIMPAN</Typography>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Area Kamar 01</Typography>
                <Typography variant="caption" color="text.secondary" display="block">POLYGON</Typography>
                <Chip label="Aktif" size="small" color="success" variant="tonal" sx={{ mt: 1, height: 20, fontSize: 10 }} />
              </Box>
              <Button variant="contained" color="error" size="small" sx={{ minWidth: 0 }}>Hapus</Button>
            </Box>
          </Card>
        </Box>
      </Grid>

      {/* Sisi Kanan: Map */}
      <Grid item xs={12} md={8}>
        <Box id="map-geo-internal" sx={{ height: 600, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd', position: 'relative' }}>
          <MapContainer
            /* KUNCI UTAMA: Menggunakan key unik agar instance benar-benar reset saat ganti lokasi atau tipe */
            // key={`${data?.id_lokasi || 'new'}-${form.tipe_area}`}
            center={centerPosition}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapLogic tipeArea={form.tipe_area} setGeoData={setGeoData} />
          </MapContainer>
        </Box>
      </Grid>
    </Grid>
  )
}

export default GeoLocation
