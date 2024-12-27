import { Dispatch, SetStateAction, useEffect, useState } from 'react'
// import WebApp from "@twa-dev/sdk"

// import IconCheck from './icons/check'
// import IconClose from './icons/close'
// import IconRightArrow from './icons/rightArrow'
// import { DotsScaleSpinner } from './icons/dotsScaleSpinner'
// import IconApp from '../assets/app.png'

import "./style.css"
import Tabs from "./tabs"
import TabOne from "./tabOne"
import TabTwo from "./tabTwo"

// const botId = 'galaxy_ton_bot'
// const userId = WebApp?.initDataUnsafe?.user?.id || 252672087

// const host = import.meta.env.VITE_HOST

//const delay = (ms: number) => new Promise(_ => setTimeout(_, ms))


// interface ITask {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   link: string;
//   rewardAmount: number | 0;
//   state: string | null;
// }

type Props = {
  // multiplier: number,
  // setMultiplier: Dispatch<SetStateAction<number>>,
}

const Tasks: React.FC<Props> = () => {

  // const [tasks, setTasks] = useState<ITask[]>([])
  // const [task, setTask] = useState<ITask | null>(null)
  // const [open, setOpen] = useState<boolean>(false)
  // const [pending, setPending] = useState<string | null>(null)

  // useEffect(() => {
  //   getTasks()
  // }, [])

  // async function getTasks() {
  //   //const userId = WebApp?.initDataUnsafe?.user?.id || 252672087

  //   fetch(`${host}/tasks/${userId}`, {
  //     method: "GET",
  //     headers: {
  //       'ngrok-skip-browser-warning': 'true'
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(json => {
  //       //console.log(json)
  //       setTasks(json || [])
  //     })
  //     .catch(error => console.error(error))
  // }

  // function handleClickGo(taskId: string, rewardAmount: number) {
  //   setPending(taskId)

  //   const userId = WebApp?.initDataUnsafe?.user?.id || 252672087 //null

  //   const data = {
  //     userId,
  //     amount: rewardAmount,
  //     type: 'task',
  //     payload: taskId,
  //   }

  //   fetch(`${host}/points`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then(response => response.json())
  //     .then(json => {
  //       console.log(json)
  //       setTasks(tasks.filter((task: ITask) => task._id === taskId ? task.state = 1 : task))
  //     })
  //     .catch(error => console.error(error))
  //     .finally(() => setPending(null))
  // }

  // // function handleClickCheck(taskId: string) {
  // //   console.log('check', taskId)
  // //   setTasks(tasks.filter((task: ITask) => task._id === taskId ? task.state = 2 : task))
  // // }

  // function handleClickTask(task: ITask) {
  //   setOpen(true)
  //   setTask(task)
  // }

  // function Task({ task, handleClickTask, handleClickGo }: { task: ITask, handleClickTask: (task: ITask) => void, handleClickGo: (taskId: string, rewardAmount: number) => void }) {
  //   return (
  //     <div style={{ marginTop: '5px', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
  //       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
  //         <div style={{ width: '90%', display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'hidden', }}>
  //           <img src={task?.image ?? IconApp} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
  //           <div style={{ display: 'flex', flexDirection: 'column', padding: '0 15px' }}>
  //             <div style={{ fontSize: '18px', whiteSpace: 'nowrap', alignContent: 'start', }}>{task.title}</div>
  //             <div style={{ fontSize: '12px', whiteSpace: 'nowrap', alignContent: 'start', }}>{task.description}</div>
  //           </div>
  //         </div>
  //         <div style={{ width: '10%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
  //           {
  //             task?.state
  //               ? <IconCheck />
  //               : <div
  //                 onClick={() => handleClickTask(task)}
  //                 style={{ color: 'white', cursor: 'pointer' }}
  //               ><IconRightArrow /></div>
  //           }
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }


  // function TaskModal({ setOpen, task }: { setOpen: (open: boolean) => void, task: ITask | null }) {

  //   async function handleClickClaim(task: ITask) {
  //     console.log('claim task')
  //     const userId = WebApp?.initDataUnsafe?.user?.id || 252672087 //null
  //     const taskId = task._id
  //     setPending(taskId)

  //     //await delay(3000)

  //     // setTimeout(() => {
  //     //   window.location.href = task.link
  //     // }, 3000)


  //     const data = {
  //       userId,
  //       amount: task.rewardAmount,
  //       type: 'task',
  //       payload: taskId,
  //     }

  //     console.log({ data })
  //     fetch(`${host}/points`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     })
  //       .then(response => response.json())
  //       .then(json => {
  //         console.log(json)

  //         setTasks(tasks.filter((task: ITask) => task._id === taskId ? task.state = 1 : task))
  //         setOpen(false)

  //         console.log('goto', task.link)
  //         window.location.href = task.link
  //       })
  //       .catch(error => console.error(error))
  //       .finally(() => setPending(null))
  //   }

  //   return (
  //     <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '40%', backgroundColor: '#4dabf5', color: 'white', display: 'flex', flexDirection: 'column', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', }}>
  //       <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }} onClick={() => setOpen(false)}>
  //         <span style={{ fontWeight: 'bold' }}>+{task?.rewardAmount} $GLX</span>
  //         <span style={{ cursor: 'pointer', width: '24px' }}><IconClose /></span>
  //       </div>
  //       <div style={{ maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
  //         {/* <div style={{ padding: '0 10px', fontSize: '14px' }}><img src={task?.image} width={30} height={30} /></div> */}
  //         <div style={{ padding: '0 10px', fontSize: '18px', fontWeight: 'bold' }}>{task?.title}</div>
  //         <div style={{ padding: '0 10px', fontSize: '14px' }}>{task?.description}</div>
  //       </div>

  //       <div
  //         style={{ backgroundColor: pending ? 'gray' : '#1769aa', padding: '10px', borderRadius: '10px', margin: '10px', textAlign: 'center' }}
  //         onClick={() => (pending ? null : handleClickClaim(task!))}
  //       >
  //         {pending ? <DotsScaleSpinner /> : 'Clame'}
  //       </div>
  //     </div >
  //   )
  // }


  type TabsType = {
    label: string;
    index: number;
    Component: React.FC<{}>;
  }[];

  // Tabs Array
  const tabs: TabsType = [
    {
      label: "New",
      index: 1,
      Component: TabOne
    },
    {
      label: "Done",
      index: 2,
      Component: TabTwo
    }
  ];

  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);


  return (
    <div style={{ marginTop: '20px' }}>
      {/* {userId === 252672087 && <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />} */}
      <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />

      {/* <div style={{ maxHeight: '500px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {tasks?.map((task: ITask) => (<Task task={task} key={task._id} handleClickGo={handleClickGo} handleClickTask={handleClickTask} />))}
      </div> */}
      {/* 
      {open && <TaskModal setOpen={setOpen} task={task} />} */}
    </div>
  )
}

export default Tasks
