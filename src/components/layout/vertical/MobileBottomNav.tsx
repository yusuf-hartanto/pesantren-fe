'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Grid from '@mui/material/Grid2'
import { Dialog, Typography, IconButton, DialogContent, Menu, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import useVerticalNav from '../../../@menu/hooks/useVerticalNav'
import QRScanner from '@/views/onevour/components/qr-scanner'
import { locationQrCodeKebersihanInspeksi } from '@/app/(dashboard)/(private)/app/kebersihan-inspeksi/slice'
import { useAppDispatch } from '@/redux-store/hook'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isBelowMdScreen = useMediaQuery(theme.breakpoints.down('md'))

  // State untuk QR Scanner
  const [scannerType, setScannerType] = useState<string | null>(null)
  const [showQrScanner, setShowQrScanner] = useState(false)

  // State untuk Popup Menu (Dots Tiga)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const { isToggled, toggleVerticalNav } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
  }

  const handleCloseSidebar = () => {
    if (isToggled) {
      toggleVerticalNav()
    }
  }

  const handleBackCategory = () => {
    setScannerType(null)
  }

  const handleOpenScanner = () => {
    handleCloseSidebar()
    setScannerType(null)
    setShowQrScanner(true)
  }

  const handleCloseScanner = () => {
    setShowQrScanner(false)
    setScannerType(null)
  }

  // Handler Popup Menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleScan = (data: any) => {
    toast.success(`Kode: ${data}`)

    if (scannerType && scannerType === 'inspeksi') {
      dispatch(
        locationQrCodeKebersihanInspeksi({
          qr_code: data
        })
      ).then(res => {
        const result = { ...res?.payload }

        if (result?.status) {
          handleCloseScanner()
          router.replace(`/app/kebersihan-inspeksi/form?qrcode=${data}`)
        } else {
          toast.error('QR Code tidak dikenali')
        }
      })
      handleBackCategory()
    }

    if (scannerType && scannerType === 'presensi') {
      toast.warning('Maaf, fitur Presensi akan segera datang!!!')
      handleBackCategory()
    }
  }

  return isBelowMdScreen ? (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: '1px solid #eee',
        overflow: 'visible'
      }}
      elevation={8}
    >
      <Box sx={{ position: 'relative' }}>
        {/* FAB SCANNER BUTTON */}
        <Fab
          onClick={handleOpenScanner}
          sx={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1300,
            width: 64,
            height: 64,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.background.default}`,
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: theme.palette.background.paper
            }
          }}
        >
          <i className='tabler-qrcode text-2xl' />
        </Fab>

        {/* NAVIGATION SYSTEM */}
        <BottomNavigation
          showLabels
          value={pathname}
          sx={{
            height: 70,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              flex: 1,
              padding: '6px 0'
            }
          }}
        >
          <BottomNavigationAction
            label='Home'
            value='/dashboards/crm'
            icon={<i className='tabler-home' />}
            component={Link}
            href='/dashboards/crm'
            onClick={handleCloseSidebar}
          />

          <BottomNavigationAction
            label='Absensi'
            value='/app/absen-harian-santri/list'
            icon={<i className='tabler-calendar-user' />}
            component={Link}
            href='/app/absen-harian-santri/list'
            onClick={handleCloseSidebar}
          />

          {/* Spacer Tengah Menjaga Keseimbangan Layout */}
          <Box sx={{ flex: 1, minWidth: 50, display: 'flex', justifyContent: 'center' }} />

          <BottomNavigationAction
            label='Kebersihan'
            value='/app/kebersihan-inspeksi/list'
            icon={<i className='tabler-vacuum-cleaner' />}
            component={Link}
            href='/app/kebersihan-inspeksi/list'
            onClick={handleCloseSidebar}
          />

          {/* Menu Dots Tiga memicu Popup */}
          <BottomNavigationAction
            label='Lainnya'
            icon={<i className='tabler-dots-vertical' />}
            onClick={handleOpenMenu}
          />
        </BottomNavigation>

        {/* POPUP MENU CONTEXTUAL */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 160,
                boxShadow: theme.shadows[3],
                marginBottom: '10px'
              }
            }
          }}
        >
          {/* Menu Kebersihan */}
          <MenuItem
            component={Link}
            href='/app/santri/list'
            onClick={() => {
              handleCloseMenu()
              handleCloseSidebar()
            }}
            sx={{ gap: 1.5 }}
          >
            <i className='tabler-users text-xl' />
            <Typography variant='body2'>Santri</Typography>
          </MenuItem>

          {/* Menu Profile */}
          <MenuItem
            onClick={() => {
              handleCloseMenu()
              handleClick()
            }}
            sx={{ gap: 1.5 }}
          >
            <i className='tabler-user text-xl' />
            <Typography variant='body2'>Profile</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* DIALOG POPUP SCANNER */}
      {showQrScanner && (
        <Dialog open={showQrScanner} onClose={handleCloseScanner} fullScreen>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {scannerType && (
                <IconButton onClick={handleBackCategory}>
                  <i className='tabler-arrow-left' />
                </IconButton>
              )}
              <Typography variant='h6'>
                {scannerType ? `Scan ${scannerType.charAt(0).toUpperCase() + scannerType.slice(1)}` : 'Pilih Scanner'}
              </Typography>
            </Box>

            <IconButton onClick={handleCloseScanner}>
              <i className='tabler-x' />
            </IconButton>
          </Box>

          <DialogContent
            sx={{
              p: 2,
              backgroundColor: scannerType ? 'black' : 'background.default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!scannerType ? (
              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={2}
                    onClick={() => setScannerType('inspeksi')}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      cursor: 'pointer',
                      textAlign: 'center',
                      height: '100%',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <i className='tabler-vacuum-cleaner text-4xl mb-2' />
                    <Typography variant='h6'>Inspeksi</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Scan QR inspeksi
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={2}
                    onClick={() => setScannerType('presensi')}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      cursor: 'pointer',
                      textAlign: 'center',
                      height: '100%',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <i className='tabler-qrcode text-4xl mb-2' />
                    <Typography variant='h6'>Presensi</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Scan QR presensi
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <QRScanner result={handleScan} active={showQrScanner} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  ) : (
    ''
  )
}
