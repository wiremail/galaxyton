import { memo } from 'react'
import Chip from '@mui/material/Chip'
// import { grey } from '@mui/material/colors'
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
// import BetInfo from './BetInfo'
import PrizePool from './PrizePool'
//import PrizePoolSkeleton from './PrizePoolSkeleton'
// import BetInfoSkeleton from './BetInfoSkeleton'
// import IconArrows from '../icons/arrows'

const ClosedBlock = memo(({
  data = {},
  prizePool = {},
  payrollCoin,
  //isSwitchingCoin = false,
}: any) => {
  const { id, lastPrice, lockedPrice } = data
  const diffPrice = lastPrice - lockedPrice
  prizePool.id = id
  prizePool.payrollCoin = payrollCoin

  let bet = { trend: '', amount: 0, coin: '' }
  const storedBet = localStorage.getItem(id || '')
  if (storedBet) bet = JSON.parse(storedBet)
  const isWin = (diffPrice > 0 && bet?.trend.toUpperCase() === 'UP') || (diffPrice < 0 && bet?.trend.toUpperCase() === 'DOWN')

  return (
    <div style={{ marginTop: '20px' }}>
      <div >
        CLOSED PRICE
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'start', alignItems: 'center', fontSize: '20px' }}>
          ${lastPrice}
        </div>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Chip
            icon={diffPrice < 0 ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            label={diffPrice.toFixed(2)}
            color={diffPrice < 0 ? "error" : "success"}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ width: '55%', display: 'flex', justifyContent: 'start', alignItems: 'center', }}>
          Locked Price: ${lockedPrice}
        </div>
        <div style={{ width: '45%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          {bet?.amount > 0 ? <>Result: {isWin ? 'Win' : 'Lose'} </> : null}
        </div>
      </div>

      {/* {
        isSwitchingCoin
          ?
          <PrizePoolSkeleton />
          :
          <PrizePool
            data={prizePool}
            payrollCoin={payrollCoin}
          />
      } */}
      <PrizePool data={prizePool} />
    </div>
  )
})

export default ClosedBlock
