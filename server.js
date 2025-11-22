// server.js
// Simple minimal backend for pilot. NOT production hardened.
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('.')) // serve index.html for quick test

// in-memory drivers dataset (in production use DB and auth)
let drivers = [
  {id:'d1',name:'Stephen','lat':-1.286389,'lng':36.817223,vehicle:'boda',rating:4.7,acceptanceRate:0.95,completedRides:120,verified:true,phone:'+254700000001'},
  {id:'d2',name:'Aisha','lat':-1.2833,'lng':36.8167,vehicle:'boda',rating:4.6,acceptanceRate:0.9,completedRides:230,verified:true,phone:'+254700000002'},
  {id:'d3',name:'Paul','lat':-1.3000,'lng':36.8200,vehicle:'cargo',rating:4.2,acceptanceRate:0.8,completedRides:80,verified:false,phone:'+254700000003'}
]

// expose drivers list
app.get('/drivers', (req,res)=> res.json(drivers))

// ride request endpoint
app.post('/request', (req,res)=>{
  const {pickup,destination,driverId,estimate} = req.body
  // basic validation
  if(!pickup||!destination) return res.status(400).json({error:'missing pickup/destination'})
  const requestId = 'r_'+Math.random().toString(36).slice(2,9)
  // in real system: persist request, notify driver (push/WS/SMs), allocate, payments
  console.log('New request',requestId, req.body)
  return res.json({status:'ok',requestId})
})

// admin echo
app.get('/health', (req,res)=>res.json({ok:true,ts:Date.now()}))

// socket.io realtime
io.on('connection', socket => {
  console.log('socket connected', socket.id)
  socket.on('drivers:fetch', ()=>{
    socket.emit('drivers:update', drivers)
  })
  socket.on('disconnect', ()=>console.log('disconnect', socket.id))
})

const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>console.log('Server listening on',PORT))