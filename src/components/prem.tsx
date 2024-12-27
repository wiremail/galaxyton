import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CHAIN, TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react"
import { beginCell, toNano } from '@ton/ton'
import { Address } from '@ton/core'
import WebApp from "@twa-dev/sdk"

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

type Props = {
  //premium: string
  // setUser: Dispatch<SetStateAction<number>>,
}


const PremiumUser: React.FC<Props> = ({
}) => {

  const [expired, setExpired] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${host}/txs/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        if (json.createdAt) {
          const date = new Date(json.createdAt)
          date.setMonth(date.getMonth() + 1)
          setExpired(new Date(date).toLocaleString())
        }
      })
      .catch(error => console.error(error))
  }, [])

  async function updatePremium(hash: string) {
    const data = {
      hash,
      userId,
      type: 'premium',
    }

    try {
      fetch(`${host}/txs`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(json => {
          console.log(json)
        })
        .catch(error => console.error(error))
    } catch (error) {
      console.error(error)
    }
  }


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



    async function sendTransaction() {
      try {
        //const userFacingAddress = 'EQD5vcDeRhwaLgAvralVC7sJXI-fc2aNcMUXqcx-BQ-OWnOZ'

        /**
         [
            'gallery', 'gorilla', 'plug',
            'bind',    'reopen',  'soon',
            'sphere',  'mail',    'muscle',
            'custom',  'old',     'trade',
            'giggle',  'direct',  'invest',
            'plug',    'fork',    'forget',
            'total',   'swamp',   'caution',
            'illegal', 'hollow',  'cause'
          ]
         */
        const userFacingAddress = 'EQAFwly7Ejq1YrO9LUNRkfMEtiVeY4dkUkowlApUODTWhLzM'
        const destination = Address.parse(userFacingAddress).toRawString()

        const body = beginCell()
          .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
          .storeStringTail("9734248") // write our text comment
          .endCell();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: destination,
              amount: toNano("0.01").toString(),
              //payload: body.toBoc().toString("base64") // payload with comment in body
            }
          ]
        }

        const transactionRes = await tonConnectUI.sendTransaction(transaction, {
          modals: ['before', 'success', 'error'],
          notifications: ['before', 'success', 'error']
        })
        console.log(transactionRes)

        updatePremium(transactionRes.boc)

        //alert(transactionRes.boc)
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div>
        <button
          style={{ padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white' }}
          onClick={sendTransaction}>
          Subscribe for 1.5 TON
        </button>
      </div>
    )
  }

  return (
    userId !== 252672087
      ? null :
      <>
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px' }}>
          <TonConnectButton />
        </div>

        <div style={{ marginTop: '20px', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
          <div style={{ marginBottom: '10px' }}>Premium until: {expired ? (new Date(expired).toLocaleString()) : 'none'}</div>
          {(!expired || new Date() > new Date(expired)) && <Subscription />}
        </div>
      </>
  )
}

export default PremiumUser
