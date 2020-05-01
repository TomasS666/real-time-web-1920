const express = require('express');
const router = express.Router();
const path = require('path')


// function isAdmin(req, res, next){
//   if(req.)
// }

router.get('/', (req, res, next)=>{

// Based on this source, for a better understanding 
// Gonna test it to try the peers, and then write my own logic  
// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

    res.render("show.ejs", {
      scripts: ['socket.io.js','show-artist.js']
  })
    
})

router.get('/visitor', (req, res, next)=>{

  // Based on this source, for a better understanding 
  // Gonna test it to try the peers, and then write my own logic  
  // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
  
      res.render("show.ejs", {
        scripts: ['socket.io.js','show-visitor.js']
    })
      
  })

module.exports = function(io){
    // let activeSockets = []
    // io.on("connection", (socket) => {
    
    //   console.log(`Socket ${socket.id} connected`)
    
    
    //   const existingSocket = activeSockets.find(existingSocket => {
    //     return existingSocket === socket.id
    //   });
    
    //   console.log(existingSocket)
    
    //   if(!existingSocket){
    //     socket.broadcast.emit("client joined room", {
    //       user: socket.id
    //     })
    //   }
    //   // if (!existingSocket) {
    //   //   activeSockets.push(socket.id);
    //   //   console.log(activeSockets)
    //   //   socket.emit("update-user-list", {
    //   //     users: activeSockets.filter(existingSocket => {
    //   //       return existingSocket !== socket.id
    //   //     })
    //   //   });
    
    //   //   socket.broadcast.emit("update-user-list", {
    //   //     users: [socket.id]
    //   //   });
    //   // }
    
    //   socket.on("disconnect", () => {
    //     activeSockets = activeSockets.filter(existingSocket => {
    //       return existingSocket !== socket.id
    //     });
    //     console.log(activeSockets)
    //     socket.broadcast.emit("remove-user", {
    //       socketId: socket.id
    //     });
    //   });
    
    //   socket.on("call-user", data => {
    //     console.log('Calling user');
    //     socket.to(data.to).emit("call-made", {
    //       offer: data.offer,
    //       socket: socket.id
    //     });
    //   });
    
  
    
    //   socket.on("make-answer", data => {
    //     console.log("Making answer");
    //     socket.to(data.to).emit("answer-made", {
    //       socket: socket.id,
    //       answer: data.answer
    //     });
    //   });
    
    // })






    // let activeSockets = []

    // console.log(activeSockets)
    // io.on("connection", (socket) => {
    
    //   console.log(`Socket ${socket.id} connected`)
    
    
    //   const existingSocket = activeSockets.find(existingSocket => {
    //     return existingSocket === socket.id
    //   });
    
    //   console.log(existingSocket)
    
    //   // if (!existingSocket) {
    //   //   activeSockets.push(socket.id);
    //   //   console.log(activeSockets)
    //   //   socket.emit("update-user-list", {
    //   //     users: activeSockets.filter(existingSocket => {
    //   //       return existingSocket !== socket.id
    //   //     }),
    //   //     newlyAdded: 'test'
    //   //   });
    
    //   //   socket.broadcast.emit("update-user-list", {
    //   //     users: [socket.id]
    //   //   });
    //   // }

    //   if(!existingSocket){
    //     socket.broadcast.emit("client joined room", {
    //       user: socket.id
    //     })
    //   }
    
    //   socket.on("disconnect", () => {
    //     activeSockets = activeSockets.filter(existingSocket => {
    //       return existingSocket !== socket.id
    //     });
    //     console.log(activeSockets)
    //     socket.broadcast.emit("remove-user", {
    //       socketId: socket.id
    //     });
    //   });
    
    //   socket.on("call-user", data => {
    //     console.log('Calling user');
    //     socket.to(data.to).emit("call-made", {
    //       offer: data.offer,
    //       socket: socket.id
    //     });
    //   });
    
    
    //   socket.on("make-answer", data => {
    //     console.log("Making answer");
    //     socket.to(data.to).emit("answer-made", {
    //       socket: socket.id,
    //       answer: data.answer
    //     });
    //   });
    
    // })







    // new test



    let activeSockets = []

    console.log(activeSockets)
    
    let broadcaster

    io.sockets.on("connection", socket => {
      socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
      });
      socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
      });
      socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
      });


        socket.on("offer", (id, message) => {
          socket.to(id).emit("offer", socket.id, message);
      });
      socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
      });
      socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
      });
    });







    return router
    
  }

