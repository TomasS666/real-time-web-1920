const dotenv = require('dotenv')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const dbUrl = process.env.dbUrl
const mongoose = require("mongoose")

const http = require("http").Server(app)
const io = require("socket.io")(http)

const session = require('express-session')

// const serverSetup = require("./server-setup")
// const http = serverSetup.http
// const io = serverSetup.io


const bodyParser = require('body-parser')
const path = require("path")
const Artist = require("./models/artist.js")
const fetch = require("node-fetch")

const register = require("./routes/register.js")
const login = require("./routes/login.js")

const home = require("./routes/home.js")
const show = require("./routes/show.js")(io)
const profile = require("./routes/profile.js")

dotenv.config({
  path: __dirname + '../../.env'
})

app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  // .use(bodyParser.json())
  .use(session({
    name: 'Login Session',
    secret: 'Maniac',
    saveUninitialized: false,
    resave: false
  }))
  // .use(partials())
  .set('view-engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))


  .use('/', home)
  .use('/', profile)
  // .use('/show', show)
  .use('/', register)
  .use('/', login)

  // .get("/", (req, res)=>{
  //     res.render("register.ejs")
  // })


  .use(express.static(path.join(__dirname, './static')))





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