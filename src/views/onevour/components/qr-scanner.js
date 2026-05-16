import { useEffect, useRef, useState } from 'react'

import { Html5Qrcode } from 'html5-qrcode'
import './qr-scanner-style.css'

export default function QRScanner({ result, active }) {
  const qrRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (active) {
      startScanner()
    } else {
      setIsScanning(false)
    }

    return () => {
      stopScanner()
    }
  }, [active])

  const startScanner = async () => {
    if (qrRef.current) return

    const html5QrCode = new Html5Qrcode('reader')

    qrRef.current = html5QrCode

    try {
      const devices = await Html5Qrcode.getCameras()

      if (!devices || devices.length === 0) {
        console.error('No camera found')

        return
      }

      // 👉 Cari kamera belakang
      const backCamera = devices.find(device => device.label.toLowerCase().includes('back'))

      const cameraId = backCamera?.id || devices[0].id

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        decodedText => {
          console.log('Hasil:', decodedText)
          result(decodedText)
        },
        errorMessage => {
          // optional: ignore error scan
        }
      )

      setTimeout(() => {
        setIsScanning(true)
      }, 1000)
    } catch (err) {
      console.error('Error starting scanner:', err)
    }
  }

  const stopScanner = async () => {
    if (qrRef.current && active) {
      await qrRef.current.stop()
      await qrRef.current.clear()
    }
  }

  return (
    <div className='scanner-container'>
      <div id='reader' className='camera-view'></div>

      {isScanning ? (
        <div className='overlay'>
          <div className='scan-box'>
            <div className='scan-line'></div>
          </div>
        </div>
      ) : (
        <div className='overlay'>{active && <div>Please wait...</div>}</div>
      )}
    </div>
  )
}
