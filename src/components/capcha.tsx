import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './style.css'

type Props = {
}

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

const Captcha: React.FC<Props> = ({
}) => {

  const [value, setValue] = useState<number>(1)
  const [isCaptcha, setIsCaptcha] = useState(false)
  const [valid, setValid] = useState<number[]>([0])

  function handleCaptcha(e: any) {
    console.log(e.target.value)
    setValue(e.target.value)
    setIsCaptcha(valid.includes(Number(e.target.value)))
  }

  useEffect(() => {
    const mid = getRandomInt(10, 90)
    setValid([mid - 2, mid - 1, mid, mid + 1, mid + 2])
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '60%', margin: '5px 10px' }}>
        <input type="range" min="1" max="100" value={value} className="slider" onChange={handleCaptcha} />
      </div>
      <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 10px', color: '#fff', }}>
        {
          isCaptcha
            ?
            <span onClick={() => console.log('ok')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '10px', backgroundColor: '#2196f3' }}>
              Activate Farming
            </span>
            :
            <span style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#999' }}>
              Activate Farming
            </span>
        }
      </div>
    </div>
  )
}

export default Captcha