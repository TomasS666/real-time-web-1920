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

const home = require("./routes/home.js")
// const partials = require('express-partials');

app .set('json spaces', 2)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    // .use(partials())
    .set('view-engine', 'ejs')
    .set('views', path.join(__dirname,'views'))
    .use('/', home)
    
    .use(express.static(path.join(__dirname, './static')))

    // .get('/', (req, res)=>{
    //   res.statusCode(200)
    //   res.render("home.ejs")
    //   // res.sendFile("index.html")
    // })

    // .get('/chat/messages', (req, res) => {
       
    //     Message.find({},(err, messages)=> {
    //         console.log("Find this Message model?")
    //       res.send(messages);
    //     })
    //   })

   
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