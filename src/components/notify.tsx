import { useEffect, Dispatch, SetStateAction } from 'react'


type Props = {
  message: string | null,
  setMessage: Dispatch<SetStateAction<string | null>>,
}

const Notify: React.FC<Props> = ({
  message = null,
  setMessage = () => null,
}) => {

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 5000)
    }
  }, [message])

  return (
    <div style={{ width: '200px', position: 'fixed', top: '20px', left: '20px', padding: '8px 20px', margin: '0 auto', backgroundColor: '#616161', color: 'white', border: '1px solid #616161', borderRadius: '20px', zIndex: 'auto', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '80%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        {message}
      </div>
      <div style={{ width: '20%', display: 'flex', justifyContent: 'end', alignItems: 'center', fontWeight: 'bold' }}>
        <span onClick={() => setMessage(null)}>x</span>
      </div>
    </div>
  )
}

export default Notify
