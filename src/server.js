require('dotenv')
    .config({path:__dirname+'../../.env'})

const express = require('express')
const app = express()
const port = process.env.PORT || 8080

// const overview = require('./routes/overview.js')
// const detail = require('./routes/detail.js')
// const offline = require('./routes/offline.js')

// const search = require('./routes/search.js')

const bodyParser = require('body-parser')
const path = require("path")

// const partials = require('express-partials');

app
    .use(bodyParser.urlencoded({ extended: true }))
    // .use(partials())
    .set('view-engine', 'ejs')
    .set('views', path.join(__dirname,'views'))

    .use(express.static(path.join(__dirname, '../build'), {
        // etag: false,
        // maxAge: '31536000'
    }))
    // .use('/', offline)
    // .use('/', overview)
    // .use('/', detail)
    // .use('/', search)

    .listen(port, () => console.log(`RTW is listening on port ${port}!`))