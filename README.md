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
  
# Description


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

A show looks like this in the db: 



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

If you're not logged in you can't acces the endpoint. When you are logged in as a visitor I fetch the data in the client and append it with D3. 

I started out with serveral ideas, but wasn't all quite what I had in mind and I was struggling with getting on the right track with a good and realistic idea. 

### Data Lifecycle (DLC)
![Data illustratie](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/First-proces.png)
![Data illustratie extn. api](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-time.png)
![Data illustratie show](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-2.png)

### Socket events
#### Artist events
* Add show
* Delete show
* Broadcaster when the artist hosts it's show and the getUserMedia completes to set the broadcaster id as the artist socket id
* Watcher event when a client connects so the artist can add new peerconnection to the

#### Visitor events
* Join room (when connecting to a namespace by hitting the visitor route : ```/show/visitor/{ predefined room_id } ```

#### Server events

### Events which require more explaination
#### Visitor
* ```show is deleted``` : when the artist removes a show it goes a little different then POSTING. The DELETE method is not supported in HTML5 forms. To my surprise. (You learn all the time). So when I delete one of my shows as an Artist, I check the clicked target within the show list > when it's a button within the show article, I use the room_id as identifier because other data is left out on purpose, I emit that room id directly to the clients who are watching their overview. I wanted to use the database as source of truth for this too just like when I add a new show. But I found out it's not possible to receive the deleted fullDocument within the change stream because once the operation of deletion is complete, there is not document anymore to notify about. I expected that it would be deleted and then at least you would get a last change of receiving the deleted doc. But it doesn't work like that.


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


## Micro features / interactions


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
