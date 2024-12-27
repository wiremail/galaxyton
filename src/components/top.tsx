import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import WebApp from "@twa-dev/sdk"

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

type Props = {
  // multiplier: number,
  // setMultiplier: Dispatch<SetStateAction<number>>,
}


const Top: React.FC<Props> = () => {

  const [topList, setTopList] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number | 0>(0)

  useEffect(() => {
    getTopUsers()
  }, [])

  async function getTopUsers() {
    fetch(`${host}/top/${userId}`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        setTopList(json?.top || [])
        setUserRank(json?.userRank || 0)
      })
      .catch(error => console.error(error))
  }

  return (
    <>
      <div style={{ marginTop: '20px' }}></div>
      <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
        Your Rank #{userRank}
      </div>

      <div style={{ marginTop: '5px', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Top 10</div>
        <div style={{ maxHeight: '350px', overflowY: 'scroll', overflowX: 'hidden' }}>
          {topList?.map((user: any, i: number) => (
            <div key={user?._id} style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid grey', paddingBottom: '10px' }}>
              <span style={{ marginLeft: '10px' }}>#{i + 1}</span>
              <span style={{ marginLeft: '10px' }}>{user.info[0]?.userName ?? user._id}</span>
              <span style={{ marginLeft: '10px' }}>{user?.count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Top
