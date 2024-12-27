
import { useState, memo, useEffect, FC, useCallback, useContext } from 'react'
import "./App.css"

import { CHAIN, TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react"
import { beginCell, toNano } from '@ton/ton'
import { Address } from '@ton/core'
//import { useTonConnect } from "./hooks/useTonConnect"
import "@twa-dev/sdk"
import WebApp from "@twa-dev/sdk"

import Home from "./components/home"
import Notify from './components/notify'
import PremiumUser from './components/prem'
import Earn from './components/earn'
import Tasks from './components/tasks'
import Friends from './components/friends'
import Top from './components/top'
import Wallet from './components/wallet'
import FormNewTask from './components/formNewTask'
import FormSendMessage from './components/formSendMessage'
// import Tech from './components/tech'
import PointsTxs from './components/txs'

import IconUser from './components/icons/user'
import AddTaskIcon from '@mui/icons-material/AddTask'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'

import {
  ButtonHome,
  ButtonEarn,
  ButtonTasks,
  ButtonFriends,
  ButtonTop,
  ButtonPremium,
  ButtonWallet
} from './components/buttons'


import galaxy from '../src/assets/galaxy.webp'
import { address } from 'ton-core'


const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const tech = JSON.parse(import.meta.env.VITE_TECH || '')
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

//console.log({ dev, host })

interface INotice {
  severity: string | null;
  message: string | null;
  open: boolean;
}


function Menu({ handleClickMenu }: any) {
  return (
    <div style={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid grey', borderRadius: '10px', color: 'white', top: '40px', left: '10px', display: 'flex', flexDirection: 'column', zIndex: '1', width: '160px' }}>
      <span style={{ padding: '10px', borderBottom: '1px solid grey', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => handleClickMenu('formTask')}><AddTaskIcon /> Add New Task</span>
      <span style={{ padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => handleClickMenu('formMessage')}><ForwardToInboxIcon /> Send Message</span>
    </div>
  )
}

function isAdmin() {
  return [252672087, 275294536, 6915261864, 7377461500].includes(userId)
}

function App() {
  WebApp.expand()

  //const { network } = useTonConnect()

  const [workspace, setWorkspace] = useState<string | null>(localStorage.getItem("workspace") || null)
  const [totalPoints, setTotalPoints] = useState<number>(0)
  const [user, setUser] = useState<any>(null)
  const [menu, setMenu] = useState<boolean>(false)
  const [txs, setTxs] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [notice, setNotice] = useState<INotice>({
    severity: null,
    message: null,
    open: false
  })


  useEffect(() => {
    localStorage.setItem("workspace", workspace || '')
    setTxs(false)
  }, [workspace])


  useEffect(() => {
    getUserData()
  }, [])

  async function getUserData() {
    fetch(`${host}/users/${userId}`)
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setUser(json)
        setTotalPoints(json?.points || 0)
        //farming(+json?.farmingStartAt || 0)
      })
      .catch(error => console.error(error))
  }

  function handleClickMenu(item: string) {
    if (!isAdmin()) return

    setWorkspace(item || null)
    setMenu(false)
  }

  const checkImage = (path: string) =>
    new Promise(resolve => {
      const img = new Image()
      img.onload = () => resolve({ path, status: 'success' })
      img.onerror = () => resolve({ path, status: 'error' })
      img.src = path
    })

  useEffect(() => {
    if (!user?.userId) return

    checkImage(`https://galaxyton.com/img/${user?.userId}.jpg`).then((x: any) => {
      setAvatar(x.status === 'success' ? x.path : null)
    })
  }, [])


  function workspaceComponent() {
    switch (workspace) {
      case 'home': return <Home totalPoints={totalPoints} setTotalPoints={setTotalPoints} />
      case 'earn': return <Earn workspace={workspace} setNotice={setNotice} setTotalPoints={setTotalPoints} />
      case 'premium': return <PremiumUser />
      case 'tasks': return <Tasks />
      case 'friends': return <Friends />
      case 'top': return <Top />
      case 'wallet': return <Wallet setNotice={setNotice} />
      case 'formTask': return <FormNewTask setWorkspace={setWorkspace} />
      case 'formMessage': return <FormSendMessage setWorkspace={setWorkspace} />
      default: return <Home totalPoints={totalPoints} setTotalPoints={setTotalPoints} />
    }
  }

  return (
    <div style={{ backgroundImage: `url(${galaxy})`, backgroundPosition: 'left', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '100vh' }}>
      {/* {tech && <Tech />} */}
      {!tech && <>
        <div style={{ position: 'fixed', left: '0', top: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', display: 'flex', justifyContent: 'space-between', zIndex: 'auto', borderBottomRightRadius: '20px', borderBottomLeftRadius: '20px', }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px' }} onClick={() => setMenu(state => !state)}>
            {
              avatar
                ? <img src={avatar} alt="avatar" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                : <span style={{ color: 'white', width: '38px', height: '38px' }}><IconUser /></span>
            }
            <div style={{ marginLeft: '10px', color: 'white', fontSize: 'small' }}>
              <div>{user?.userName || user?.userId}</div>
              <div>UX:{user?.experience || 0}</div>
            </div>
          </div>

          <div style={{ display: 'inline-block', padding: '10px', color: 'white' }} onClick={() => setTxs(state => !state)}>
            {totalPoints.toFixed(2)} $GLX
          </div>
        </div>

        <div style={{ position: 'absolute', top: '50px', height: 'calc(100vh - 90px)', width: '100%', overflowY: 'scroll', overflowX: 'hidden', zIndex: '0' }}>
          {workspaceComponent()}
        </div>

        {txs && <PointsTxs setTxs={setTxs} />}

        {/* <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px' }}>
          <TonConnectButton />
        </div> */}

        <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', display: 'flex', justifyContent: 'center', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', }}>
          <ButtonHome isActive={workspace === 'home' || workspace === null} setWorkspace={setWorkspace} />
          <ButtonEarn isActive={workspace === 'earn'} setWorkspace={setWorkspace} />
          {/* <ButtonPremium isActive={workspace === 'premium'} setWorkspace={setWorkspace} /> */}
          <ButtonTop isActive={workspace === 'top'} setWorkspace={setWorkspace} />
          <ButtonTasks isActive={workspace === 'tasks'} setWorkspace={setWorkspace} />
          <ButtonFriends isActive={workspace === 'friends'} setWorkspace={setWorkspace} />
          {isAdmin() && <ButtonWallet isActive={workspace === 'wallet'} setWorkspace={setWorkspace} />}
        </div>

        {notice?.message && <Notify notice={notice} setNotice={setNotice} />}

        {isAdmin() && menu && <Menu handleClickMenu={handleClickMenu} />}
      </>
      }
    </div>
  )
}

export default App
