# Real-Time Web @cmda-minor-web · 2019-2020

### Demo: {soon here, deployed, but under maintenance}

## Table of contents
  
# Description


## How to install
To install this webapp, you only have to clone this repository by entering the following command in your terminal:

```git clone https://github.com/TomasS666/real-time-web-1920```

or this command if you want to clone the repo into your current folder:

```git clone https://github.com/TomasS666/real-time-web-1920 ./```

or you can download the zip file or something similar by clicking on the green button on the top-right position of every repo.


## Concept
Your two year concert tour got canceled because a global pandemic? No problem, we got you covered with this new Realtime webapp, a central place to host your events online. Register, add your upcoming shows, edit shows, and interact via a live stream with your audience. 
You can even see your audience crowd growing live. This way, you could be anywhere and be safe, yet be closer to your fans than ever before. 

## API

### Data Lifecycle (DLC)
![Data illustratie](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/First-proces.png)
![Data illustratie extn. api](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-time.png)
![Data illustratie show](https://github.com/TomasS666/real-time-web-1920/blob/master/docs/Show-2.png)

### Socket events
#### Artist events
* Add show
* 
#### Visitor events
* Join room
* Show added 
* Show update

#### Server events

###


## Data manipulation
* Adding users
* User roles with different rights
* Video and audio streaming
* Realtime show updates with change streams
* User preferences
* Artist / genre following for show recommendations

## Features


## Micro features / interactions


## Wishlist
* Editing shows
* Show countdown
* Scalable solution
* D3 appending a crowd of people 
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

## Acknowledgements
Robin, Ramon, Robert, Nick, Laurens, Guido, and possibly others for good ideas, helping with my concept, mental support.

This blog for understanding the barebones of WebRTC, peer connections and how to combine that with Socket.io.
https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
Gonna test it to try the peers, and then write my own logic. Don't worry, I will have to add my whole own strategy because the stream is gonna be a one-side communication.

Big props for r2schools, for giving me the knowledge to get my mongodb replica set up and running localy. Was a pain at first, but because of this tutorial I totally got it: 

[Tutorial](https://www.youtube.com/watch?v=bJo7nr9xdrQ)  
[His Youtube Channel](https://www.youtube.com/channel/UCjMKqt0sYMkBEfFg4YtqUdg)

## Used dependencies



## Used packages for Week 1
https://github.com/wilsonwu/translation-google (MIT)

## Conclusion

## License

[MIT License Copyright (c) 2020 Tomas S](https://github.com/TomasS666/web-app-from-scratch-1920/blob/master/LICENSE)
