'use client';

import Link from 'next/link';

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'

import { signOut, useSession } from 'next-auth/react'

import { useSettings } from '@core/hooks/useSettings'

import useVerticalNav from '../../../@menu/hooks/useVerticalNav'

export default function NavbarFooterMobile() {
  const { data: session } = useSession()
  const { updateSettings } = useSettings()
  const { toggleVerticalNav } = useVerticalNav()

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
      updateSettings({ layout: 'vertical' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = () => {
    toggleVerticalNav()
  }

  return (
    <Box
      sx={{
        borderTop: theme =>
          `1px solid ${theme.palette.divider}`,
        p: 3,
        backgroundColor: 'background.paper'
      }}
    >
      {/* USER */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}
      >
        <Link
          href='/pages/user-profile'
          className='no-underline text-inherit rounded-lg p-1 hover:bg-actionHover transition-colors'
          onClick={handleClick}
        >
          <div className='flex items-center pl-2 gap-2' tabIndex={-1}>
            <Avatar alt={session?.userdata?.full_name || ''} src={session?.userdata?.image || ''} />
            <div className='flex items-start flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {session?.userdata?.full_name || ''}
              </Typography>
              <Typography variant='caption'>{session?.userdata?.email || ''}</Typography>
            </div>
          </div>
        </Link>
      </Box>

      {/* MENU */}
      <List dense>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemButton
            onClick={handleUserLogout}
            sx={{
              color: 'error.main'
            }}
          >
            <ListItemIcon
              sx={{
                color: 'error.main'
              }}
            >
              <i className='tabler-logout' />
            </ListItemIcon>
              <span>Logout</span>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
}
