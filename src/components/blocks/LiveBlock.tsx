import Chip from '@mui/material/Chip'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
//import BetInfo from './BetInfo'
import PrizePool from './PrizePool'
//import PrizePoolSkeleton from './PrizePoolSkeleton'
// import BetInfoSkeleton from './BetInfoSkeleton'

export default function LiveBlock({
  data = {},
  prizePool = {},
  payrollCoin,
  lastPrice,
  diffPrice,
  //isSwitchingCoin = false,
}: any) {
  prizePool.id = data.id
  prizePool.payrollCoin = payrollCoin

  return (
    <div style={{ marginTop: '20px' }}>
      <div>
        LAST PRICE
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'start', alignItems: 'center', fontSize: '20px' }}>
          ${lastPrice}
        </div>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Chip
            icon={diffPrice < 0 ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            label={diffPrice}
            color={diffPrice < 0 ? "error" : "success"}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        Locked Price: ${data?.lockedPrice || 0}
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
}
