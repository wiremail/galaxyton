import { FC, useEffect, useState } from "react"
import WebApp from "@twa-dev/sdk"


import IconCheck from './icons/check'
// import IconClose from './icons/close'
// import IconRightArrow from './icons/rightArrow'
// import { DotsScaleSpinner } from './icons/dotsScaleSpinner'
import IconApp from '../assets/app.png'

const dev = import.meta.env.VITE_ENV === 'development'
const host = dev ? import.meta.env.VITE_HOST_DEV : import.meta.env.VITE_HOST
const defaultUserId = dev ? 252672087 : 0
const userId = WebApp?.initDataUnsafe?.user?.id || defaultUserId

interface ITask {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  rewardAmount: number | 0;
  state: number | 0;
}

const TabTwo: FC<{}> = () => {
  const [tasks, setTasks] = useState<ITask[]>([])

  async function getTasks() {
    //const userId = WebApp?.initDataUnsafe?.user?.id || 252672087

    fetch(`${host}/tasks?userId=${userId}&type=done`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        setTasks(json || [])
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    getTasks()
  }, [])

  function handleClickTask(task: ITask) {
    // setOpen(true)
    // setTask(task)
  }

  function Task({ task, handleClickTask }: { task: ITask, handleClickTask: (task: ITask) => void }) {
    return (
      <div style={{ marginBottom: '2px', padding: '10px', borderTopRightRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }} onClick={() => window.location.href = task.link}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
          <div style={{ width: '90%', display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'hidden', }}>
            <img src={task?.image ?? IconApp} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 15px' }}>
              <div style={{ fontSize: '18px', whiteSpace: 'nowrap', alignContent: 'start', }}>{task.title}</div>
              <div style={{ fontSize: '12px', whiteSpace: 'nowrap', alignContent: 'start', }}>{task.description}</div>
            </div>
          </div>
          <div style={{ width: '10%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <IconCheck />
          </div>
        </div>
      </div>
    )
  }


  return (
    <div style={{ maxHeight: '450px', overflowY: 'scroll', overflowX: 'hidden' }}>
      {tasks?.map((task: ITask) => (<Task task={task} key={task._id} handleClickTask={handleClickTask} />))}
      {!tasks.length && <div style={{ padding: '10px', borderTopRightRadius: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>No completed tasks</div>}
    </div>
  );
};
export default TabTwo