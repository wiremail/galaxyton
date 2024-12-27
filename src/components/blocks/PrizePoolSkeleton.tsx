import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

export default function PrizePoolSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
      <Divider />
      <Skeleton variant="rectangular" width='100%' height={30} />
    </Stack>
  )
}
