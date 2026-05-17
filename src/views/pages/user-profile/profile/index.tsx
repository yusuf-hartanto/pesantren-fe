// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import AboutOverview from './AboutOverview'
import ChangePasswordCard from '../../account-settings/security/ChangePasswordCard'

const ProfileTab = ({ data, detail }: { data?: ProfileTabType, detail?: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <AboutOverview data={data} />
      </Grid>
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <ChangePasswordCard detail={detail}/>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
