import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import iconStar from '../assets/star.png'
// import './style.css'

import WebApp from "@twa-dev/sdk"

const botId = 'galaxy_ton_bot'
const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

type Props = {
  // multiplier: number,
  // setMultiplier: Dispatch<SetStateAction<number>>,
}

function ShareLink() {
  const share = `https://t.me/share/url?url=https://t.me/${botId}?start=${userId}`
  return (
    <a href={share} style={{ width: '90%', marginRight: '5px', cursor: 'pointer', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
      Share Link
    </a>
  )
}


function CopyLink() {
  return (
    <div onClick={handleCopyLink} style={{ width: '10%', marginLeft: '5px', cursor: 'pointer', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
        <g strokeLinecap="round" strokeLinejoin="round"></g>
        <g>
          <path d="M15 3H9C6.79086 3 5 4.79086 5 7V15" stroke="#ffffff" strokeWidth="2"></path>
          <path d="M9 11.5C9 10.304 9.00149 9.49062 9.0712 8.87226C9.13864 8.27406 9.25916 7.98334 9.41329 7.78248C9.51969 7.64381 9.64381 7.51969 9.78248 7.41329C9.98334 7.25916 10.2741 7.13864 10.8723 7.0712C11.4906 7.00149 12.304 7 13.5 7C14.696 7 15.5094 7.00149 16.1277 7.0712C16.7259 7.13864 17.0167 7.25916 17.2175 7.41329C17.3562 7.51969 17.4803 7.64381 17.5867 7.78248C17.7408 7.98334 17.8614 8.27406 17.9288 8.87226C17.9985 9.49062 18 10.304 18 11.5V15.5C18 16.696 17.9985 17.5094 17.9288 18.1277C17.8614 18.7259 17.7408 19.0167 17.5867 19.2175C17.4803 19.3562 17.3562 19.4803 17.2175 19.5867C17.0167 19.7408 16.7259 19.8614 16.1277 19.9288C15.5094 19.9985 14.696 20 13.5 20C12.304 20 11.4906 19.9985 10.8723 19.9288C10.2741 19.8614 9.98334 19.7408 9.78248 19.5867C9.64381 19.4803 9.51969 19.3562 9.41329 19.2175C9.25916 19.0167 9.13864 18.7259 9.0712 18.1277C9.00149 17.5094 9 16.696 9 15.5V11.5Z" stroke="#ffffff" strokeWidth="2"></path>
        </g>
      </svg>
    </div>
  )
}

function handleCopyLink() {
  navigator.clipboard.writeText(`https://t.me/${botId}?start=${userId}`)
}

const Friends: React.FC<Props> = () => {
  const [friendList, setFriendList] = useState<any[]>([])

  useEffect(() => {
    getFriends()
  }, [])

  async function getFriends() {
    fetch(`${host}/friends/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setFriendList(json || [])
      })
      .catch(error => console.error(error))
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
        <div style={{ fontSize: '12px', marginBottom: '10px' }}>
          Earn 10% from your referred friends and another 7.5% from their referred friends (5% and 2.5% up to level 3).
        </div>
        <div>Your referral link:</div>
        <div>https://t.me/{botId}?start={userId}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <ShareLink />
          <CopyLink />
        </div>
      </div>

      <div style={{ marginTop: '5px', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Invited Friends: {friendList.length}</div>
        <div style={{ maxHeight: '250px', overflowY: 'scroll', overflowX: 'hidden' }}>
          {friendList?.map((friend: any, i: number) => (
            <div key={friend?.userId} style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid grey', paddingBottom: '10px' }}>
              <img
                src={iconStar}
                width="20"
                height="20"
                alt="Star"
              />
              <span style={{ marginLeft: '10px' }}>{friend?.userName || friend?.userId}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Friends
