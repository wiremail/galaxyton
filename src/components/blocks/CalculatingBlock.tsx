import { Avatar } from '@mui/material'
import { blue } from '@mui/material/colors'
import { CircularProgress } from '@mui/material'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'

export default function CaclulatingBlock({ blockId = '' }) {
  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderRadius: '10px' }}>
      {/* Card Header */}
      <div style={{ fontSize: 'small', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '10px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="calculating-block">
            <PauseCircleOutlineOutlinedIcon />
          </Avatar>
          <div style={{ marginLeft: '10px' }}>
            <div>Calculating...</div>
            <div>{blockId || 'n/a'}</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
        <CircularProgress size="4rem" style={{ padding: "50px" }} />
      </div>
    </div>
  )
}
