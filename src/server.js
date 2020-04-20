require('dotenv')
    .config({path:__dirname+'../../.env'})

const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const dbUrl = process.env.dbUrl;
const mongoose = require("mongoose")




const http = require("http").Server(app);
const io = require("socket.io")(http);

const bodyParser = require('body-parser')
const path = require("path")
const Message = require("./models/message.js")

const home = require("./routes/home.js")
// const partials = require('express-partials');



// const nlp = require('nlp_compromise');
// const nlpNgram = require('nlp-ngram');
// nlp.plugin(nlpNgram);
 
// var t = nlp.text('she said she swims');
// console.log(t.ngram())




app 
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    // .use(partials())
    .set('view-engine', 'ejs')
    .set('views', path.join(__dirname,'views'))
    .use('/', home)
    
    .use(express.static(path.join(__dirname, './static')))

    let activeSockets = []


    // Based on this source, for a better understanding 
    // Gonna test it to try the peers, and then write my own logic  
    // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

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
            return  existingSocket !== socket.id
        });
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



   
    // mongoose
    // .connect(process.env.localDB, {
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true,
    // })
    // .then(() => console.log('DB Connected!'))
    // .catch(err => {
    //     console.log(`DB Error: ${err.message}`);
    // })

    http.listen(port, () => console.log(`RTW is listening on port ${port}!`, process.env.PORT))