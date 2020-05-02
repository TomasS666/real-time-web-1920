const express = require('express');
const router = express.Router();
const path = require('path')

const uuid = require('uuid')

const mongoose = require('mongoose')
const Show = require('../../models/show.js')
const Artist = require('../../models/artist.js')

// middleware
const isLoggedIn = require('../../middleware/is-logged-in')

const User = require('../../models/User_BASE.js')


const dateFormat = require('dateformat');

router.get('/add-show', isLoggedIn, (req, res, next)=>{

    let currentDate = new Date();

    // add a day
    currentDate.setDate(currentDate.getDate() + 1); 

   const date = dateFormat(currentDate, 'yyyy-mm-dd')
    console.log(date)
    res.render("add_show.ejs", {
        current_date: date,
        scripts: ['socket.io.js','add_show.js']
  })
    
})


router.post('/add-show', isLoggedIn, (req, res, next)=>{

        //     Show.watch().
        // on('change', data => {
        //     console.log(new Date(), data)

        //     // socket.broadcast.emit()
            
        // });


    

   

    // newShow.save((error, doc) => {
    //     console.log(doc)
    // });

    Artist.findOne({ userName: req.session.user.userName }).exec()
    .then(async (artist) => {
        console.log('Got artist', artist);
 

            console.log(`Date of event : ${dateFormat(req.body.date, 'dd-mm-yyyy')}`)

            // Save show with reference id to artist
            const newShow = new Show({ 
                artist: artist._id,
                name: req.body.title, 
                genres: req.body.genres,
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                timestamp: new Date(),
                room_id: uuid.v1()
            })

            let addedShow = null
            // Save show
            newShow.save((error, doc) => {
                console.log("what's happening")
                if(error){
                    console.log(error)
                }else{
                    addedShow = doc
                    console.log('saved', addedShow)
                }
            });

            // Add show reference to artist shows array

            artist.shows.push(newShow._id)
            const shows = await artist.save()

            // console.log('added show', addedShow)
            return [shows, addedShow]
        
    }).then(([shows, addedShow]) => {
        // console.log('Result?', addedShow)
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/profile')
    })
    })
      
   
    

module.exports = function(io){
    let activeSockets = []
    io.on("connection", (socket) => {

        console.time("dbcount")
        Show.countDocuments().then(count => {
            console.log(count)
        
        console.timeEnd("dbcount")

        })

        Show.watch()
        .on('change', data => {
            console.log(new Date(), data)

            if(data.operationType == "insert"){
                // socket.on('add show', (data) => {

                // })

                    console.log("Document inserted")

                    delete data.fullDocument['_id']
                    delete data.fullDocument['__v']

                    console.log(data.fullDocument)
                    socket.emit("client show added", {
                        data: data.fullDocument
                    });
                // })
            }else if(data.operationType == "update"){
                socket.broadcast.emit("client show updated", {
                    data: data.fullDocument
                });
            }

            
            
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

