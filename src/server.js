require('dotenv')
    .config({path:__dirname+'../../.env'})

const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const dbUrl = process.env.dbUrl;
const mongoose = require("mongoose")

const countries = require("./data/countries-shortcodes.json")

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

    .get('/', (req, res)=>{
      res.statusCode(200)
      res.sendFile("index.html")
    })

    .get('/chat/messages', (req, res) => {
       
        Message.find({},(err, messages)=> {
            console.log("Find this Message model?")
          res.send(messages);
        })
      })

      app.post('/chat/messages', (req, res) => {
        var message = new Message(req.body);
        message.save((err) =>{
          if(err){
            sendStatus(500);
          }else{
            res.sendStatus(200);
          }
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

          if(msg.message.length > 0){
            socket.emit('message', msg);
            // io.emit("message", msg)

            // For every person in the room except the sender,
            // You could use broadcast, but I want to send everyone in the room individually
            // a message besides the sender, because there might be different languages selected.
            // So I send a translation based on the default or selected language of a room member to each member
            // The sender sees the untranslated version of his own.
            for( let i = 0; i < room.members.length; i++){
              translate(msg.message, {
                to: room.members[i].lang
              })
                .then((res) => {
                  console.log(res.text + " Translations")

                  if(room.members[i].id != socket.id){
                    return io.to(room.members[i].id).emit('message', {
                      name: `Member: ${i}`, 
                      message: res.text
                    })
                  }
                })
                .catch(err => {

                  console.log("Error:", err)
                  console.log(msg.message)
                  if(room.members[i].id != socket.id){
                    return io.to(room.members[i].id).emit('message', {
                      name: `Member: ${i}`, 
                      message: msg.message
                    })
                  }
                });
            }
          }else{
           
            socket.emit("test", {
              name: "Empty message",
              body: "Sorry, but you can't send an empty message"
            })
          }
          });

        // Self invoking detected language function gets triggered on first visit at the client
        // The function gets the navigator user prefered language and selects that language automatically in the dropdown
        // Then it sends a message to the server with the default language. In case the user selects something else,
        // a same message goes out which overides the current lang with the newly selected.
        socket.on("detected lang", function(msg){
          console.log(msg, room.members[socket.id])
          const member  = room.members.find( member => member.id == socket.id)
          console.log(member)
          if(member){
            if(countries.find(countrie => countrie.code.toLowerCase() == msg.lang)){
              member.lang = msg.lang;
              socket.emit("lang set", {
                name: "Language is set",
                body: `Your browser default language ${msg.lang} has been selected by default, but feel free to change it anytime`
              })
            }else{
              console.log("nope, language doesn't exist")
              return
            }
          }
          

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
    .connect(process.env.localDB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Error: ${err.message}`);
    })

    http.listen(port, () => console.log(`RTW is listening on port ${port}!`, process.env.PORT))