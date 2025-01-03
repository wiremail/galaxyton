import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CHAIN, TonConnectButton, useTonConnectUI, useTonAddress, TonConnectUIProvider, useTonConnectModal } from "@tonconnect/ui-react"
import { beginCell, toNano } from '@ton/ton'
import { Address, Cell } from '@ton/core'
import WebApp from "@twa-dev/sdk"
import { blue, red, green, grey } from '@mui/material/colors'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import UpdateIcon from '@mui/icons-material/Update'
import './style.css'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'

const holdOn = (ms: number) => new Promise(r => setTimeout(r, ms ?? 5000))

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

function isAdmin() {
  return [252672087, 275294536, 6915261864, 7377461500, 6485072691].includes(userId)
}

const fDate = (d: string) => {
  const date = new Date(d)
  return new Date(date).toLocaleString('ru-RU')
}


type Props = {
  setNotice: Dispatch<SetStateAction<any>>,
}

const Wallet: React.FC<Props> = ({
  setNotice = () => { },
}) => {

  const [expired, setExpired] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<String>('deposit')
  const [pending, setPending] = useState<boolean>(false)
  const [tonConnectUI, setOptions] = useTonConnectUI()
  const { state, open, close } = useTonConnectModal()
  const userFriendlyAddress = useTonAddress()
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState<any>([])
  const [updating, setUpdating] = useState<boolean>(false)

  async function fetchTradingBalance() {
    setUpdating(true)

    fetch(`${host}/balance/${userId}`)
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setWalletBalance(json.balance)
        setTransactions(json.transactions)
      })
      .catch(error => console.error(error))
      .finally(() => setUpdating(false))
  }

  useEffect(() => {
    if (userFriendlyAddress) {
      fetchTradingBalance()
    }
  }, [userFriendlyAddress])

  // useEffect(() => {
  //   fetch(`${host}/txs/${userId}`, {
  //     method: "GET",
  //     headers: {
  //       'ngrok-skip-browser-warning': 'true'
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(json => {
  //       console.log(json)
  //       if (json.createdAt) {
  //         const date = new Date(json.createdAt)
  //         date.setMonth(date.getMonth() + 1)
  //         setExpired(new Date(date).toLocaleString())
  //       }
  //     })
  //     .catch(error => console.error(error))
  // }, [])

  // async function updatePremium(hash: string) {
  //   const data = {
  //     hash,
  //     userId,
  //     type: 'premium',
  //   }

  //   try {
  //     fetch(`${host}/txs`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     })
  //       .then(response => response.json())
  //       .then(json => {
  //         console.log(json)
  //       })
  //       .catch(error => console.error(error))
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  const Subscription = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI()

    // const transaction: any = {
    //   messages: [
    //     {
    //       //address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
    //       address: destination,
    //       //amount: "20000000" //Toncoin in nanotons
    //       amount: toNano(0.1).toString(),
    //     }
    //   ]
    // }

    // console.log(transaction)

  }

  async function handleAmount(e: any) {
    const amount = e.target.value
    //console.log({ amount })
    setAmount(amount)
  }

  function handleClickTab(tab: string) {
    setCurrentTab(tab)
  }


  async function createTransaction(hash: string) {
    const data = {
      hash,
      userId,
      amount,
      walletAddress: userFriendlyAddress
    }

    try {
      fetch(`${host}/deposit`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json)
          setNotice({ severity: json.error ? 'error' : 'success', message: json.message, open: true })
        })
        .catch(error => console.error(error))
    } catch (error) {
      console.error(error)
    }
  }

  async function deposit() {
    try {
      if (!amount) throw new Error('Wrong amount')

      //const targetFacingAddress = 'EQAFwly7Ejq1YrO9LUNRkfMEtiVeY4dkUkowlApUODTWhLzM'
      //const targetFacingAddress = 'EQD5vcDeRhwaLgAvralVC7sJXI-fc2aNcMUXqcx-BQ-OWnOZ'
      const targetFacingAddress = 'UQBrCUMLfqEC6uloopksPpdOqyqp6iaoS4Uxm-ZKz_0lenmk'
      const destination = Address.parse(targetFacingAddress).toRawString()

      const body = beginCell()
        .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
        .storeStringTail("9734248") // write our text comment
        .endCell()

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: destination,
            amount: toNano(amount).toString(),
            //payload: body.toBoc().toString("base64") // payload with comment in body
          }
        ]
      }

      const transactionRes = await tonConnectUI.sendTransaction(transaction, {
        modals: ['before', 'success', 'error'],
        notifications: ['before', 'success', 'error']
      })
      console.log(transactionRes)
      console.log('Transaction hash:', transactionRes.boc)

      //updatePremium(transactionRes.boc)
      //alert(transactionRes.boc)

      if (transactionRes?.boc) {
        const hash = Cell.fromBase64(transactionRes.boc).hash().toString('hex')
        await createTransaction(hash)
      }
      else throw new Error('Transaction failed')

    } catch (error: any) {
      console.log(error.message)
      return setNotice({ severity: 'error', message: error.message, open: true })
    }
    finally {
      setAmount(null)
    }
  }


  async function withdraw() {
    const data = {
      amount,
      userId,
      walletAddress: userFriendlyAddress
    }

    try {
      fetch(`${host}/withdraw`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json)
          return setNotice({ severity: json?.error ? 'error' : 'success', message: json.message, open: true })
        })
        .catch(error => console.error(error))
    } catch (error) {
      console.error(error)
    }
    finally {
      setAmount(null)
    }
  }

  async function handleSubmit() {
    try {
      setPending(true)

      await new Promise(_ => setTimeout(_, 3000))

      if (currentTab === 'deposit') {
        deposit()
      } else if (currentTab === 'withdraw') {
        withdraw()
      } else {
        throw new Error('Unknown action')
      }
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setPending(false)
    }
  }


  const handleConnection = async () => {
    userFriendlyAddress ? await tonConnectUI.disconnect() : tonConnectUI.openModal()
  }


  const txColor = (status: string) => {
    switch (status) {
      case 'pending':
        return grey[400]
      case 'confirmed':
        return green[600]
      case 'rejected':
        return red[600]
      default:
        return 'white'
    }
  }


  return (
    !isAdmin()
      ? null
      : <div style={{ height: '100%' }}>
        <TonConnectUIProvider
          actionsConfiguration={{
            twaReturnUrl: 'https://t.me/galaxyton_bot'
          }}
        >
          {/* <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px' }}>
          <TonConnectButton className='ton-connect-page__button' />
        </div> */}

          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', }}>
              <div style={{ width: '50%' }}>
                <button style={{ padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: blue[600], color: 'white' }} onClick={handleConnection}>
                  {
                    userFriendlyAddress
                      ? userFriendlyAddress.slice(0, 4) + '...' + userFriendlyAddress.slice(-4)
                      : 'Connect Wallet'
                  }
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div onClick={() => handleClickTab('deposit')} style={{ color: currentTab === 'deposit' ? blue[600] : 'white', display: 'flex', alignItems: 'center' }}><AddCircleOutlineIcon style={{ marginRight: '4px', fontSize: '1.1em' }} />Deposit</div>
                  <div onClick={() => handleClickTab('withdraw')} style={{ color: currentTab === 'withdraw' ? blue[600] : 'white', display: 'flex', alignItems: 'center' }}><RemoveCircleOutlineIcon style={{ marginRight: '4px', fontSize: '1.1em' }} />Withdraw</div>
                </div>
                {/* <div style={{ fontSize: 'small', marginTop: '5px' }}>BlockId: <span style={{ color: blue[600] }}>{currentBlock === 'closed' ? closedBlock.id : currentBlock === 'live' ? liveBlock.id : nextBlock.id}</span></div> */}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '10px' }}>
              <input type="text" style={{ border: 'none', borderRadius: '10px', padding: '10px' }} onChange={handleAmount} />
              <button
                style={{ marginLeft: '10px', padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: pending ? 'gray' : '#2196f3', color: 'white' }}
                onClick={handleSubmit}
                disabled={pending}
              >
                Submit
              </button>
            </div>
          </div>

        </TonConnectUIProvider>

        <div style={{ marginTop: '5px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '10px', marginTop: '2px' }}>
            <div>Balance: {walletBalance} TON</div>
            <div>
              {
                updating
                  ? <CircularProgress size={24} />
                  : <UpdateIcon onClick={fetchTradingBalance} />
              }
            </div>
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'scroll', overflowX: 'hidden', padding: '10px' }}>
            {
              updating
                ? <><Skeleton /><Skeleton /><Skeleton /></>
                : transactions?.map((tx: any, i: number) => (
                  <div key={tx?._id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ width: '25%' }}>{tx?.amount}</div>
                    <div style={{ width: '50%' }}>{fDate(tx?.updatedAt)}</div>
                    <div style={{ width: '25%', display: 'flex', justifyContent: 'flex-end', color: txColor(tx?.status) }}>{tx?.status}</div>
                  </div>
                ))
            }
          </div>
        </div>


      </div>
  )
}

export default Wallet
