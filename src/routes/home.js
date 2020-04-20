const express = require('express');
const router = express.Router();
const path = require('path')


const fetch = require('node-fetch');


router.get('/', (req, res, next)=>{



const d = new Date()

const today = {
    year: new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d),
    month: new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d),
    day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d),
    get formated() {
        return `${this.year}-${this.month}-${this.day}`
    }
}

let dayBefore = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);

let yesterday = {
    year: new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dayBefore),
    month: new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dayBefore),
    day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dayBefore),
    get formated() {
        return `${this.year}-${this.month}-${this.day}`
    }
}

console.log(yesterday.formated, today.formated)

    res.header("Content-Type",'application/json');
fetch(`https://newsapi.org/v2/everything?domains=wsj.com,nytimes.com&from=${yesterday.formated}&to=${today.formated}&sortBy=popularity&apiKey=b19502fd05ce448c9f04c279f3a7dae8`)
    .then(data => data.json())
    .then(data => {
        console.log(data)
        var keyword_analyzer = require('keyword-analyzer')

// keyword_analyzer.wrest(data['articles'][0]['title'])


let outcome = []
// console.log(data['articles'], 'fwef')
for(let i = 0; i < data['articles'].length; i++){
    
    outcome.push(keyword_analyzer.wrest(data['articles'][i]['content']))
}

console.log(Array.isArray(outcome))
console.log(keyword_analyzer.wrest(outcome.flat(Infinity).join(" ")))

            return [data, outcome];
    })
    .then(json => res.json(json))
    .catch(err => console.log(err))
 
    // res.render("chat.ejs")
    
})

module.exports = router;