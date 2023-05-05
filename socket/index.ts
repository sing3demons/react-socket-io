import { Server } from 'socket.io'
import { createServer } from 'http'

const io = new Server({
  cors: {
    // origin: 'http://127.0.0.1:3000',
    origin: '*',
  }, 
})

interface User {
  username: string
  socketId: string
}

let onlineUser: User[] = []

const addNewUser = (username: string, socketId: string) => {
  !onlineUser.some((user: User) => user.username === username) && onlineUser.push({ username, socketId })
}

const removeUser = (socketId: string) => {
  onlineUser = onlineUser.filter((user: User) => user.socketId !== socketId)
}

const getUser = (username: string) => {
  return onlineUser.find((user: User) => user.username === username)
}

function getOnlineUser() {
  return onlineUser
}

io.on('connection', (socket) => {
  console.info(`Client connected [id=${socket.id}]`)

  socket.on('newUser', (username: string) => {
    console.log(username)
    addNewUser(username, socket.id)
  })

  interface Notification {
    senderName: string
    receiverName: string
    type: string
  }

  socket.on('sendNotification', ({ senderName, receiverName, type }: Notification) => {
    const receiver: User | undefined = getUser(receiverName)
    if (!receiver) {
      return
    }
    console.log(receiver)

    io.to(receiver.socketId).emit('receiveNotification', { senderName, type })
  })

  //   io.to('sing-room').emit('message', 'Hello World')
  socket.on('disconnect', () => {
    removeUser(socket.id)
    console.log(`Client disconnected [id=${socket.id}]`)
  })
})

const httpServer = createServer((req, res) => {
  //   io.emit('message', 'Hello World')
  const users = getOnlineUser()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ users: users }))
})

httpServer.listen(5000, () => console.log('listening on port 5000'))
io.listen(httpServer)
