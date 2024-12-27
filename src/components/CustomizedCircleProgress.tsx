import { Box, Typography, CircularProgress } from '@mui/material'
import { blue } from '@mui/material/colors'
import { formatTime } from './Helper'

export default function CustomizedCircleProgress({ ...props }) {
  const { progressValue, timer } = props.data

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        sx={{ color: blue[600] }}
        size={40}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        style={{
          color: blue[100],
          position: "absolute",
          left: 0
        }}
        size={40}
        thickness={4}
        value={progressValue}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.inherit">
          {formatTime(timer)}
        </Typography>
      </Box>
    </Box>
  )
}
