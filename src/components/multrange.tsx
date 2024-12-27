import { Dispatch, SetStateAction } from 'react'
import './style.css'

type Props = {
  betAmount: number,
  setBetAmount: Dispatch<SetStateAction<number>>,
}

const MultRange: React.FC<Props> = ({
  betAmount = 1,
  setBetAmount = () => null,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px' }}>
      <div style={{ width: '70%', marginTop: '3px' }}>
        <input type="range" min="1" max="10" value={betAmount} className="slider" onChange={(e) => setBetAmount(Number(e.target.value))} />
      </div>
      <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', }}>
        {betAmount} $GLX
      </div>
    </div>
  )
}

export default MultRange
