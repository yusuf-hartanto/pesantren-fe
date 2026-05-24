// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TableInspeksi from '@/app/(dashboard)/(private)/app/kebersihan-inspeksi/list/page'
import TableTemuan from '@/app/(dashboard)/(private)/app/kebersihan-temuan/list/page'

const DashboardCRM = async () => {
  // Vars
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <TableInspeksi />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <TableTemuan />
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
