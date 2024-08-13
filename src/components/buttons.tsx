import { Dispatch, SetStateAction } from 'react'


type Props = {
  setWorkspace: Dispatch<SetStateAction<string | null>>,
}

const ButtonHome: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  return (
    <div onClick={() => setWorkspace(null)} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
      <div>
        {/* <svg fill="#fff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 496" stroke="#fff" width={24}><g strokeLinecap="round" strokeLinejoin="round"></g><g><path d="M492.832,89.616C489.928,87.424,424.376,39.128,280,32.712V0h-64v32.712C71.624,39.128,6.072,87.424,3.168,89.616 L0,92.024v24.288l11.248-5C11.952,111,82.776,80,176,80c12.648,0,24,3.064,24,40v8h16v368h64V128h16v-8c0-36.936,11.352-40,24-40 c93.032,0,164.048,31,164.76,31.312l11.24,4.984V92.024L492.832,89.616z M232,16h32v16h-32V16z M264,480h-32V128h32V480z M320,64 c-31.864,0-38.768,24.168-39.832,48H280h-64h-0.168c-1.064-23.832-7.968-48-39.832-48c-45.488,0-85.456,6.952-115.312,14.456 C98.792,63.856,160.368,48,248,48c86.968,0,148.44,15.744,186.672,30.288C404.872,70.856,365.168,64,320,64z"></path> <rect x="240" y="56" width="16" height="16"></rect> <rect x="272" y="56" width="16" height="16"></rect> <rect x="208" y="56" width="16" height="16"></rect></g></svg> */}
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff" width={24}><g strokeLinecap="round" strokeLinejoin="round"></g><g><path d="M981.4 502.3c-9.1 0-18.3-2.9-26-8.9L539 171.7c-15.3-11.8-36.7-11.8-52 0L70.7 493.4c-18.6 14.4-45.4 10.9-59.7-7.7-14.4-18.6-11-45.4 7.7-59.7L435 104.3c46-35.5 110.2-35.5 156.1 0L1007.5 426c18.6 14.4 22 41.1 7.7 59.7-8.5 10.9-21.1 16.6-33.8 16.6z" fill="#ffffff"></path><path d="M810.4 981.3H215.7c-70.8 0-128.4-57.6-128.4-128.4V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c0 23.8 19.4 43.2 43.2 43.2h594.8c23.8 0 43.2-19.4 43.2-43.2V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c-0.1 70.8-57.7 128.4-128.5 128.4z" fill="#fffff"></path></g></svg>
        {/* <img src={iconMining} alt="Icon" width={30} /> */}
      </div>
      <div>Home</div>
    </div>
  )
}


const ButtonEarn: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  return (
    <div onClick={() => setWorkspace('earn')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
      <div>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff" width={24}><g strokeLinecap="round" strokeLinejoin="round"></g><g><path d="M15.9377 15.9377C19.3603 15.4795 22 12.548 22 9C22 5.13401 18.866 2 15 2C11.452 2 8.52049 4.63967 8.06227 8.06227M16 15C16 18.866 12.866 22 9 22C5.13401 22 2 18.866 2 15C2 11.134 5.13401 8 9 8C12.866 8 16 11.134 16 15Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        {/* <img src={iconEarn} alt="Icon" width={30} /> */}
      </div>
      <div>Earn</div>
    </div>
  )
}


const ButtonTasks: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  return (
    <div onClick={() => setWorkspace('tasks')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
      <div>
        <svg fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308.847 308.847" stroke="#fff" width={24}><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M61.423,0c-22.607,0-41,18.393-41,41s18.393,41,41,41c22.607,0,41-18.393,41-41S84.031,0,61.423,0z M61.423,64 c-12.683,0-23-10.318-23-23s10.317-23,23-23c12.683,0,23,10.318,23,23S74.107,64,61.423,64z"></path> <path d="M279.424,48.983h-152c-4.971,0-9,4.029-9,9c0,4.971,4.029,9,9,9h152c4.971,0,9-4.029,9-9 C288.424,53.012,284.395,48.983,279.424,48.983z"></path> <path d="M127.423,33.017h152c4.971,0,9-4.029,9-9c0-4.971-4.029-9-9-9h-152c-4.971,0-9,4.029-9,9 C118.424,28.988,122.453,33.017,127.423,33.017z"></path> <path d="M61.423,113.423c-22.607,0-41,18.393-41,41c0,22.607,18.393,41,41,41c22.607,0,41-18.393,41-41 S84.031,113.423,61.423,113.423z M61.423,177.423c-12.683,0-23-10.318-23-23s10.317-23,23-23c12.683,0,23,10.318,23,23 S74.107,177.423,61.423,177.423z"></path> <path d="M279.424,162.406h-152c-4.971,0-9,4.029-9,9s4.029,9,9,9h152c4.971,0,9-4.029,9-9S284.395,162.406,279.424,162.406z"></path> <path d="M279.424,128.44h-152c-4.971,0-9,4.029-9,9s4.029,9,9,9h152c4.971,0,9-4.029,9-9S284.395,128.44,279.424,128.44z"></path> <path d="M61.423,226.847c-22.607,0-41,18.393-41,41s18.393,41,41,41c22.607,0,41-18.393,41-41S84.031,226.847,61.423,226.847z M61.423,290.847c-12.683,0-23-10.318-23-23s10.317-23,23-23c12.683,0,23,10.318,23,23S74.107,290.847,61.423,290.847z"></path> <path d="M279.424,275.83h-152c-4.971,0-9,4.029-9,9s4.029,9,9,9h152c4.971,0,9-4.029,9-9S284.395,275.83,279.424,275.83z"></path> <path d="M279.424,241.863h-152c-4.971,0-9,4.029-9,9c0,4.971,4.029,9,9,9h152c4.971,0,9-4.029,9-9 C288.424,245.892,284.395,241.863,279.424,241.863z"></path> <circle cx="61.423" cy="41" r="8.122"></circle> <circle cx="61.423" cy="154.423" r="8.122"></circle> </g></svg>
        {/* <img src={iconTasks} alt="Icon" width={30} /> */}
      </div>
      <div>Tasks</div>
    </div>
  )
}

const ButtonFriends: React.FC<Props> = ({
  setWorkspace = () => null,
}) => {
  return (
    <div onClick={() => setWorkspace('friends')} style={{ width: '50px', cursor: 'pointer', margin: '5px', padding: '10px', border: '1px solid #2196f3', borderRadius: '10px', backgroundColor: '#2196f3', color: 'white', textAlign: 'center', textDecoration: 'none' }}>
      <div>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff" width={24}><g strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.1992 12C12.9606 12 15.1992 9.76142 15.1992 7C15.1992 4.23858 12.9606 2 10.1992 2C7.43779 2 5.19922 4.23858 5.19922 7C5.19922 9.76142 7.43779 12 10.1992 12Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1 22C1.57038 20.0332 2.74795 18.2971 4.36438 17.0399C5.98081 15.7827 7.95335 15.0687 10 15C14.12 15 17.63 17.91 19 22" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17.8205 4.44006C18.5822 4.83059 19.1986 5.45518 19.579 6.22205C19.9594 6.98891 20.0838 7.85753 19.9338 8.70032C19.7838 9.5431 19.3674 10.3155 18.7458 10.9041C18.1243 11.4926 17.3302 11.8662 16.4805 11.97" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17.3203 14.5701C18.6543 14.91 19.8779 15.5883 20.8729 16.5396C21.868 17.4908 22.6007 18.6827 23.0003 20" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        {/* <img src={iconFriends} alt="Icon" width={30} /> */}
      </div>
      <div>Friends</div>
    </div>
  )
}

export { ButtonHome, ButtonEarn, ButtonTasks, ButtonFriends }