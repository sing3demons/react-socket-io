import './navbar.css'
import Message from '../../assets/message.svg'
import Notification from '../../assets/notification.svg'
import Settings from '../../assets/settings.svg'
import { useEffect, useState } from 'react'

function ShowIcon({ img, onclick, counter }) {
  console.log(counter)
  return (
    <div className='icon' onClick={onclick}>
      <img src={img} className='iconImg' alt='' />
      {counter?.length > 0 && <div className='counter'>{counter?.length}</div>}
    </div>
  )
}

function Navbar({ socket }) {
  const [notification, setNotification] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    socket?.on('receiveNotification', (data) => {
      setNotification((prev) => [...prev, data])
    })
  }, [socket])

  const handleRead = () => {
    setNotification([])
    setOpen(false)
  }

  const displayNotification = ({ senderName, type }) => {
    let action = ''
    if (type === 1) {
      action = 'liked your post'
    } else if (type === 2) {
      action = 'commented on your post'
    } else {
      action = 'shared'
    }
    return <span className='notification'>{`${senderName} ${action}  your post.`}</span>
  }
  return (
    <div className='navbar'>
      <span className='logo'>Sing App</span>
      <div className='icons'>
        <ShowIcon img={Notification} onclick={() => setOpen(!open)} counter={notification} />
        <ShowIcon img={Message} onclick={() => setOpen(!open)} />
        <ShowIcon img={Settings} onclick={() => setOpen(!open)} />
      </div>
      {open && (
        <div className='notifications'>
          {notification.map((noti) => displayNotification(noti))}
          <button className='nButton' onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
