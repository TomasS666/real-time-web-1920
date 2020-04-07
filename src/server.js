require('dotenv')
    .config({path:__dirname+'../../.env'})

const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const dbUrl = process.env.dbUrl;
const mongoose = require("mongoose")



const http = require("http").Server(app);
const io = require("socket.io")(http);

// const overview = require('./routes/overview.js')
// const detail = require('./routes/detail.js')
// const offline = require('./routes/offline.js')

// const search = require('./routes/search.js')

const bodyParser = require('body-parser')
const path = require("path")
const Message = require("./models/message.js")

const chat = require("./routes/chat.js")
// const partials = require('express-partials');
const translate = require('translation-google');
app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    // .use(partials())
    .set('view-engine', 'ejs')
    .set('views', path.join(__dirname,'views'))
    .use('/', chat)
    .use(express.static(path.join(__dirname, './static'), {
        // etag: false,
        // maxAge: '31536000'
    }))

    .get('/messages', (req, res) => {
        console.log("Testing if it comes here")
        Message.find({},(err, messages)=> {
            console.log("Find this Message model?")
          res.send(messages);
        })
      })

      app.post('/messages', (req, res) => {
        var message = new Message(req.body);
        message.save((err) =>{
          if(err)
            sendStatus(500);
          res.sendStatus(200);
        })
      })


      const room = {
        name: "Room",
        members: []
      }

    

    io.on("connection", (socket) =>{
        console.log(`user ${socket.id} is connected`)

        room.members.push({
          id: socket.id
        })

        socket.on('message', function(msg){
            socket.emit('message', msg);
            

            room.members.forEach(member =>{
              translate(msg.message, {
                to: member.lang
              })
                .then((res) => {
                  console.log(res.text)

                  return io.to(member.id).emit('message', {
                    name: member.id, 
                    message: res.text
                  })
                })
                .catch(err => console.log(err));
            })

            
              



              

            
          });

        socket.on("detected lang", function(msg){
          console.log(msg, room.members[socket.id])
          const member  = room.members.find( member => member.id == socket.id)
          console.log(member)
          member.lang = msg.lang;

          console.log(room)
        })

        socket.on("disconnect", (socket) =>{
          const member = room.members.find(member => member.id == socket.id)
    
          // if(member){
            room.members.pop(member)
            console.log(room)
            return
          // }else{
          //   console.log("member is not in room")
          //   return
          // }
    
        })



        console.log(room)
    })
    
    mongoose
    .connect(process.env.dbUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Error: ${err.message}`);
    })

    http.listen(port, () => console.log(`RTW is listening on port ${port}!`, process.env.PORT))