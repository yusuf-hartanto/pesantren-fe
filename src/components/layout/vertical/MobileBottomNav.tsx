'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Dialog, Typography, IconButton, DialogContent } from '@mui/material'

import useVerticalNav from '../../../@menu/hooks/useVerticalNav'
import QRScanner from '@/views/onevour/components/qr-scanner'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const theme = useTheme()
  const isBelowMdScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [showQrScanner, setShowQrScanner] = useState(false)

  const { toggleVerticalNav } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
  }

  const handleScanner = (flag: boolean) => {
    setShowQrScanner(flag)
  }

  const handleScan = (data: any) => {
    console.warn(data)
    setShowQrScanner(false)
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
        <Fab
          onClick={() => {
            handleClick()
            handleScanner(true)
          }}
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
            '&:hover': {
              backgroundColor:
                theme.palette.background.paper
            }
          }}
        >
          <i className='tabler-qrcode text-2xl' />
        </Fab>

        <BottomNavigation
          showLabels
          value={pathname}
          sx={{
            height: 70
          }}
        >
          <BottomNavigationAction
            label='Home'
            value='/dashboards/crm'
            icon={<i className='tabler-home' />}
            component={Link}
            href='/dashboards/crm'
            onClick={handleClick}
          />

          <BottomNavigationAction
            label='Santri'
            value='/app/santri/list'
            icon={<i className='tabler-users' />}
            component={Link}
            href='/app/santri/list'
            onClick={handleClick}
          />

          <Box sx={{ width: 60 }} />

          {/* <BottomNavigationAction
            label='Transaksi'
            value='/app/transaksi/list'
            icon={<i className='tabler-receipt' />}
            component={Link}
            href='/app/transaksi/list'
            onClick={handleClick}
          /> */}

          <BottomNavigationAction
            label='Kebersihan'
            value='/app/kebersihan-inspeksi/list'
            icon={<i className='tabler-vacuum-cleaner' />}
            component={Link}
            href='/app/kebersihan-inspeksi/list'
            onClick={handleClick}
          />

          <BottomNavigationAction
            label='Profile'
            icon={<i className='tabler-user' />}
            onClick={handleClick}
          />
        </BottomNavigation>
      </Box>
      {showQrScanner && (
        <Dialog
          open={showQrScanner}
          onClose={() => handleScanner(false)}
          fullScreen
        >
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
            <Typography variant='h6'>
              Scan QR Code
            </Typography>

            <IconButton onClick={() => handleScanner(false)}>
              <i className='tabler-x' />
            </IconButton>
          </Box>

          <DialogContent
            sx={{
              p: 0,
              backgroundColor: 'black'
            }}
          >
            <QRScanner
              result={handleScan}
              active={showQrScanner}
            />
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  ) : ''
}
