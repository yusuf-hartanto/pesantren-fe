'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import '@geoman-io/leaflet-geoman-free'

interface GeomanControlsProps {
  tipeArea: string
  setGeoData: (data: any) => void
}

const GeomanControl = ({ tipeArea, setGeoData }: GeomanControlsProps) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Inisialisasi Toolbar
    // Pada versi 2.19.3, kita menggunakan map.pm.addControls
    map.pm.addControls({
      position: 'topleft',
      drawMarker: true,
      drawCircle: true,
      drawPolygon: true,
      drawRectangle: true,
      drawPolyline: false,
      editMode: true,
      dragMode: true,
      removalMode: true,
      cutLayer: false,
    })

    // Set bahasa ke Indonesia (opsional)
    map.pm.setLang('en')

    // Listener saat objek selesai dibuat
    map.on('pm:create', (e: any) => {
      const layer = e.layer

      // Mengambil data dalam format GeoJSON
      const geojson = layer.toGeoJSON()

      // Khusus Circle: Geoman menyimpan radius di layer, tapi GeoJSON standar tidak.
      // Kita tambahkan secara manual ke properties agar bisa disimpan ke DB.
      if (e.shape === 'Circle') {
        geojson.properties.radius = layer.getRadius()
      }

      setGeoData(geojson)

      // Listener saat objek di-edit (drag titik atau resize)
      layer.on('pm:edit', (editEvent: any) => {
        const editedLayer = editEvent.target
        const editedGeojson = editedLayer.toGeoJSON()

        if (e.shape === 'Circle') {
          editedGeojson.properties.radius = editedLayer.getRadius()
        }

        setGeoData(editedGeojson)
      })

      // Listener saat objek di-hapus
      layer.on('pm:remove', () => {
        setGeoData(null)
      })
    })

    // Cleanup: Menghapus listener saat komponen unmount
    return () => {
      map.off('pm:create')
      if (map.pm) {
        map.pm.removeControls()
        map.pm.disableDraw()
      }
    }
  }, [map, setGeoData])

  // Sinkronisasi dengan dropdown 'tipeArea'
  useEffect(() => {
    if (!map || !map.pm) return

    // Reset mode gambar sebelumnya
    map.pm.disableDraw()

    // Aktifkan mode gambar sesuai pilihan di form
    const modes: Record<string, string> = {
      'Point': 'Marker',
      'Circle': 'Circle',
      'Polygon': 'Polygon'
    }

    const selectedMode = modes[tipeArea]
    if (selectedMode) {
      map.pm.enableDraw(selectedMode, {
        snappable: true,
        snapDistance: 20,
      })
    }
  }, [map, tipeArea])

  return null
}

export default GeomanControl
