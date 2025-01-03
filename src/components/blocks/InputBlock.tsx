import { useState } from 'react'
import { blue, orange } from '@mui/material/colors'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import WebApp from "@twa-dev/sdk"

const dev = import.meta.env.VITE_ENV === 'development'
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

export default function InputBlock({
  data = {},
  onCancelBetInput = () => null,
  onSubmitBetValue = () => null,
  betBalance = 0,
  trend,
  minBetValue,
  payrollCoin,
  isCalculating,
  isBetPending,
  setNotice = () => { }
}: any) {
  const { id } = data
  const [amount, setAmount] = useState<string>('')
  const coinSymbol = '$GLX' //payrollCoin

  const handleChangeAmount = (event: any) => setAmount(event.target.value)
  const handleCancelInput = () => onCancelBetInput()
  const handleSubmitValue = (event: any) => {
    event.preventDefault()
    if (isBetPending) return

    const parsedAmount = parseFloat(amount)
    //console.log({ parsedAmount, minBetValue })

    if (isNaN(parsedAmount)) return setNotice({ severity: 'error', message: `Value is NaN`, open: true })
    if (parsedAmount < minBetValue) return setNotice({ severity: 'error', message: `Min bet value is ${minBetValue} ${payrollCoin}`, open: true })

    onSubmitBetValue({
      action: 'placeBet',
      blockId: id,
      trend,
      amount: parsedAmount,
      coin: payrollCoin,
      userId
    })
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div>Available {betBalance.toFixed(2)} {coinSymbol}</div>
      <div style={{ width: '100%', marginTop: '10px' }}>
        <label style={{ fontSize: 'small' }}>Enter Bet Amount</label>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'space-between', justifyItems: 'center', borderBottom: '1px solid white' }}>
          <div>{trend === 'up' ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}</div>
          <input type="text" value={amount} autoFocus onChange={handleChangeAmount} style={{ width: '100%', backgroundColor: 'transparent', border: '0', color: 'inherit', margin: '0 5px', outline: 'none', lineHeight: '1.5em', fontSize: 'large', }} />
          <div style={{ padding: '5px 0' }}>{coinSymbol}</div>
        </div>
        <label style={{ fontSize: 'small' }}>{`Min bet amount is ${minBetValue} ${coinSymbol}`}</label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'space-between' }}>
        <button
          onClick={handleSubmitValue}
          style={{ width: '49%', backgroundColor: ((isCalculating || isBetPending) ? 'rgba(0, 0, 0, 0.4)' : blue[600]), color: 'white', padding: '10px', border: '0', borderRadius: '10px', fontSize: '1em' }}
          disabled={isCalculating || isBetPending}
        >
          Submit
        </button>

        <button
          onClick={handleCancelInput}
          style={{ width: '49%', backgroundColor: orange[600], color: 'white', padding: '10px', border: '0', borderRadius: '10px', fontSize: '1em' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
