import { Dispatch, SetStateAction } from 'react'
import { blue } from '@mui/material/colors'
import HomeIcon from '@mui/icons-material/Home'
import StarIcon from '@mui/icons-material/Star'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PaidIcon from '@mui/icons-material/Paid'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

type Props = {
  isActive: boolean,
  setWorkspace: Dispatch<SetStateAction<string | null>>,
}

const ButtonHome: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace(null)} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center', }}>
      <HomeIcon />
      <div>Home</div>
    </div>
  )
}


const ButtonEarn: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('earn')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center' }}>
      <PaidIcon />
      <div>Earn</div>
    </div>
  )
}


const ButtonTasks: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('tasks')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center' }}>
      <TaskAltIcon />
      <div>Tasks</div>
    </div>
  )
}

const ButtonFriends: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('friends')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center' }}>
      <PeopleAltIcon />
      <div>Frens</div>
    </div>
  )
}

const ButtonTop: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('top')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center' }}>
      <StarIcon />
      <div>Top</div>
    </div>
  )
}


const ButtonPremium: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('premium')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center' }}>
      <WorkspacePremiumIcon />
      <div>Prem</div>
    </div>
  )
}

const ButtonWallet: React.FC<Props> = ({
  isActive = false,
  setWorkspace = () => null,
}) => {
  const color = isActive ? blue[600] : 'white'
  return (
    <div onClick={() => setWorkspace('wallet')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '5px', color: color, textAlign: 'center', }}>
      <AccountBalanceWalletIcon />
      <div>Wallet</div>
    </div>
  )
}

export { ButtonHome, ButtonEarn, ButtonTasks, ButtonFriends, ButtonTop, ButtonPremium, ButtonWallet }