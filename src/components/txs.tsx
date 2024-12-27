
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import WebApp from "@twa-dev/sdk"

import IconClose from './icons/close'

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

type Props = {
  setTxs: Dispatch<SetStateAction<boolean>>,
}

const PointsTxs: React.FC<Props> = ({
  setTxs = () => null,
}) => {

  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${host}/points/${userId}`)
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setData(json)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <div style={{ position: 'fixed', left: '0', top: '50px', width: '100%', height: '70%', backgroundColor: 'rgba(0, 0, 0, 1)', color: 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }} onClick={() => { setTxs(false) }}>
        <span style={{ fontSize: '18px', margin: '5px 0' }}>Transactions $GLX</span>
        <span style={{ cursor: 'pointer', width: '24px' }}><IconClose /></span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', padding: '10px' }}>
        <div style={{ width: '30%' }}>Date</div>
        <div style={{ width: '20%', textAlign: 'right' }}>Amount</div>
        <div style={{ width: '50%', textAlign: 'right' }}>Description</div>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)', maxHeight: '95%', overflow: 'auto', backgroundColor: 'rgba(0, 0, 0, 1)' }}>
        {
          data.map((tx: any, i: number) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: '30%' }}>{(new Date(tx.createdAt)).toLocaleDateString("ru-RU")}</div>
              <div style={{ width: '20%', textAlign: 'right' }}>{tx?.amount.toFixed(2)}</div>
              <div style={{ width: '50%', textAlign: 'right' }}>{tx?.amount < 0 ? 'bet' : tx.type}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default PointsTxs