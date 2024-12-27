import { Avatar } from '@mui/material'
import { grey } from '@mui/material/colors'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import { formatTime } from '../Helper'

export default function LaterBlock({
  data = {},
  timer = 0,
}: any) {
  const { id } = data

  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderRadius: '10px' }}>

      {/* Card Header */}
      <div style={{ fontSize: 'small', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '10px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
          {/* <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: grey[500], display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
            <WatchLaterOutlinedIcon />
          </div> */}
          <Avatar sx={{ bgcolor: grey[500] }} aria-label="later-block">
            <WatchLaterOutlinedIcon />
          </Avatar>
          <div style={{ marginLeft: '10px' }}>
            <div>Later</div>
            <div>{id || 'n/a'}</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
        <div>Entry Starts</div>
        <div>~{formatTime(timer)}</div>
      </div>
    </div>
  )
}
