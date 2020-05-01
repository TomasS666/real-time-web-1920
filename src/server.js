const dotenv = require('dotenv')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const dbUrl = process.env.dbUrl
const mongoose = require("mongoose")

const http = require("http").Server(app)
const io = require("socket.io")(http)
const flash = require('express-flash')
const session = require('express-session')

// const serverSetup = require("./server-setup")
// const http = serverSetup.http
// const io = serverSetup.io


const bodyParser = require('body-parser')
const path = require("path")
const Artist = require("./models/artist.js")
const Visitor = require("./models/visitor.js")
const fetch = require("node-fetch")

const register = require("./routes/register.js")
const login = require("./routes/login.js")
const logout = require("./routes/logout.js")

const home = require("./routes/home.js")
const show = require("./routes/show.js")(io)
const addShow = require("./routes/artist/add_show.js")(io)
const profile = require("./routes/visitor/overview.js")

const shows = require("./routes/API/shows")

const isLoggedIn = require('./middleware/is-logged-in')

const ejs = require("ejs")



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
  .use(flash())

  // .use(partials())
  .set('view-engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))

  // .get('/', (req, res) => {
    
  //   const test = new Visitor({
  //     firstName: 'Marcella',
  //     lastName: 'W',
  //     userName: 'marcella@visitor.com',
  //     password: 'test'
  //   })

  //   test.save(function(err, doc){
  //     if(err) console.log(err)
  //     else{
  //       console.log("Saved", doc)
  //     }
  //   })

  //   Visitor.find({}, function(err, artist) {
      
  //     if (err){
  //       console.log(err)
  //       res.send(err)
  //     }
  //     else{
  //       console.log(artist)
      
  //       res.json(artist)
  //     }
      
      
  //     // mongoose.disconnect()
      
  //   })



   
  // })

  .use('/', home)
  .use('/', profile)
  .use('/show', show)
  .use('/', addShow)
  .use('/', register)
  .use('/', login)
  .use('/', logout)
  .use('/', shows)
  

  

  // .get("/", (req, res)=>{
  //     res.render("register.ejs")
  // })


  .use(express.static(path.join(__dirname, './static')))





  mongoose.connection.on("error", function (err) {
    console.log(err)
  })
  
  mongoose.connection.on("disconnected", function () {
    console.log("DB: Disconnected")
  })
  
  
  // https://gist.github.com/pasupulaphani/9463004
  // On end of Node Proces, close Mongoose Connection
  var gracefulExit = function() { 
    mongoose.connection.close(function () {
      console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
      process.exit(0);
    });
  }
  
  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);



mongoose
  .connect(process.env.dbUrl, {
    connectWithNoPrimary: true,
      useCreateIndex: true,
      // useUnifiedTopology: true,
      useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
      console.log(`DB Error: ${err.message}`);
  })



http.listen(port, () => console.log(`RTW is listening on port ${port}!`, process.env.PORT))