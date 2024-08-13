import { useState, memo, useEffect, FC, useCallback } from 'react'
import { CHAIN } from "@tonconnect/ui-react"
import { Address } from "ton-core"
//import { useJettonContract } from "../hooks/useJettonContract"
import { useTonConnect } from "../hooks/useTonConnect"
import IconClock from './clock'

import WebApp from "@twa-dev/sdk"
//import Notify from './notify'

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, fromNano } from "ton";

const fixed = (t: number, n: number) => Math.round(t * Math.pow(10, n)) / Math.pow(10, n)
const host = 'https://0291-46-53-245-243.ngrok-free.app'
const botId = 'FirstgalaxytonBot'

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms))


function msToHMS(ms: number) {
  return new Date(ms).toISOString().slice(11, 19)
}


interface IUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface IPrediction {
  trend: string | null;
  price: number | null;
  result: string | null;
}


const Jetton: FC = (): JSX.Element => {
  const { connected, wallet, network, address } = useTonConnect()
  const [balance, setBalance] = useState('0.0')
  const [totalPoints, setTotalPoints] = useState(0)
  const [points, setPoints] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isFarming, setIsFarming] = useState(false)
  const [userData, setUserData] = useState<IUserData | null>(null)
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  // const [message, setMessage] = useState<string | null>(null)


  // const tg = (window as any).Telegram?.WebApp
  // console.log(tg)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as IUserData)
    }
  }, [])


  useEffect(() => {
    getUserData()
    //getTonPrice()
  }, [])



  async function getUserData() {
    const userId = WebApp?.initDataUnsafe?.user?.id || 252672087

    fetch(`${host}/users/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        setTotalPoints(json?.points || 0)
        farming(+json?.farmingStartAt || 0)
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


  function farming(farmingStartAt: number) {
    let harvest = 0.01
    let farmingTime = 6 * 60 * 60 * 1000 // 6 hours
    let timeLeft = farmingStartAt + farmingTime - Date.now()
    let farmedTime = farmingTime - timeLeft
    let points = timeLeft > 0
      ? fixed(Math.floor(farmedTime / 1000) * harvest, 2)
      : fixed(Math.floor(farmingTime / 1000) * harvest, 2)

    console.log({
      farmingStartAt: msToHMS(farmingStartAt),
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
    const userId = WebApp?.initDataUnsafe?.user?.id || 252672087// null
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
        //console.log({ json })
        farming(+json.farmingStartAt)
      })
      .catch(error => console.error(error))
  }


  async function clamePoints() {
    const userId = WebApp?.initDataUnsafe?.user?.id || 252672087 //null
    if (!userId) return console.log('Not logged in')

    const data = {
      userId,
      points
    }

    fetch(`${host}/points`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        setTotalPoints(json?.points || 0)
        setPoints(0)

        // setMessage('Points successfully clamed!')
        // setIsOpen(true)
      })
      .catch(error => console.error(error))
  }



  return (
    <>
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
        <div style={{ marginTop: '20px' }}>
          {
            isFarming
              ?
              <div style={{ padding: '10px', margin: '10px', border: '1px solid #757575', borderRadius: '10px', backgroundColor: '#757575', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Farming...  {points} pts
                </div>
                <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #fff' }}>
                  <IconClock />
                  {countdown(timer)}
                </div>
              </div>
              :
              !points
                ?
                <div onClick={activateFarming} style={{ cursor: 'pointer', padding: '10px', margin: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Activate Farming
                </div>
                :
                <div onClick={clamePoints} style={{ cursor: 'pointer', padding: '10px', margin: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Clame {points} points
                  </div>
                  <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid white' }}>
                    <IconClock />
                    00:00:00
                  </div>
                </div>
          }
        </div >
      }

      <div style={{ marginTop: '50px' }}></div>

    </>
  );
}



{/* <FlexBoxRow>
          Jetton Wallet
          <Ellipsis>{jettonWalletAddress ? jettonWalletAddress : "Loading..."}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Balance
          <div>{balance ?? "Loading..."}</div>
        </FlexBoxRow>
        <Button
          disabled={!connected} onClick={mint}>
          Mint jettons
        </Button> */}

export default memo(Jetton) 
