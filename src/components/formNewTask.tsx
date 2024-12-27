
import { useState, Dispatch, SetStateAction } from 'react'
import WebApp from "@twa-dev/sdk"

import { DotsScaleSpinner } from './icons/dotsScaleSpinner'
import { UploadImage } from './uploadImage'
import IconClose from './icons/close'

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

type Props = {
  setWorkspace: Dispatch<SetStateAction<string | null>>,
}

const FormNewTask: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [target, setTarget] = useState('Telegram')
  const [rewardAmount, setRewardAmount] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [pending, setPending] = useState<boolean>(false)

  function onSendData() {
    setPending(true)

    const data = {
      title,
      description,
      link,
      image,
      rewardAmount,
      target,
      userId
    }

    fetch(`${host}/tasks`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) return alert(json.error)

        setTitle('')
        setDescription('')
        setImage(null)
        setLink('')
        setTarget('Telegram')
        setRewardAmount('')
      })
      .catch(error => console.error(error))
      .finally(() => setPending(false))
  }

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value)
  }

  const onChangeLink = (e: any) => {
    setLink(e.target.value)
  }

  const onChangeTarget = (e: any) => {
    setTarget(e.target.value)
  }

  const onChangeRewardAmount = (e: any) => {
    setRewardAmount(e.target.value)
  }

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value)
  }

  let disabled = !title || !link || !target || !rewardAmount || pending

  return (
    <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '80%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderTopRightRadius: '20px', borderTopLeftRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }} onClick={() => { setWorkspace(null) }}>
        <span style={{ fontSize: '18px', margin: '5px 0' }}>New Task</span>
        <span style={{ cursor: 'pointer', width: '24px' }}><IconClose /></span>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', }}>
        <input
          type="text"
          placeholder={'Title'}
          value={title}
          onChange={onChangeTitle}
          style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}
        />

        <input
          type="text"
          placeholder={'Description'}
          value={description}
          onChange={onChangeDescription}
          style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}
        />

        <input
          type="text"
          placeholder={'Link'}
          value={link}
          onChange={onChangeLink}
          style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}
        />

        <input
          type="text"
          placeholder={'Reward amount'}
          value={rewardAmount}
          onChange={onChangeRewardAmount}
          style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}
        />

        <select value={target} onChange={onChangeTarget} style={{ margin: '5px 0', padding: '10px', border: '0', borderRadius: '10px', }}>
          <option value={'telegram'}>Telegram</option>
          <option value={'twitter'}>X (Twitter)</option>
          <option value={'discord'}>Discord</option>
          <option value={'instagram'}>Instagram</option>
          <option value={'app'}>WebApp</option>
        </select>

        <UploadImage setImage={setImage} />

        <button disabled={disabled} onClick={onSendData} style={{ margin: '20px 0', padding: '10px', border: '0', borderRadius: '10px', backgroundColor: disabled ? 'gray' : '#2196f3', color: 'white', fontWeight: 'bold' }}>
          {pending ? <DotsScaleSpinner /> : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default FormNewTask