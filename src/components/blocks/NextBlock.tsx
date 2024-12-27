import { red, green } from '@mui/material/colors'
//import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
//import BetInfo from './BetInfo'
import PrizePool from './PrizePool'
//import PrizePoolSkeleton from './PrizePoolSkeleton'
//import BetInfoSkeleton from './BetInfoSkeleton'

export default function NextBlock({
  data = {},
  prizePool = {},
  payrollCoin,
  handlePlaceBet = () => null,
  isCalculating = false,
  isSwitchingCoin = false,
}: any) {
  prizePool.id = data.id
  prizePool.payrollCoin = payrollCoin

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '9px 0' }}>
        <button
          onClick={handlePlaceBet}
          style={{ width: '48%', padding: '12px', color: 'white', backgroundColor: green[600], border: '0', borderRadius: '4px', fontSize: '15px' }}
          data-value="up"
          disabled={isCalculating}
        >
          ENTER UP
        </button>

        <button
          onClick={handlePlaceBet}
          style={{ width: '48%', padding: '12px', color: 'white', backgroundColor: red[600], border: '0', borderRadius: '4px', fontSize: '15px' }}
          data-value="down"
          disabled={isCalculating}
        >
          ENTER DOWN
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
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
    </div>
  )
}
