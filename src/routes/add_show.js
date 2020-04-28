const express = require('express');
const router = express.Router();
const path = require('path')

const mongoose = require('mongoose')
const Show = require('../models/show.js')
const Artist = require('../models/artist.js')

const User = require('../models/User_BASE.js')

router.get('/add-show', (req, res, next)=>{

    res.render("add_show.ejs", {
      scripts: ['socket.io.js','add_show.js']
  })
    
})


router.post('/add-show', (req, res, next)=>{

            Show.watch().
        on('change', data => {
            console.log(new Date(), data)

            // socket.broadcast.emit()
            
        });


    const newShow = new Show({ 
        name: req.body.title, 
        genre: req.body.genres
    })

    console.log(newShow)

    newShow.save((error, doc) => {
        console.log(doc)
    });

    Artist.findOne({ userName: req.session.user }, async function(err, artist){
        if(err){
            console.log(err)
        }else{
            console.log("artist", artist)
            artist.shows.push(newShow._id)

            return await artist.save()
        }
    }).then( res.redirect('/profile'))
    
})

module.exports = function(io){
    let activeSockets = []
    io.on("connection", (socket) => {

        Show.watch().
        on('change', data => {
            console.log(new Date(), data.fullDocument)

            socket.broadcast.emit("client show added", {
                data: data.fullDocument
            });
            
        });

        // socket.on('add show', (data) => {
        //     console.log('data:', data)
        //     socket.broadcast.emit("client show added", {
        //               data: data
        //     });
        // })
    
    //   console.log(`Socket ${socket.id} connected`)
    
    
    //   const existingSocket = activeSockets.find(existingSocket => {
    //     return existingSocket === socket.id
    //   });
    
    //   console.log(existingSocket)
    
    //   if (!existingSocket) {
    //     activeSockets.push(socket.id);
    //     console.log(activeSockets)
    //     socket.emit("update-user-list", {
    //       users: activeSockets.filter(existingSocket => {
    //         return existingSocket !== socket.id
    //       })
    //     });
    
    //     socket.broadcast.emit("update-user-list", {
    //       users: [socket.id]
    //     });
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
    
    })

    return router
    
  }

