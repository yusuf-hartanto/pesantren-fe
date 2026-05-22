'use client'

// React Imports
import { useState, type ReactElement, type SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import Skeleton from '@mui/material/Skeleton'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'

type Props = {
  tabContentList: { [key: string]: ReactElement }
  data?: Data | null
  loading?: boolean
}

const UserProfile = ({ tabContentList, data, loading = false }: Props) => {
  // States
  const [activeTab, setActiveTab] = useState('profile')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      {/* HEADER */}
      <Grid size={{ xs: 12 }}>
        {loading ? (
          <Skeleton variant='rounded' height={220} />
        ) : (
          <UserProfileHeader data={data?.profileHeader} />
        )}
      </Grid>

      {/* CONTENT */}
      <Grid size={{ xs: 12 }} className='flex flex-col gap-6'>
        <TabContext value={activeTab}>
          <CustomTabList
            onChange={handleChange}
            variant='scrollable'
            pill='true'
          >
            <Tab
              value='profile'
              label={
                <div className='flex items-center gap-1.5'>
                  <i className='tabler-user-check text-lg' />
                  <span>Profile</span>
                </div>
              }
            />
          </CustomTabList>

          <TabPanel value={activeTab} className='p-0'>
            {loading ? (
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Skeleton variant='rounded' height={180} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Skeleton variant='rounded' height={180} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Skeleton variant='rounded' height={300} />
                </Grid>
              </Grid>
            ) : (
              tabContentList[activeTab]
            )}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default UserProfile
