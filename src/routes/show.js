const express = require('express');
const router = express.Router();
const path = require('path')


// function isAdmin(req, res, next){
//   if(req.)
// }

router.get('/:id?', setRoom, (req, res, next)=>{

// Based on this source, for a better understanding 
// Gonna test it to try the peers, and then write my own logic  
// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

    res.render("show.ejs", {
      scripts: ['socket.io.js','show-artist.js']
  })
    
})

router.get('/visitor/:id?', setRoom, (req, res, next)=>{

  // Based on this source, for a better understanding 
  // Gonna test it to try the peers, and then write my own logic  
  // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
  
      res.render("show.ejs", {
        scripts: ['socket.io.js','show-visitor.js']
    })
      
  })


let room = null

function setRoom(req, res, next) {
  if(req.params.id){
    room = `room ${req.params.id}`
    console.log(room)
    return next()
  }else{
    console.log(req.id)
  }
}

function sockets(io){
   
  console.log(router.stack[0].keys[0])

    let activeSockets = []
    let hosts = []

    console.log(activeSockets)
    
    let broadcaster

    io.sockets.on("connection", socket => {
    
      socket.join(room)

      
      io.to(room).emit('test', room);



      socket.on("broadcaster", () => {
        broadcaster = socket.id;
        console.log('broadcaster', broadcaster);
        hosts.push(broadcaster);
        console.log(hosts)
        // socket.broadcast.emit("broadcaster");
        io.to(room).emit('broadcaster')
      });
      socket.on("watcher", () => {
        // socket.to(broadcaster).emit("watcher", socket.id);
        io.in(room).to(broadcaster).emit("watcher", socket.id);
      });
      socket.on("disconnect", () => {
        // socket.to(broadcaster).emit("disconnectPeer", socket.id);
        io.in(room).to(broadcaster).emit("disconnectPeer", socket.id);
      });


      socket.on("offer", (id, message) => {
          // socket.to(id).emit("offer", socket.id, message);
          io.in(room).to(id).emit("offer", socket.id, message);
      });
      socket.on("answer", (id, message) => {
        io.in(room).to(id).emit("answer", socket.id, message);
      });
      socket.on("candidate", (id, message) => {
        io.in(room).to(id).emit("candidate", socket.id, message);
      });
    });

    return router
    
  }

  module.exports = sockets;