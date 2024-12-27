import IconTech from './icons/tech'

type Props = {
}

const Tech: React.FC<Props> = ({
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      width: '100%',
      marginTop: '-150px',
      padding: '20px 0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <span style={{ width: '150px', height: '150px' }}><IconTech /></span>
      <h1 style={{ marginTop: '60px' }}>Technical Work</h1>
    </div>
  )
}

export default Tech