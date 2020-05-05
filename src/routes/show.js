const express = require('express');
const router = express.Router();
const path = require('path')


// function isAdmin(req, res, next){
//   if(req.)
// }

router.get('/:id?', setRoom, (req, res, next) => {

  // Based on this source, for a better understanding 
  // Gonna test it to try the peers, and then write my own logic  
  // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

  const io = res.locals['socketio']

  sockets(io)

  res.render("show.ejs", {
    scripts: ['socket.io.js', 'show-artist.js']
  })

})

router.get('/visitor/:id?', setRoom, (req, res, next) => {

  // Based on this source, for a better understanding 
  // Gonna test it to try the peers, and then write my own logic  
  // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/



  const io = res.locals['socketio']

  sockets(io)

  res.render("show.ejs", {
    scripts: ['socket.io.js', 'show-visitor.js']
  })

})


let room = null

function setRoom(req, res, next) {
  if (req.params.id) {
    console.log(req.params.id)
    room = `${req.params.id}`

    return next()
  } else {
    console.log(req.id)
  }
}

// function getRoom(){
//   return room
// }


let activeSockets = []
let hosts = []

function sockets(io) {

  // console.log(router.stack[0].keys[0])

  console.log('room', room)
  console.log(activeSockets)
  console.log(`/${room}`)

  const nsp = io.of(`${room}`);
  let broadcaster
  nsp.on('connection', function (socket) {
    
    console.log('someone connected');
    console.log('broadcaster = ' + broadcaster)

    const alreadyConnected = activeSockets.find(connection => {
      return connection == socket.id
    })

    if(!alreadyConnected){
      activeSockets.push(socket.id)
    }
    nsp.emit('new crowdmember', activeSockets)

    // nsp.on('broadcaster', ()=>{
    //   console.log('namespace test')
    // })

    socket.on("broadcaster", (msg) => {
      console.log(msg)
      console.log('Broadcast event triggered')
      broadcaster = msg;
      console.log('broadcaster', broadcaster);
      hosts.push(broadcaster);
      console.log(hosts)
      socket.broadcast.emit("broadcaster");
      // io.to(room).emit('broadcaster')
    });
    socket.on("watcher", () => {
      console.log('Broadcaster: ' + broadcaster, 'Socket: ' +socket.id)

      if(broadcaster){
        socket.to(broadcaster).emit("watcher", socket.id);
      }
    
      // socket.emit('test', 'who else receives this?')
      // io.in(room).to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("here?")
      socket.to(broadcaster).emit("disconnectPeer", socket.id);

      activeSockets = activeSockets.filter(connection => connection != socket.id)
      console.log(activeSockets, socket.id)
      socket.broadcast.emit('crowdmember disconnected', activeSockets)

    });


    socket.on("offer", (id, message) => {
      console.log("here?")
      socket.to(id).emit("offer", socket.id, message);
      // io.in(room).to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
      socket.to(id).emit("answer", socket.id, message);
      // io.in(room).to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
      // console.log('Came here?')
      socket.to(id).emit("candidate", socket.id, message);
      
      // io.in(room).to(id).emit("candidate", socket.id, message);
    });

    socket.on('visitor chatmessage', (id, message) => {
      socket.broadcast.emit('visitor chatmessage', message);
    })

  });
  nsp.emit('hi', 'everyone!');



  // io.sockets.on("connection", socket => {

  //   // socket.join(room)


  //   io.to(room).emit('test', room);



   
  // });


}

module.exports = router