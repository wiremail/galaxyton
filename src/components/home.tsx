import { useState, memo, useEffect, FC, useCallback, useRef, Dispatch, SetStateAction } from 'react'
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion'
import { CHAIN } from "@tonconnect/ui-react"
import { Address } from "ton-core"
import { useTonConnect } from "../hooks/useTonConnect"
import IconClock from './icons/clock'
import IconUpArrow from './icons/upArrow'
import IconDownArrow from './icons/downArrow'
import { blue } from '@mui/material/colors'

import WebApp from "@twa-dev/sdk"
import Notify from './notify'

import { getHttpEndpoint } from "@orbs-network/ton-access"
import { TonClient, fromNano } from "ton"

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

const fixed = (t: number, n: number) => Math.round(t * Math.pow(10, n)) / Math.pow(10, n)
const delay = (ms: number) => new Promise(_ => setTimeout(_, ms))

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}


function msToHMS(ms: number) {
  return new Date(ms).toISOString().slice(11, 19)
}

// ===================
import Loading from './loading'
import MultRange from './multrange'
import ClockSpinner from './icons/clockSpinner'

import iconGold from '../assets/gold.png'
// import iconCandlestickUp from '../assets/candlesticks_up.png'
// import iconCandlestickDown from '../assets/candlesticks_down.png'


const duration = 10


interface IPrediction {
  trend: string | null;
  price0: number | null;
  price1: number | null;
  diff: number | null;
  result: string | null;
}

type Props = {
  totalPoints: number,
  setTotalPoints: Dispatch<SetStateAction<number>>,
  // setMultiplier: Dispatch<SetStateAction<number>>,
}


const mediumProps: ConfettiProps = {
  force: 0.6,
  duration: 5000,
  particleCount: 150,
  particleSize: 6,
  width: 1000,
  //colors: ['#9A0023', '#FF003C', '#AF739B', '#FAC7F3', '#F7DBF4'],
}


const Earn: React.FC<Props> = ({
  totalPoints = 0,
  setTotalPoints = () => { },
}) => {
  const [coinPrice, setCoinPrice] = useState(0)
  const [isPrediction, setIsPrediction] = useState(false)
  const [prediction, setPrediction] = useState<IPrediction>({ trend: null, price0: null, price1: null, diff: null, result: null })
  const [showResult, setShowResult] = useState(false)
  const [betAmount, setBetAmount] = useState<number>(1)
  const [multiplier, setMultiplier] = useState<number>(0)
  const [gold, setGold] = useState<number>(0)
  const [isExploding, setIsExploding] = useState<boolean>(false)


  async function getCoinPrice() {
    const price = fetch(`${host}/price/BTC`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setCoinPrice(json?.price ?? 1)
        return json?.price
      })
      .catch(error => console.error(error))

    return price
  }

  function getGoldValue() {
    fetch(`${host}/bets/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setGold(json?.reward ?? 0)
      })
      .catch(error => console.error(error))
  }


  useEffect(() => {
    getCoinPrice()
    getGoldValue()
    const inervalId = setInterval(getCoinPrice, 2000)

    return () => {
      clearInterval(inervalId)
    }
  }, [])


  function computeResult({ trend, lockedPrice, currentPrice }: { trend: string, lockedPrice: number, currentPrice: number }) {

    const diff = (currentPrice || 0) - (lockedPrice || 0)
    const isWin = trend === 'up' && diff >= 0
      ? true
      : trend === 'down' && diff < 0
        ? true
        : false

    return {
      diff,
      isWin
    }
  }


  async function handlePrediction(trend: string) {
    if (betAmount > totalPoints) {
      alert('Insufficient funds')
      // setMessage('Insufficient funds')
      // setIsOpen(true)
      return
    }

    const price0 = await getCoinPrice()


    fetch(`${host}/points`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        amount: -betAmount,
        type: 'earning',
        trend,
        price0,
        betAmount
      }),
    })
      .then(response => response.json())
      .then(async json => {
        //console.log({ json })
        setTotalPoints(x => x - betAmount)

        setIsPrediction(true)
        setPrediction((x: IPrediction) => ({ ...x, trend, price0 }))
        const lockedPrice = await getCoinPrice() ?? 2


        const timeoutId = window.setTimeout(async () => {
          window.clearTimeout(timeoutId)
          setIsPrediction(false)

          const currentPrice = await getCoinPrice() ?? 3

          // console.log({
          //   trend,
          //   lockedPrice,
          //   currentPrice
          // })


          const result = computeResult({ trend, lockedPrice, currentPrice })

          const _multiplier = result.isWin ? multiplier < 5 ? multiplier + 1 : multiplier : 0
          setMultiplier(_multiplier)

          fetch(`${host}/bets`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              betId: json.betId,
              price1: currentPrice,
              multiplier: _multiplier
            }),
          })
            .then(response => response.json())
            .then(json => {
              //console.log({ json })
              setGold(json?.reward ?? 0)
              setPrediction((x: IPrediction) => ({ ...x, price1: currentPrice, diff: result.diff, result: result.isWin ? 'win' : 'miss' }))
              setShowResult(true)

              if (result.isWin) setIsExploding(true)

              window.setTimeout(() => {
                setShowResult(false)
                setIsExploding(false)
              }, 6000)
            })
            .catch(error => console.error(error))

        }, duration * 1000)
      })
      .catch(error => console.error(error))
  }

  // function Gold({ value }: { value: number }) {
  //   return (
  //     <>
  //       <div style={{ marginTop: '10px' }}></div>
  //       <div style={{ display: 'inline-block', padding: '10px', margin: '0 10px', borderRadius: '10px', color: '#ff9100', fontWeight: 'bold', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  //         {value.toFixed(2)} $GLXG
  //       </div>
  //     </>
  //   )
  // }

  return (
    <div style={{ borderRadius: '10px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', fontSize: '14px' }}>
      <div style={{ marginBottom: '20px' }}>
        Place bets on the BTC/USD rate using the received $GLX to get $GTON. $GTON gives the opportunity to participate in airdrops and premium tournaments with a prize pool in TON.
      </div>

      <div>
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>Bet amount</div>
        <MultRange
          betAmount={betAmount}
          setBetAmount={setBetAmount}
        />
      </div>


      <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        {/* left */}
        {
          !coinPrice || isPrediction || totalPoints < 1 || showResult
            ?
            // <div style={{ position: 'relative', padding: '10px', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginRight: '4px' }}>
            //   <div style={{ position: 'absolute', top: '5px', left: '10px', zIndex: '1000' }}>Up</div>
            //   <img
            //     src={iconCandlestickUp}
            //     height={50}
            //     width={'auto'}
            //     alt="Star"
            //   />
            // </div>
            <div style={{ padding: '10px', width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginRight: '4px' }}>
              <IconUpArrow />
              <div>Up</div>
            </div>
            :
            // <div onClick={() => handlePrediction('up')} style={{ position: 'relative', padding: '10px', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#4caf50', color: 'white', cursor: 'pointer', marginRight: '4px' }}>
            //   <div style={{ position: 'absolute', top: '5px', left: '10px', zIndex: '1000' }}>Up</div>
            //   <img
            //     src={iconCandlestickUp}
            //     height={50}
            //     width={'auto'}
            //     alt="Star"
            //   />
            // </div>
            <div onClick={() => handlePrediction('up')} style={{ padding: '10px', width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#4caf50', color: 'white', cursor: 'pointer', marginRight: '4px' }}>
              <IconUpArrow />
              <div>Up</div>
            </div>
        }


        {/* center */}
        <div style={{ width: '50%', padding: '10px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {
            coinPrice
              ?
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>BTC Price</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                  ${coinPrice.toFixed(2)}
                </div>

                {
                  gold > 0 &&
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                    <img
                      src={iconGold}
                      height={24}
                      width={'auto'}
                      alt="Gold"
                    />
                    <div style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '18px', color: '#ff9100' }}>{gold}</div>
                  </div>

                }
              </div>
              :
              <Loading />
          }
        </div>

        {/* right */}
        {
          !coinPrice || isPrediction || totalPoints < 1 || showResult
            ?
            // <div style={{ position: 'relative', padding: '10px', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #757575', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginLeft: '4px' }}>
            //   <img
            //     src={iconCandlestickDown}
            //     height={50}
            //     width={'auto'}
            //     alt="Star"
            //   />
            //   <div style={{ position: 'absolute', bottom: '5px', left: '10px', zIndex: '1000' }}>Down</div>
            // </div>
            <div style={{ padding: '10px', width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#757575', color: 'white', marginRight: '4px' }}>
              <div>Down</div>
              <IconDownArrow />
            </div>
            :
            // <div onClick={() => handlePrediction('down')} style={{ position: 'relative', padding: '10px', width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ff4569', borderRadius: '10px', backgroundColor: '#ff1744', color: 'white', cursor: 'pointer', marginLeft: '4px' }}>
            //   <img
            //     src={iconCandlestickDown}
            //     height={50}
            //     width={'auto'}
            //     alt="Star"
            //   />
            //   <div style={{ position: 'absolute', bottom: '5px', left: '10px', zIndex: '1000' }}>Down</div>
            // </div>
            <div onClick={() => handlePrediction('down')} style={{ padding: '10px', width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', backgroundColor: '#ff4569', color: 'white', cursor: 'pointer', marginRight: '4px' }}>
              <div>Down</div>
              <IconDownArrow />
            </div>
        }
      </div>


      {
        (isPrediction || showResult) &&
        <div style={{ margin: '1px 0', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '70%', marginTop: '3px' }}>
            <div>Selected Trend: {prediction.trend}</div>
            <div>Locked Price: ${prediction.price0?.toFixed(2)}</div>
            <div>Bet Amount: {betAmount} $GLX</div>

            {showResult &&
              <>
                <div>Current Price: ${prediction.price1?.toFixed(2)}</div>
                <div>Multiplier: x{multiplier}</div>
                <div>Change:
                  <span style={{ marginLeft: '10px' }}>
                    {(prediction?.diff ?? 0) > 0 ? '+' : '-'}
                    ${Math.abs(prediction?.diff || 0).toFixed(2)}
                  </span>
                </div>
              </>
            }
          </div>
          <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '24px' }}>
            {isPrediction && <ClockSpinner />}
            {isExploding && <ConfettiExplosion {...mediumProps} />}
            {showResult && <span style={{ color: prediction?.result === 'win' ? '#4caf50' : '#ff5722' }}>You {prediction?.result}!</span>}
          </div>
        </div>
      }
    </div>
  )
}


// ====================

interface IUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface INotice {
  severity: string | null;
  message: string | null;
  open: boolean;
}


const Home: React.FC<Props> = ({
  totalPoints = 0,
  setTotalPoints = () => { },
}) => {
  const { connected, wallet, network, address } = useTonConnect()
  const [balance, setBalance] = useState('0.0')
  const [points, setPoints] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isFarming, setIsFarming] = useState(false)
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [farmingStartedAt, setFarmingStardtedAt] = useState<number>(0)

  const [notice, setNotice] = useState<INotice>({
    severity: null,
    message: null,
    open: false
  })

  const [value, setValue] = useState<number>(1)
  const [isCaptcha, setIsCaptcha] = useState(false)
  //const [valid, setValid] = useState<number[]>([0])


  function handleCaptcha(e: any) {
    //console.log(e.target.value)
    setValue(e.target.value)
    setIsCaptcha(Number(e.target.value) === 100)
    //setIsCaptcha(valid.includes(Number(e.target.value)))
  }

  // useEffect(() => {
  //   const mid = getRandomInt(10, 90)
  //   setValid([mid - 2, mid - 1, mid, mid + 1, mid + 2])
  // }, [])


  // const tg = (window as any).Telegram?.WebApp
  // console.log(tg)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as IUserData)
    }
  }, [])


  useEffect(() => {
    getUserData()
  }, [])



  async function getUserData() {
    fetch(`${host}/users/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        setTotalPoints(json?.points || 0)
        farming(+json?.farmingStartedAt || 0)
        setFarmingStardtedAt(json?.farmingStartedAt || 0)
      })
      .catch(error => console.error(error))
  }


  async function getBalance(wallet: any, network: any) {
    const endpoint = await getHttpEndpoint({ network })
    const client = new TonClient({ endpoint })
    const balance = await client.getBalance(wallet as any)
    setBalance(fromNano(balance))
  }


  useEffect(() => {
    if (connected) {
      getBalance(Address.parse(wallet as string).toString(), network === CHAIN.MAINNET
        ? "mainnet"
        : "testnet");
    } else {
      setBalance('0.0');
    }
  }, [connected])


  function countdown(ms: number) {
    return new Date(ms).toISOString().slice(11, 19)
    // const hours = Math.floor(seconds / 3600)
    // const minutes = Math.floor((seconds % 3600) / 60)
    // const remainingSeconds = seconds % 60

    // const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

    // return formattedTime
  }


  function farming(farmingStartedAt: number) {
    let harvest = 0.01
    let farmingTime = 6 * 60 * 60 * 1000 // 6 hours
    let timeLeft = farmingStartedAt + farmingTime - Date.now()
    let farmedTime = farmingTime - timeLeft
    let points = timeLeft > 0
      ? fixed(Math.floor(farmedTime / 1000) * harvest, 2)
      : fixed(Math.floor(farmingTime / 1000) * harvest, 2)

    console.log({
      farmingStartedAt: msToHMS(farmingStartedAt),
      farmingTime: msToHMS(farmingTime),
      timeLeft: msToHMS(timeLeft),
      farmedTime: msToHMS(farmedTime),
      points
    })


    setIsFarming(timeLeft > 0)
    setPoints(points)
    setTimer(timeLeft)

    if (timeLeft <= 0) return

    let time = Math.floor(timeLeft / 1000)

    let intervalId = setInterval(() => {
      time--

      setPoints(x => fixed(x + harvest, 2))
      setTimer(x => x - 1000)

      if (time <= 0) {
        setIsFarming(false)
        setTimer(0)
        clearInterval(intervalId)
        return
      }
    }, 1000)
  }


  async function activateFarming() {
    if (!userId) return console.log('Not logged in')

    fetch(`${host}/farming`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => response.json())
      .then(json => {
        if (json?.error) {
          setNotice({ severity: 'error', message: json?.message, open: true })
          return
        }
        //console.log({ json })
        farming(+json.farmingStartedAt)
      })
      .catch(error => console.error(error))
  }


  async function clamePoints() {
    if (!userId) return console.log('Not logged in')

    const data = {
      userId,
      amount: points,
      type: 'farming'
    }

    fetch(`${host}/points`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        console.log({ json })
        setTotalPoints(x => x + json?.points?.amount || 0)
        setPoints(0)
        setFarmingStardtedAt(0)

        setNotice({ severity: 'success', message: 'Points successfully clamed!', open: true })
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      {/* <div style={{ padding: '10px', border: '1px solid lightgray', margin: '10px', borderRadius: '10px', backgroundColor: 'white' }}>
        <div>Wallet {wallet ? Address.parse(wallet as string).toString() : "Loading..."}</div>
        <div>UserId: {userData?.id || 'n/a'}</div>
        <div>UserName: {userData?.username || 'n/a'}</div>
        <div>Network: {network === CHAIN.MAINNET ? "mainnet" : "testnet"}</div>
        <div>Balance: {balance ?? "Loading..."} TON</div>
        <div>Total points: {totalPoints ?? 0}</div>
      </div> */}

      {/* <div style={{ marginTop: '20px' }}>
        <span onClick={getUserData} style={{ cursor: 'pointer', padding: '10px', margin: '10px', border: '1px solid lightgray', borderRadius: '40px', backgroundColor: 'lightblue' }}>
          Test Request
        </span>
      </div> */}

      {
        //connected &&
        <div style={{ padding: '10px', marginTop: '20px' }}>
          {
            isFarming
              ?
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Farming...  {points} $GLX
                </div>
                <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #fff' }}>
                  <IconClock />
                  {countdown(timer)}
                </div>
              </div>
              :
              !points || !farmingStartedAt
                ?
                <div style={{ borderRadius: '10px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', fontSize: '14px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    To start farming, you need to subscribe to our channel <a href='https://t.me/galaxytonru' target='_blank' style={{ color: blue[600], textDecoration: 'none' }}>GalaxyTon RU</a> or <a href='https://t.me/galaxytoneng' target='_blank' style={{ color: blue[600], textDecoration: 'none' }}>GalaxyTON EN</a>. Then move the slider to the right and click the 'Activate Farming' button.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 'auto' }}>
                    <div style={{ width: '50%', margin: '5px 10px', }}>
                      <input type="range" min="1" max="100" value={value} className="slider" onChange={handleCaptcha} />
                      <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px', color: '#fff', }}>slide to activate button</div>
                    </div>
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', }}>
                      {
                        isCaptcha
                          ?
                          <span onClick={activateFarming} style={{ cursor: 'pointer', padding: '10px', borderRadius: '10px', backgroundColor: '#2196f3' }}>
                            Activate Farming
                          </span>
                          :
                          <span style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#999' }}>
                            Activate Farming
                          </span>
                      }
                    </div>
                  </div>
                </div>

                :
                <div onClick={clamePoints} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Clame {points} $GLX
                  </div>
                  <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid white' }}>
                    <IconClock />
                    00:00:00
                  </div>
                </div>
          }
        </div >
      }

      <div style={{ marginTop: '20px', padding: '10px' }}>
        <Earn totalPoints={totalPoints} setTotalPoints={setTotalPoints} />
      </div>

      <div style={{ marginTop: '50px' }}>
        {notice?.message && <Notify notice={notice} setNotice={setNotice} />}
      </div>
    </div>
  )
}

export default memo(Home) 
