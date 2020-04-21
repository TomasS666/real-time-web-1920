const dotenv = require('dotenv')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const dbUrl = process.env.dbUrl
const mongoose = require("mongoose")

const http = require("http").Server(app)
const io = require("socket.io")(http)


// const serverSetup = require("./server-setup")
// const http = serverSetup.http
// const io = serverSetup.io


const bodyParser = require('body-parser')
const path = require("path")
const Message = require("./models/message.js")
const fetch = require("node-fetch")

const home = require("./routes/home.js")
const show = require("./routes/show.js")(io)

dotenv.config({
  path: __dirname + '../../.env'
})

app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  // .use(partials())
  .set('view-engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))

  // .get('/', (req, res) => res.send("hoi"))
  .use('/', home)
  .use('/show', show)


  .use(express.static(path.join(__dirname, './static')))





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