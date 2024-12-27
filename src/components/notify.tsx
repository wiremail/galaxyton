import { useEffect, Dispatch, SetStateAction } from 'react'

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g>
        <path fill="currentColor" d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z"></path>
        <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"></path>
      </g>
    </svg>
  )
}

interface INotice {
  severity: string | null;
  message: string | null;
  open: boolean;
}

type Props = {
  notice: {
    severity: string | null;
    message: string | null;
    open: boolean;
  },
  setNotice: Dispatch<SetStateAction<INotice>>,
}

const Notify: React.FC<Props> = ({
  notice = {
    severity: null,
    message: null,
    open: false
  },
  setNotice = () => { },
}) => {

  useEffect(() => {
    if (notice.message) {
      setTimeout(() => setNotice({ severity: null, message: null, open: false }), 5000)
    }
  }, [notice.message])

  const txColor = notice.severity === 'success' ? '#000000' : '#ffffff'
  const bgColor = notice.severity === 'success' ? '#4caf50' : '#f44336'

  return (
    <div style={{ width: '100%', position: 'fixed', top: '0', left: '0', padding: '10px', backgroundColor: bgColor, color: txColor, zIndex: 'auto', display: 'flex', justifyContent: 'space-between', }}>
      <div style={{ width: '90%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        {notice.message}
      </div>
      <div style={{ width: '10%', display: 'flex', justifyContent: 'end', alignItems: 'center', fontWeight: 'bold' }}>
        <span onClick={() => setNotice({ severity: null, message: null, open: false })} style={{ cursor: 'pointer', marginRight: '20px' }}><IconClose /></span>
      </div>
    </div>
  )
}

export default Notify
