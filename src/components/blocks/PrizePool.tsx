import { memo } from 'react'
import { Stack } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
//import BetInfo from './BetInfo'
//import BetInfoSkeleton from './BetInfoSkeleton'

interface IPrizePool {
  id: string,
  amount: number,
  payoutRate: { up: number, down: number },
  bettors: { up: number, down: number },
  payrollCoin: string
}

interface IBet {
  trend: string,
  amount: number,
  coin: string
}

const PrizePool = memo(({ data }: { data: IPrizePool }) => {
  //console.log('data', data)
  const { id, amount, payoutRate, bettors, payrollCoin } = data
  const coinSymbol = '$GLX' //payrollCoin

  //if (localStorage.getItem(id || '') === null) return

  //const bet: IBet = JSON.parse(localStorage.getItem(id || '') || '') || null
  //if (bet?.coin !== payrollCoin) return

  let bet: IBet = { trend: '', amount: 0, coin: '' }
  const storedBet = localStorage.getItem(id || '')
  if (storedBet) bet = JSON.parse(storedBet)
  //console.log('bet', bet)

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'start' }}>
          Prize Pool: {+amount.toFixed(3)} {coinSymbol}
        </div>
        <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          {
            storedBet &&
            <>
              Your Bet: {bet?.trend.toUpperCase() === 'UP' ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />} {bet?.amount} {coinSymbol}
            </>
          }
        </div>
      </div>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ borderTop: 1, borderColor: "grey.400" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
        >
          <ArrowUpwardIcon color="success" />
          {payoutRate.up.toFixed(2)}x
        </Stack>

        <div style={{ marginTop: '10px', fontSize: 'small', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>Payout</div>
          <div>{bettors.up}-{bettors.down}</div>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          gap={1}
        >
          <ArrowDownwardIcon color="error" />
          {payoutRate.down.toFixed(2)}x
        </Stack>
      </Stack>
    </div>
  )
})

export default PrizePool
