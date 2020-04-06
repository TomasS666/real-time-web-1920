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
// const partials = require('express-partials');

app
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    // .use(partials())
    .set('view-engine', 'ejs')
    .set('views', path.join(__dirname,'views'))

    .use(express.static(path.join(__dirname, './static'), {
        // etag: false,
        // maxAge: '31536000'
    }))

    .get('/', (req, res)=>{
        res.sendFile("index.html")
    })

    .get('/messages', (req, res) => {
        Message.find({},(err, messages)=> {
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


    io.on("connection", () =>{
        console.log("a user is connected")
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