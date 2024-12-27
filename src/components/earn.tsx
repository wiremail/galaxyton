import { Dispatch, SetStateAction, useState, useEffect, useContext } from 'react'
import { blue } from '@mui/material/colors'
import WebApp from "@twa-dev/sdk"

import { io } from 'socket.io-client'
import TradingViewWidget from './TradingView'

import {
  clearExpiredBets,
  setBets,
  getQueryVariable
} from './Helper'
import ClosedBlock from './blocks/ClosedBlock'
import LiveBlock from './blocks/LiveBlock'
import CalculatingBlock from './blocks/CalculatingBlock'
import NextBlock from './blocks/NextBlock'
import InputBlock from './blocks/InputBlock'
//import LaterBlock from './blocks/LaterBlock'
import CustomizedCircleProgress from './CustomizedCircleProgress'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'

// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// import { StringifyOptions } from 'querystring'

const dev = import.meta.env.VITE_ENV === 'development'
//const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const url = dev ? 'http://127.0.0.1:3200' : 'https://galaxyton.com'
//console.log({ url })
const socket = io(url, { transports: ['websocket'] })
//console.log({ socket })
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId
const predictionInterval = 180
const defaultPayrollCoin = 'TON'

// const delay = (ms: number) => new Promise(_ => setTimeout(_, ms))
// const fixed = (t: number, n: number) => Math.round(t * Math.pow(10, n)) / Math.pow(10, n)
//const duration = 10


type Props = {
  workspace: string,
  setNotice: Dispatch<SetStateAction<any>>,
  setTotalPoints: Dispatch<SetStateAction<number>>
}

const Earn: React.FC<Props> = ({
  workspace = null,
  setNotice = () => { },
  setTotalPoints = () => { },
}) => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [timer, setTimer] = useState<Number>(predictionInterval)
  const [progressValue, setProgressValue] = useState<Number>(0)
  const [isCalculating, setIsCalculating] = useState<Boolean>(false)
  const [lastPrice, setLastPrice] = useState<Number>(0)
  const [diffPrice, setDiffPrice] = useState<Number>(0)
  const [clients, setClients] = useState<Number>(0)
  const [distributeAmount, setDistributeAmount] = useState<Number>(0)
  const [payrollCoin, setPayrollCoin] = useState<String>(defaultPayrollCoin)
  const [betBalance, setBetBalance] = useState<Number>(0)
  const [balance, setBalance] = useState([])
  const [block, setBlock] = useState<Boolean>(false)
  const [currentBlock, setCurrentBlock] = useState<String>('next')

  // ---> Blocks -------------------
  const [laterBlock, setLaterBlock] = useState({ id: '' })
  const [nextBlock, setNextBlock] = useState({ id: '' })
  const [liveBlock, setLiveBlock] = useState({
    id: '',
    lockedPrice: 0
  })
  const [closedBlock, setClosedBlock] = useState({
    id: '',
    lockedPrice: 0,
    lastPrice: 0
  })

  // ---> PrizePool -------------------
  const INITIAL_PRIZE_POOL = {
    amount: 0,
    coin: '',
    payoutRate: { up: 0, down: 0 },
    bettors: { up: 0, down: 0 }
  }
  const [closedPrizePool, setClosedPrizePool] = useState(INITIAL_PRIZE_POOL)
  const [livePrizePool, setLivePrizePool] = useState(INITIAL_PRIZE_POOL)
  const [nextPrizePool, setNextPrizePool] = useState(INITIAL_PRIZE_POOL)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
      if (workspace === 'earn') socket.emit("boot", { userId })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('pong', () => {
      //
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])


  useEffect(() => {
    if (workspace === 'earn') socket.emit("boot", { userId })
  }, [workspace])


  useEffect((): any => {
    socket.on("boot", (data) => {
      console.log('boot', data)
      setData(data)
    })

    return () => socket.off('boot')
  }, [])


  useEffect((): any => {
    socket.on("price", (data) => {
      //dev && console.log('price', data)
      setTimer(data?.timer)
      setProgressValue((predictionInterval - (data?.timer ?? 0)) * 100 / predictionInterval)
      setLastPrice(data.lastPrice)
      setDiffPrice((data.diffPrice).toFixed(2))
      setClients(data.clients)
    })

    return () => socket.off('price')
  }, [lastPrice])

  useEffect((): any => {
    socket.on("bet", async (data) => {
      if (payrollCoin === data.coin) {
        setNextPrizePool(data.prizePool)
      }
    })

    return () => socket.off('bet')
  }, [])

  useEffect((): any => {
    socket.on("calc", (data) => {
      //dev && console.log(data)
      setIsCalculating(data?.isCalculating)

      if (data?.isCalculating) {
        setTimer(180)
        setProgressValue(0)
        return
      }

      setData(data)
      clearExpiredBets()
    })

    return () => socket.off('calc')
  }, [])

  useEffect((): any => {
    socket.on("event", async (data) => {
      dev && console.log('data', data)
      await handleMessage(data)

      if (data.isBetAccepted) {
        setTotalPoints(data?.fundsAvailable ?? 0)
      }
    })

    return () => socket.off('event')
  }, [])


  // ---> Bets ---------------------
  const [isBetPending, setBetPending] = useState(false)
  const [minBetValue, setMinBetValue] = useState(0)
  const [isShowInputForm, setShowInputForm] = useState(false)
  const [trend, setTrend] = useState('')

  const handlePlaceBet = (event: any) => {
    const trend = event.target.dataset.value.split(" ").pop().toLowerCase()
    setTrend(trend)
    setShowInputForm(true)
    //fetchBetCoinBalance(account)
  }

  const onCancelBetInput = () => setShowInputForm(false)
  const onSubmitBetValue = (data: any) => {
    if (isBetPending) return

    setBetPending(true)
    socket.emit("event", data)
  }

  useEffect(() => {
    const inviterId = getQueryVariable('ref')
    if (localStorage.getItem('inviterId') === null && inviterId) {
      localStorage.setItem('inviterId', inviterId)
    }
  }, [])

  const setData = (data: any) => {
    setTimer(data.timer < 0 ? predictionInterval : data.timer)
    setProgressValue((predictionInterval - data.timer) * 100 / predictionInterval)
    setClosedBlock({
      id: data.blocksStack[0]?.closed[0]?._id ?? '',
      lockedPrice: data.blocksStack[0]?.closed[0]?.lockedPrice ?? 0,
      lastPrice: data.blocksStack[0]?.closed[0]?.closedPrice ?? 0,
    })
    setLiveBlock({
      id: data.blocksStack[0]?.live[0]?._id ?? '',
      lockedPrice: data.blocksStack[0]?.live[0]?.lockedPrice ?? 0,
    })
    setNextBlock({ id: data.blocksStack[0]?.next[0]?._id ?? '' })
    setLaterBlock({ id: data.blocksStack[0]?.later[0]?._id ?? '' })

    //const prizePool = data?.prizePools?.find((item) => item.coin === payrollCoin) ?? {}
    const prizePool = data?.prizePool ?? {}
    setClosedPrizePool(prizePool?.closed ?? INITIAL_PRIZE_POOL)
    setLivePrizePool(prizePool?.live ?? INITIAL_PRIZE_POOL)
    setNextPrizePool(prizePool?.next ?? INITIAL_PRIZE_POOL)

    setBetBalance(data?.balance ?? 0)
    setDiffPrice(data?.lastPrice - data?.blocksStack[0]?.live[0]?.lockedPrice)
    //setMinBetValue(data.minBetValue.find((item) => item.coin === payrollCoin)?.value)
    setMinBetValue(data?.minBetValue)
    setClients(data?.clients ?? 0)
    setBets(data?.userBets)
  }

  async function handleMessage(data: any) {
    if (data.error) {
      setBetPending(false)
      return setNotice({ severity: 'error', message: data.message, open: true })
    }

    if (data?.isBetAccepted) {
      setBetPending(false)
      const { blockId, amount, coin, trend, message, totalAmount } = data
      localStorage.setItem(blockId, JSON.stringify({ amount: totalAmount, coin, trend, timestamp: Date.now() }))
      setShowInputForm(false)
      return setNotice({ severity: 'success', message: data.message, open: true })
    }

    // if (data?.isPayrollCoinChanged) {
    //   setClosedPrizePool(data.prizePools?.closed ?? 0)
    //   setLivePrizePool(data.prizePools?.live ?? 0)
    //   setNextPrizePool(data.prizePools?.next ?? 0)
    //   setMinBetValue(data.minBetValue)
    //   setBetBalance(data.walletBalance)
    //   return
    // }


    if (data?.isFetchWalletBalance) {
      setBalance(data.walletBalance)
      return
    }

    if (data?.isFetchBetCoinBalance) {
      setBetBalance(data.walletBalance)
      return
    }

    if (data?.isFetchDistributeAmount) {
      setDistributeAmount(data.distributeAmount)
      return
    }
  }

  function handleClickBlock(block: string) {
    setBlock(false)
    setCurrentBlock(block)
  }

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '265px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', }}>
          <div style={{ width: '20%' }}>
            <CustomizedCircleProgress
              data={{
                progressValue,
                timer
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div onClick={() => handleClickBlock('closed')} style={{ color: currentBlock === 'closed' ? blue[600] : 'white', display: 'flex', alignItems: 'center' }}><CheckCircleOutlineIcon style={{ marginRight: '4px', fontSize: '1.1em' }} />Closed</div>
              <div onClick={() => handleClickBlock('live')} style={{ color: currentBlock === 'live' ? blue[600] : 'white', display: 'flex', alignItems: 'center' }}><AccessTimeIcon style={{ marginRight: '4px', fontSize: '1.1em' }} />Live</div>
              <div onClick={() => handleClickBlock('next')} style={{ color: currentBlock === 'next' ? blue[600] : 'white', display: 'flex', alignItems: 'center' }}><PendingOutlinedIcon style={{ marginRight: '4px', fontSize: '1.1em' }} />Next</div>
            </div>
            <div style={{ fontSize: 'small', marginTop: '5px' }}>BlockId: <span style={{ color: blue[600] }}>{currentBlock === 'closed' ? closedBlock.id : currentBlock === 'live' ? liveBlock.id : nextBlock.id}</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px' }}>
          {
            currentBlock === 'closed' && <ClosedBlock
              data={closedBlock}
              prizePool={closedPrizePool}
              payrollCoin={payrollCoin}
            />
          }

          {
            currentBlock === 'live' &&
            (
              isCalculating
                ?
                <CalculatingBlock blockId={liveBlock.id} />
                :
                <LiveBlock
                  data={liveBlock}
                  prizePool={livePrizePool}
                  payrollCoin={payrollCoin}
                  lastPrice={lastPrice}
                  diffPrice={diffPrice}
                />
            )
          }

          {
            currentBlock === 'next' &&
            (
              isShowInputForm
                ?
                <InputBlock
                  data={nextBlock}
                  onCancelBetInput={onCancelBetInput}
                  onSubmitBetValue={onSubmitBetValue}
                  betBalance={betBalance}
                  trend={trend}
                  minBetValue={minBetValue || 0.01}
                  payrollCoin={payrollCoin}
                  isCalculating={isCalculating}
                  isBetPending={isBetPending}
                  setNotice={setNotice}
                />
                :
                <NextBlock
                  data={nextBlock}
                  prizePool={nextPrizePool}
                  payrollCoin={payrollCoin}
                  handlePlaceBet={handlePlaceBet}
                  isCalculating={isCalculating}
                />
            )
          }
        </div>
      </div>

      <div style={{ height: 'calc(100% - 300px)', width: '100%', marginTop: '2px' }}>
        <TradingViewWidget />
      </div>


      {/*
        <CustomizedSnackbar
          open={snackbar.open}
          closeSnackbarFn={closeSnackbarFn}
          message={snackbar.message}
          severity={snackbar.severity}
        /> */}
    </div>
  )
}

export default Earn
