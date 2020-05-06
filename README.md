# Real-Time Web @cmda-minor-web · 2019-2020


### Demo: https://rtw-tomas.herokuapp.com/login (in maintenance mode atm to avoid unwanted requests that rob me of my free dyno hours)

![concept poster](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/rtw.png)

## Concept
Your two year concert tour got canceled because a global pandemic? No problem, we got you covered with this new Realtime webapp, a central place to host your events online. Register, add your upcoming shows, edit shows, and interact via a live stream with your audience. 
You can even see your audience crowd growing live. This way, you could be anywhere and be safe, yet be closer to your fans than ever before. 






## Table of contents
- [Real-Time Web @cmda-minor-web · 2019-2020](#real-time-web--cmda-minor-web---2019-2020)
    + [Demo: https://rtw-tomas.herokuapp.com/login (in maintenance mode atm to avoid unwanted requests that rob me of my free dyno hours)](#demo--https---rtw-tomasherokuappcom-login--in-maintenance-mode-atm-to-avoid-unwanted-requests-that-rob-me-of-my-free-dyno-hours-)
  * [Concept](#concept)
  * [Table of contents](#table-of-contents)
  * [How to install](#how-to-install)
  * [Replica set](#replica-set)
  * [API](#api)
  * [Data Lifecycle (DLC)](#data-lifecycle--dlc-)
  * [Socket events](#socket-events)
    + [Artist events](#artist-events)
    + [Visitor events](#visitor-events)
    + [Server events](#server-events)
  * [Events which require more explaination](#events-which-require-more-explaination)
    + [Visitor](#visitor)
  * [Data manipulation](#data-manipulation)
  * [Features](#features)
  * [Micro features / interactions](#micro-features---interactions)
  * [Wishlist](#wishlist)
  * [Known bugs](#known-bugs)
    + [Browser Support getUserMedia and constraints](#browser-support-getusermedia-and-constraints)
    + [Bug peerOffer](#bug-peeroffer)
  * [Future features](#future-features)
  * [Acknowledgements](#acknowledgements)
  * [Used dependencies](#used-dependencies)
  * [Used packages for Week 1](#used-packages-for-week-1)
  * [Conclusion](#conclusion)
  * [License](#license)
  
### Data Lifecycle (DLC)

User creation
![Data illustratie](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/user-creation.png)

In overview shows: 

![Illustratie overview](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/changestreeam.png)

During a show : RTCPeerconnections
![Data illustratie extn. api](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-time.png)

During the show:
![Data illustratie show](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-2.png)


## How to install
To install this webapp, you only have to clone this repository by entering the following command in your terminal:

```git clone https://github.com/TomasS666/real-time-web-1920```

or this command if you want to clone the repo into your current folder:

```git clone https://github.com/TomasS666/real-time-web-1920 ./```

or you can download the zip file or something similar by clicking on the green button on the top-right position of every repo.

## Replica set 
To use MongoDB it's change stream functionality, you're required to get a MongoDB replica set up and running. In short, that's a formation of at least 3 mongod instances which maintain the same data. For it to be a valid formation there should at least be 3 instances. It's common to see a formation which has a PRIMARY node for writing and reading data and at least two SECONDARY nodes who listen to the oplog of the PRIMARY node to replicate / update the data.

Definition of the Oplog by MongoDB: __The oplog (operations log) is a special capped collection that keeps a rolling record of all operations that modify the data stored in your databases.__ - https://docs.mongodb.com/manual/core/replica-set-oplog/

So basically, the oplog records everything that happens in the database. And when you have 3 nodes running, the two secondary nodes are catching up with the oplog of the PRIMARY node. 

To get started with a replica-set I recommend reading this: https://docs.mongodb.com/manual/tutorial/deploy-replica-set/
If you're a Windows user like me, this might be a better resource: [Get your replica set running on Windows](https://www.youtube.com/watch?v=bJo7nr9xdrQ) 

It might seem intimidating at first, but once you get through it's really awesome to see the replica set running and how the change stream serves us realtime changes. 

More about the replica sets and how election can come into play over here: [Wiki - MongoDB / Mongoose / Atlas](https://docs.mongodb.com/manual/core/replica-set-oplog/) 

## API
At this moment, I have a little API of my own. I wanted to either make more endpoints in the future to request and query more specific data, but I didn't get there unfortunately. Right now I serve JSON from an endpoint ```/shows/``` which returns all the shows added by artists. It's queried from the DB and then send as JSON. 

The query excludes the ObjectId and '_v_' field. Because I don't want that to just be exposed. I did some research, and people say it's not very elegant to just expose that. I can understand. Of course there are probably some catches in my code and vulnerabilities I have overseen at the moment. I'm not an security expert yet, but I'm trying to get better. But why not exclude fields we don't really need. Especially things like id's. 

As you can see in the below code I added some middleware I made which checks if you're have a session going on, if you're logged in.
If so, it returns next() so it can go and fire the Mongoose query. If you're not logged in, you get redirected to the login page.

Then The query searches for all shows in this case. I wanted to expand that with artistId's, genres etc, but due to time I didn't yet.
Now it gets every show. 







```javascript

router.get('/shows/:artistid?', isLoggedIn, (req, res, next)=>{

//  Find all shows, excluse _id and __v field
//  Sub query Artist, withouth retrieving the ObjectID, hashed password, and additional non needed data

    Show.find({}, '-_id -__v')
        .populate('artist', '-_id -shows -password -userName -userRole -__v')
        .exec()
        
        .then(json => {

            return json
            
        })
        .then(json => res.json(json))
        .catch(err => console.log(err))
    
})



module.exports = router

```

A show looks like this in the db: 

```json
{
  "_id": "5eb07698fd5e9598384edc51",
  "genres": [
    "Metal"
  ],
  "artist": "5ea82454c05ef8039c61ef89",
  "name": "Ram",
  "date": "2020-05-05T00:00:00.000Z",
  "startTime": "18:00",
  "endTime": "23:00",
  "timestamp": "2020-05-04T20:10:00.810Z",
  "room_id": "3bf55bb0-8e43-11ea-ac0a-3b6cf2f3d7b7",
  "__v": 0
}"

```

Notice that it holds an artist, but just a reference to the artist and not the artist embeded. That was a decision made on purpose, not to bloat the whole document. If this gets bigger, it's gonna explode.

But when I want the show data, I want the artist data for the show as well. So I use the Mongoose .populate('artists') method to do sort of subquery to fill in that gap. But the artist also has information that's not needed and even sensitive. So within the population I exclude the hashed password and other data that's not required.


If you're not logged in you can't acces the endpoint. When you are logged in as a visitor I fetch the data in the client and append it with D3. 

I do that in the following manner:

Visitor script on the overview page: 

```javascript


function getShows(){
    return fetch("/shows")
}

let shows = []

getShows()
    .then(string =>{
        return string.json()
    })
    .then(json => {
        console.log(json)
        update(json)
  -------------------------------------------------------------

```

In the end it fires the update function: 

```javascript

function update(json){


    const container = d3.select('#shows')
    const articles = container.selectAll('article')
    
    console.log(articles.order())

    articles
    .data(json)
    .style('opacity', '1')
        .select('h3')
        .text(d => d.name);

    articles
        .data(json)
        .select('div')
        .text(d => {
            console.log(d)
            return d.genres.join(', ')
        })

    
        
    articles.transition().delay((d, i)=>{
        console.log(i * 10)
        return i * 400
    })
    .duration(1000)
        .style('opacity', '1')
        

    articles
        .data(json)
        .select('div')
        .html(d => {
            console.log('enter')
            return `<span class="info-tag">Genre:</span> ${d.genres.join(', ')}`
        });
    
   var article =  articles
                    .data(json)
                    .enter()
                    .append('article');

    article
        .attr('id', (d, i)=> i)

    article
        .append('h3')
        .text(d => d.name);
    article
        .append('div')
        .html(d => {
            console.log('enter')
            return `<span class="info-tag">Genre:</span> ${d.genres.join(', ')}`
        });

    article
        .append('div')
        .html(d => {
            return `<span class="info-tag">Date:</span> ${d.date}`
        });

    article
        .append('div')
        .html(d => {
            return `<span class="info-tag">Starting time:</span> ${d.startTime}`
        });

    article
        .append('div')
        .html(d => {
            return `<span class="info-tag">Axprox end time:</span> ${d.endTime}`
        });


    article
        .append('a')
        .attr('href', d => {
            return `/show/visitor/${d.room_id}`
        })
        .text('join');

    articles.data(json).exit().remove()

```



### Socket events

#### Artist events
* Add show
* Delete show
* Broadcaster when the artist hosts it's show and the getUserMedia completes to set the broadcaster id as the artist socket id
* Watcher event when a client connects so the artist can add new peerconnection to the
* Answer after the the localDescription is set and an peerConnection answer is made
* disconnectPeer when the server has a socket disconnected
* crowdmember disconnected => someone disconnected, so remove a character from the svg.

#### Visitor events
* Join room (when connecting to a namespace by hitting the visitor route : ```/show/visitor/{ predefined room_id } ```
* client show is added : when the change streams detects an insertion, the server receives the fullDocument which gets emited to the visitor. The visitor then triggers the update function of D3 to update the DOM with the newly added show which came straight out of the db.
* Offer, when artist does offer to setup a new peerConnection
* crowdmember disconnected => someone disconnected, so remove a character from the svg.

#### Server events
* on connection with namespace: 

```javascript

const nsp = io.of(`${room}`);
  let broadcaster
  nsp.on('connection', function (socket) {
  ----------------
 ```
 Because I made a function of the socket logic for the show route (because I seperated my routes into different files) initially, 
 I figured, that whenever a route like '/show/visitor/{room_id} gets hit, I can take that room_id and let the client connect to it.
 
On the server the broadcaster let variable is set within the sockets function scope, so it's not accessible outside the function, meaning that when someone else starts a show, it's totally fine. The function gets called because you hit the route and you're connecting to a unique room_id namespace and the rest of the events are handled within the namespace connection event. 

* disconnect : when socket in namespace disconnects emit crowdmember disconnected and disconnectedpeer


### Events which require more explaination
#### Visitor
* ```show is deleted``` : when the artist removes a show it goes a little different then POSTING. The DELETE method is not supported in HTML5 forms. To my surprise. (You learn all the time). So when I delete one of my shows as an Artist, I check the clicked target within the show list > when it's a button within the show article, I use the room_id as identifier because other data is left out on purpose.

Arist delete show: 
```javascript
  fetch(`/remove-show/${room_id}`, {
                method: 'DELETE'
            }).then(res => {
                console.log(res)

                socket.emit('artist deleted show', room_id )
                window.location.reload()
            })

```

Server broadcasts because as I wrote before, the the visitors see every show atm in their overview:
```javascript
        socket.on('artist deleted show', (data) => {
            console.log('artist deleted', data)
            socket.broadcast.emit('show is deleted', data)
        })
```

Visitor find show by room_id and filter it out to produce a new array (which is assigned to the old array, not very functional, I know, but it's all not very functional) and fire update function : 

```javascript

 socket.on('show is deleted', (data)=>{
            console.log(data)
            if(shows.find(show => show.room_id == data)){
                console.log(shows)
                shows = shows.filter(show => show.room_id != data)
                update(shows)
            }else{
                console.log('show is not here ', shows)
            }
        })

```

I emit that room id directly to the clients who are watching their overview. I wanted to use the database as source of truth for this too just like when I add a new show. But I found out it's not possible to receive the deleted fullDocument within the change stream because once the operation of deletion is complete, there is not document anymore to notify about. I expected that it would be deleted and then at least you would get a last change of receiving the deleted doc. But it doesn't work like that.


## Data manipulation
* Adding users
* User roles with different privileges
* Video and audio streaming
* Realtime show updates with change streams
* Deleting shows and communicating that to clients
* ~Artist / genre following for show recommendations~

## Features
* Live crowd ( D3 appending a crowd of people )
* Shows were first rendered server side at entrance of the site, now the shows it's getting fetched in the client from my endpoint which serves the show data without objectId from the db to avoid vulnerabilities. And then it gets appended to the DOM. It's slower, it's not performant, but this was my way to keep an initial state of data which I can use to differ from incoming changes. The thing that makes me proud is that it's from a truthy source in my opinion because: client fetches data dat comes out of the database, server listens to change in database with a stream, if a change occured, I check the change operation and then I emit the fullDocument of the change over sockets to the clients. So data comes from the database anyway. If the client refreshed, it


## Things I'm proud of 
I've learned a lot, almost too much to mention. Yet some things really took me a long time to figure out but were really cool to see in live action in the end.

Things like adding the show to the db are not really exciting. But here is the code for that, because what happens after this is much more cool.

```javascript

router.post('/add-show', isLoggedIn, (req, res, next) => {

    Artist.findOne({
            userName: req.session.user.userName
        }).exec()
        .then(async (artist) => {
            console.log('Got artist', artist);


            console.log(`Date of event : ${dateFormat(req.body.date, 'dd-mm-yyyy')}`)

            // Save show with reference id to artist
            const newShow = new Show({
                artist: artist._id,
                name: req.body.title,
                genres: req.body.genres,
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                timestamp: new Date(),
                room_id: uuid.v1()
            })

            let addedShow = null
            // Save show
            newShow.save((error, doc) => {
                console.log("what's happening")
                if (error) {
                    console.log(error)
                } else {
                    addedShow = doc
                    console.log('saved', addedShow)
                }
            });

            // Add show reference to artist shows array

            artist.shows.push(newShow._id)
            const shows = await artist.save()

            // console.log('added show', addedShow)
            return [shows, addedShow]

        }).then(([shows, addedShow]) => {
            // console.log('Result?', addedShow)
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(err)
            res.redirect('/profile')
        })
})
```
Short: I find the user who is logged in as artist in the Artist collection. I mean the artist who is logged in should only be able to create his or her own show. Within the resolvement of finding the Artist, I create a new show, save it to the show collection and then save a reference id to the artist shows array and save the artist.

But while this artist is on this route, I start a change stream which keeps track of the show collection:

```javascript

Show.watch()
            .on('change', data => {
                console.log(new Date(), data)

                if (data.operationType == "insert") {
   
                    console.log("Document inserted")

                    delete data.fullDocument['_id']
                    delete data.fullDocument['__v']

                    console.log(data.fullDocument)
                    socket.emit("client show added", {
                        data: data.fullDocument
                    });
              
                } else if (data.operationType == "update") {
                    socket.broadcast.emit("client show updated", {
                        data: data.fullDocument
                    });
                }
                ..............

```

This is possible because I have a replica set. Now when the artist adds or deletes the show from the DB I get notified that operations has happened to the show collection like so: 

```

2020-05-06T01:18:38.756Z {
  _id: {
    _data: '825EB2106E000000012B022C0100296E5A10044787501AA6704DE18704BD11C3517A7D46645F696400645EB2106EBA65D24CE46D113A0004'
  },
  operationType: 'insert',
  clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1588727918 },
  fullDocument: {
    _id: 5eb2106eba65d24ce46d113a,
    genres: [ 'Metal' ],
    artist: 5ea82454c05ef8039c61ef89,
    name: 'Slayer',
    date: 2020-05-07T00:00:00.000Z,
    startTime: '18:00',
    endTime: '23:00',
    timestamp: 2020-05-06T01:18:38.693Z,
    room_id: '83e3a950-8f37-11ea-a6fa-6f8295731d1e',
    __v: 0
  },
  ns: { db: 'clusterfck', coll: 'shows' },
  documentKey: { _id: 5eb2106eba65d24ce46d113a }
}

```
To get this up and running took me some time. And as always I wanted to do a lot more. But I learned tons of thing about databases, replica sets, realtime change streams, way more about the correct use of middleware, etc etc. 

## Wishlist
* Editing shows
* Show countdown
* Scalable solution
* Ticket system, wanted to try Ticketmaster API.


## Known bugs

### Browser Support getUserMedia and constraints
There was a lot of trouble with getting ```javascript navigator.mediaDevices.getUserMedia(constraints)``` up and running on multiple devices and browsers. So I used a [polyfill used by MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

And tested that in multiple browsers, localy and deployed with http and https. And although it's supported almost everywhere, it's still not implemented to work everywhere. There are still bugs I would like to get out in the future. But in Chrome, Firefox and Safari on certain devices it works. And that's good enough at this time. It works on my Huawei p20 mate lite in the chrome browser. It works on Desktop chrome, firefox and I think Safari. It doesn't work yet on Edge, while Edge should support it, but I couldn't resolve this yet. It's sadly not supported on IE. 

### Bug peerOffer
To be very short, the ability to stream video and audio to other users is based on WebRTC and peer connections. The basic flow goes something like this: 

1. host / artist connects because it hits a route with a script that requests the user to enable their hardware for video and audio. 
1. Or! A visitor hits another route first with a specific id to join the show which is not hosted yet because the host isn't connected.

2. When a visitor hits the route, it's connected to that namespace because I set the req.params.id as the namespace. When that visitor connects, an event is send to the server. The server then in turn emits an event that a visitor is connected / watching specifically to the set host / broadcaster. If a broadcaster isn't set yet, it's just waiting there until a broadcaster is set. (required just a little if statement I oversaw) thanks to Ramon I got that working.

3. The broadcaster gets notified with an event that someone is watching, then it makes a new peerConnection instance, sets it's localDescription and then emits that back to the server.

4. The server sends it to the visitor which connected. A peerconnection instance is made there as well.

## Future features
* Custom stages
* More interaction and micro-interactions during the show
* Sky in show based on weather conditions or clients local time
* Ticket system for shows
* Better authentication, especially when joining a namespace
* Improvements on DOM manipulation
* Better scalability
* Move peer connection logic to the server? Or more towards the server

## Acknowledgements
Robin, Ramon, Robert, Nick, Laurens, Guido, and possibly others for good ideas, helping with my concept, mental support.

This blog for understanding the barebones of WebRTC, peer connections and how to combine that with Socket.io.
https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
Gonna test it to try the peers, and then write my own logic. I will have to add my whole own strategy because the stream is gonna be a one-side communication.

Big props for r2schools, for giving me the knowledge to get my mongodb replica set up and running localy. Was a pain at first, but because of this tutorial I totally got it: 

[Tutorial](https://www.youtube.com/watch?v=bJo7nr9xdrQ)  
[His Youtube Channel](https://www.youtube.com/channel/UCjMKqt0sYMkBEfFg4YtqUdg)

Thanks to this tutorial I finally got most of it working
I was concerned It wouldn't work out anymore. Because I kinda had a two way communication and I wanted it to go to one-to-many.
What happens during the show with streaming is largely based on this. I understand what is happening, I build my own logic and things around it, but for getting the streams up and running with one-to-many peerconnections, I made use of this code.
https://gabrieltanner.org/blog/webrtc-video-broadcast


## Used packages for Week 1
https://github.com/wilsonwu/translation-google (MIT)

## License

[MIT License Copyright (c) 2020 Tomas S](https://github.com/TomasS666/web-app-from-scratch-1920/blob/master/LICENSE)
