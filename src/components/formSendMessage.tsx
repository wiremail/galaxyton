
import { useState, Dispatch, SetStateAction } from 'react'

import { DotsScaleSpinner } from './icons/dotsScaleSpinner'
import IconClose from './icons/close'

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST

type Props = {
  setWorkspace: Dispatch<SetStateAction<string | null>>,
}

const FormSendMessage: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState<boolean>(false)

  function onSendData() {
    setPending(true)

    const data = {
      message
    }

    fetch(`${host}/message`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) return alert(json.error)

        setMessage('')
      })
      .catch(error => console.error(error))
      .finally(() => setPending(false))
  }

  const onChangeMessage = (e: any) => {
    setMessage(e.target.value)
  }


  let disabled = !message || pending

  return (
    <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '50%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }} onClick={() => { setWorkspace(null) }}>
        <span style={{ fontSize: '18px', margin: '5px 0' }}>Message</span>
        <span style={{ cursor: 'pointer', width: '24px' }}><IconClose /></span>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', }}>
        <textarea
          rows={4}
          placeholder={'Message'}
          value={message}
          onChange={onChangeMessage}
          style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}
        />

        <button disabled={disabled} onClick={onSendData} style={{ margin: '10px 0', padding: '10px', border: '0', borderRadius: '10px', backgroundColor: disabled ? 'gray' : '#2196f3', color: 'white', fontWeight: 'bold' }}>
          {pending ? <DotsScaleSpinner /> : 'Send'}
        </button>
      </div>

    </div>
  )
}

export default FormSendMessage