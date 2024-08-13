import { Dispatch, SetStateAction, useState, useEffect } from 'react'
// import './style.css'
import WebApp from "@twa-dev/sdk"
import Loading from './loading'
import MultRange from './multrange'

const host = 'https://1578-46-53-245-243.ngrok-free.app'


const delay = (ms: number) => new Promise(_ => setTimeout(_, ms))


interface IPrediction {
  trend: string | null;
  price: number | null;
  result: string | null;
}

type Props = {
  totalPoints: number,
  // setMultiplier: Dispatch<SetStateAction<number>>,
}

const Earn: React.FC<Props> = ({
  totalPoints = 0
}) => {
  const [tonPrice, setTonPrice] = useState(1)
  const [isPrediction, setIsPrediction] = useState(false)
  const [prediction, setPrediction] = useState<IPrediction>({ trend: null, price: null, result: null })
  const [showResult, setShowResult] = useState(false)
  const [multiplier, setMultiplier] = useState<number>(1)


  useEffect(() => {
    getTonPrice()
  }, [])


  async function getTonPrice() {
    try {
      await delay(2000)
      const endpoint = 'https://api.coingecko.com/api/v3/coins/the-open-network' //the-open-network
      fetch(endpoint)
        .then(response => response.json())
        .then(data => setTonPrice(data.market_data.current_price.usd))
        .catch(error => console.error(error))

      // setInterval(() => {
      //   //console.log('fetching...')
      //   fetch(endpoint)
      //     .then(response => response.json())
      //     .then(data => setTonPrice(data.market_data.current_price.usd))
      //     .catch(error => console.error(error))
      // }, 5000)
    }
    catch (e) { console.error(e) }
  }


  function handlePrediction(trend: string) {
    if (multiplier > totalPoints) {
      alert('Insufficient funds')
      // setMessage('Insufficient funds')
      // setIsOpen(true)
      return
    }

    setIsPrediction(true)
    setPrediction({ trend, price: tonPrice, result: null })
    const lockedPrice = tonPrice

    const timeoutId = window.setTimeout(() => {
      window.clearTimeout(timeoutId)
      setIsPrediction(false)
      const result = trend === 'up' && (tonPrice || 0) - (lockedPrice || 0) >= 0
        ? 'Win'
        : trend === 'down' && (tonPrice || 0) - (lockedPrice || 0) < 0
          ? 'Win'
          : 'Miss'

      // console.log({
      //   trend,
      //   lockedPrice,
      //   curPrice: tonPrice,
      //   result
      // })

      setPrediction((x: IPrediction) => ({ ...x, result }))
      setShowResult(true)
      window.setTimeout(() => setShowResult(false), 5000)

      fetch(`${host}/points`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: WebApp?.initDataUnsafe?.user?.id || 252672087,// null,
          points: result === 'Win' ? multiplier : -multiplier
        }),
      })
        .then(response => response.json())
        .then(json => {
          //setTotalPoints(json?.points || 0)
        })
        .catch(error => console.error(error))
    }, 5000)
  }

  return (
    <>
      {/* <div style={{ marginTop: '50px', fontSize: '24px', fontWeight: 'bold', padding: '10px', color: '#757575' }}>Predictions</div> */}

      <div style={{ margin: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', border: '1px solid white', borderRadius: '10px', backgroundColor: 'white' }}>
        {/* left */}
        {
          !tonPrice || isPrediction || totalPoints < 1
            ?
            <div style={{ padding: '10px', width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #757575', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginRight: '4px' }}>
              Up
            </div>
            :
            <div onClick={() => handlePrediction('up')} style={{ padding: '10px', width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #6fbf73', borderRadius: '10px', backgroundColor: '#4caf50', color: 'white', cursor: 'pointer', marginRight: '4px' }}>
              Up
            </div>
        }


        {/* center */}
        <div style={{ width: '40%', padding: '10px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {
            tonPrice
              ?
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>TON Price</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#757575', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                  ${tonPrice}
                </div>
              </div>
              :
              <Loading />
          }
        </div>

        {/* right */}
        {
          !tonPrice || isPrediction || totalPoints < 1
            ?
            <div style={{ padding: '10px', width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #757575', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginLeft: '4px' }}>
              Down
            </div>
            :
            <div onClick={() => handlePrediction('down')} style={{ padding: '10px', width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ff4569', borderRadius: '10px', backgroundColor: '#ff1744', color: 'white', cursor: 'pointer', marginLeft: '4px' }}>
              Down
            </div>
        }
      </div>


      <div style={{ margin: '10px', padding: '10px', border: '1px solid white', borderRadius: '10px', backgroundColor: 'white' }}>
        <MultRange
          multiplier={multiplier}
          setMultiplier={setMultiplier}
        />
      </div>


      {
        (isPrediction || showResult) &&
        <div style={{ margin: '10px', padding: '10px', border: '1px solid white', borderRadius: '10px', backgroundColor: 'white' }}>
          <div>Selected trend: {prediction.trend}</div>
          <div>Locked Price: ${prediction.price}</div>
          <div>Multiplier: x{multiplier}</div>
          {isPrediction && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}> Waiting for 5 seconds ...</div>}
          {showResult &&
            <>
              <div>Current Price: ${tonPrice}</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', fontSize: '24px', fontWeight: 'bold' }}>You {prediction.result}!</div>
            </>
          }
        </div>
      }
    </>
  )
}

export default Earn