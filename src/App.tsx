
import { useState, memo, useEffect, FC, useCallback } from 'react'
import "./App.css"
import Jetton from "./components/Jetton"
import { CHAIN, TonConnectButton } from "@tonconnect/ui-react"
//import { useTonConnect } from "./hooks/useTonConnect";
import "@twa-dev/sdk"
import WebApp from "@twa-dev/sdk"

import Notify from './components/notify'
import Earn from './components/earn'
import Tasks from './components/tasks'
import Friends from './components/friends'

import {
  ButtonHome,
  ButtonEarn,
  ButtonTasks,
  ButtonFriends
} from './components/buttons'

// import iconMining from './assets/bitcoin.png'
// import iconEarn from './assets/coin.png'
// import iconFriends from './assets/users.png'
// import iconTasks from './assets/planning.png'

import galaxy from '../src/assets/galaxy.jpg'

const host = 'https://0291-46-53-245-243.ngrok-free.app'




function App() {
  //const { network } = useTonConnect()

  const [workspace, setWorkspace] = useState<string | null>(null)
  const [totalPoints, setTotalPoints] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)

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
        //farming(+json?.farmingStartAt || 0)
      })
      .catch(error => console.error(error))
  }

  return (
    <div style={{ backgroundImage: `url(${galaxy})`, backgroundPosition: 'left', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px' }}>
        <TonConnectButton />
      </div>

      <div style={{ display: 'inline-block', padding: '10px', border: '1px solid #f57c00', margin: '10px', borderRadius: '10px', backgroundColor: '#f57c00', color: 'white', fontWeight: 'bold' }}>
        {totalPoints} pts
      </div>


      {/* <Routes>
        <Route path={'/galaxyton'} element={<Jetton />} />
        <Route path={'/galaxyton/earn'} element={<Earn totalPoints={totalPoints} />} />
        <Route path={'/galaxyton/tasks'} element={<Tasks />} />
        <Route path={'/galaxyton/friends'} element={<Friends />} />
      </Routes> */}

      {!workspace && <Jetton />}
      {workspace === 'earn' && <Earn totalPoints={totalPoints} />}
      {workspace === 'tasks' && <Tasks />}
      {workspace === 'friends' && <Friends />}



      <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', padding: '10px', backgroundColor: '#1769aa', color: 'white', display: 'flex', justifyContent: 'center' }}>
        <ButtonHome setWorkspace={setWorkspace} />
        <ButtonEarn setWorkspace={setWorkspace} />
        <ButtonTasks setWorkspace={setWorkspace} />
        <ButtonFriends setWorkspace={setWorkspace} />
      </div>


      {message && <Notify message={message} setMessage={setMessage} />}
    </div>
  )
}

export default App
