import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar.jsx'
import Card from './components/card/card.jsx'
import { posts } from './data.js'
import {  io } from 'socket.io-client'

function App() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState('')
  // const socket = io('http://127.0.0.1:5000')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    setSocket(io('http://127.0.0.1:5000'))
  }, [])

  useEffect(() => {
    socket?.emit('newUser', user)
  }, [socket, user])

  const onSummit = (username) => {
    return function () {
      setUser(username)
    }
  }

  const onChange = (e) => {
    setUsername(e.target.value)
  }

  return (
    <div className='container'>
      {user ? (
        <>
          <Navbar socket={socket} />
          {posts.map((post) => (
            <Card key={post.id} socket={socket} post={post} user={user} />
          ))}
          <span className='username'>{user}</span>
        </>
      ) : (
        <div className='login'>
          <input type='text' placeholder='username' onChange={(e) => onChange(e)} />
          <button onClick={onSummit(username)}>Login</button>
        </div>
      )}
    </div>
  )
}

export default App
