const express = require('express');
const router = express.Router();
const path = require('path')

router.get('/', (req, res, next)=>{

// Based on this source, for a better understanding 
// Gonna test it to try the peers, and then write my own logic  
// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

    res.render("show.ejs")
    
})

module.exports = function(io){
    let activeSockets = []
    io.on("connection", (socket) => {
    
      console.log(`Socket ${socket.id} connected`)
    
    
      const existingSocket = activeSockets.find(existingSocket => {
        return existingSocket === socket.id
      });
    
      console.log(existingSocket)
    
      if (!existingSocket) {
        activeSockets.push(socket.id);
        console.log(activeSockets)
        socket.emit("update-user-list", {
          users: activeSockets.filter(existingSocket => {
            return existingSocket !== socket.id
          })
        });
    
        socket.broadcast.emit("update-user-list", {
          users: [socket.id]
        });
      }
    
      socket.on("disconnect", () => {
        activeSockets = activeSockets.filter(existingSocket => {
          return existingSocket !== socket.id
        });
        console.log(activeSockets)
        socket.broadcast.emit("remove-user", {
          socketId: socket.id
        });
      });
    
      socket.on("call-user", data => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id
        });
      });
    
    
      socket.on("make-answer", data => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer
        });
      });
    
    })

    return router
    
  }

