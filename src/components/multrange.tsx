import { Dispatch, SetStateAction } from 'react'
import './style.css'

type Props = {
  multiplier: number,
  setMultiplier: Dispatch<SetStateAction<number>>,
}

const MultRange: React.FC<Props> = ({
  multiplier = 1,
  setMultiplier = () => null,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '80%', marginTop: '3px' }}>
        <input type="range" min="1" max="10" value={multiplier} className="slider" onChange={(e) => setMultiplier(Number(e.target.value))} />
      </div>
      <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', color: '#757575', }}>
        x{multiplier}
      </div>
    </div>
  )
}

export default MultRange
