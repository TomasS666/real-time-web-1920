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

## Future features

## Acknowledgements
Robin, Ramon, Robert, Nick, Laurens, Guido, and possibly others for good ideas, helping with my concept, mental support.

This blog for understanding the barebones of WebRTC, peer connections and how to combine that with Socket.io.
https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/
Gonna test it to try the peers, and then write my own logic. Don't worry, I will have to add my whole own strategy because the stream is gonna be a one-side communication.

Big props for r2schools, for getting my mongodb replica set up and running localy. Was a pain at first, but because of this tutorial I totally got it: 

[Tutorial](https://www.youtube.com/watch?v=bJo7nr9xdrQ)  
[His Youtube Channel](https://www.youtube.com/channel/UCjMKqt0sYMkBEfFg4YtqUdg)

## Used dependencies

## Proces
### First ideas 
So, first off I thought about Spotify immediately, because I love music, I was recently chanting that I wanted to try the Spotify API. But last year someone had a similar idea, and other people this year too. I think I'll save the API for a personal project. 
Secondly, I thought about watching movies together even though there's a distance. Yes it's a thing, I watch movies with someone far far away. That experience could be greatly enhanced. 
But it's a bit, idk, boring? And I'm a little afraid in terms of jurisdiction and for instance the Netflix APi. 

Anyway, I thought, why not make a realtime translation webapp. It would become a smaller world if you'd be able to talk to someone in Japan or Mexico. A whole world would open up. I know there are similar existing applications, but not a lot, and I could add other features as well. 
I figured the Google translate API is something I don't really want to touch because I don't want to give away any credit card credentials. But there are great alternatives I've seen so far. Like the Bing translation API. Gonna dive a little deeper and check if my concept will hold up with some tuning. 

### Week 1 : Setup
Started with getting my repo up and running and setting up my express server. 
Once this was ready, I claimed my Mongo Atlas student privileges and I followed a chat demo / tutorial. 
The tutorial was written in jQuery, so I wrote it in Vanilla JS. 
Made a message scheme with Mongoose. Added Socket.io and deployed on Heroku. There were some startup issues, like the whitelisting of IP addresses. Because Heroku has highly variable IP addresses. 
So I went to Stackoverflow but unfortunately they gave me an answer I was afraid of. The only and easy solution is to whitelist everything while not in production mode. So I went with that. 

## Used packages for Week 1
https://github.com/wilsonwu/translation-google (MIT)

## Conclusion

## License

[MIT License Copyright (c) 2020 Tomas S](https://github.com/TomasS666/web-app-from-scratch-1920/blob/master/LICENSE)
