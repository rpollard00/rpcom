import { useCoolStore } from '../services/store'

const Notification = () => {
  const msg: string = useCoolStore((state) => state.notifyMsg)
  
  return (
    <>
      {msg !== "" ?
        <div>msg</div>
        :
        <div></div>}   
    </>
  )
}

export default Notification
