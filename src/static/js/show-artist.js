// Made use of this tutorial to get me up and running
// Because the last thing I had didn't really work out.
// I understand this know, and I build around it and adapted it
//  https://gabrieltanner.org/blog/webrtc-video-broadcast
const peerConnections = {};

// This is configuration for the peer connection
// A public stun server is needed to kinda map our ip addresses through serveral layers of 
// security like firewalls, NAT
// The stun server allows us to connect from peer to peer while we are behind our firewalls etc. 
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

// There must be a better way to get the id from the url,
// It feels a bit dirty, but this way I can get the client to connect to the namespace
// I want shows to have predefined room_id's which are made using UUID and saved to the db
// Then when you hit /show/{id} you host a show with a namespace {id}
// Server than handles logic for namespaces

const pathnameParts = window.location.pathname.split('/')
const roomId = `/${pathnameParts[pathnameParts.length -1]}`

// Connecting to namespace
const socket = io.connect(roomId)

const video = document.querySelector("video");

// Media constraints for requesting the user's hardware
const constraints = {
  video: { 
    facingMode: "user" 
  },
  audio: true,
};


// Request video and audio hardware with the given constraints.
// When you put video to true, it doesn't work on mobile phones
// Because it doesn't whether to pick the front or backside of the camera.

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    // Stream src gets set on the video element which has the autoplay attribute on it
    video.srcObject = stream;
    console.log('emit broadcaster')



    //  Because this script is made for the artist, here it sends out the broadcaster event
    //  Because the artist is the broadcaster and so the server can set the broadcaster within the function

    socket.emit("broadcaster", socket.id);
  })
  .catch(error => console.error(error));



// When someone is watching, e.g. is joining the namespace but then at /show/visitor/{id}
// A new RTCPeerConnection instance is made with the stunserver config
// The id of the watcher is used to assign the new peer connection as value to the id key 
// Within the peerConnections object of the artist
  socket.on("watcher", id => {
    console.log('watcher?')
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
  
    // Tracks of the stream gets added one by one to the peer connection
    // In other words, is audio being streamed? and video? those two tracks have to be added 
    // one by one to the peer connection
    let stream = video.srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      
    
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('emiting candidate')
        socket.emit("candidate", id, event.candidate);
      }
    };
  
    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        console.log('making offer')
        socket.emit("offer", id, peerConnection.localDescription);
      });
  });
  
  socket.on("answer", (id, description) => {
    console.log('answer made')
    peerConnections[id].setRemoteDescription(description);
  });
  
  socket.on("candidate", (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on("disconnectPeer", id => {
    peerConnections[id].close();
    delete peerConnections[id];
  });

  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };



  (function videoControls(){
    const pausebtn = document.querySelector('button[data-btn-pause]  ')
    pausebtn.addEventListener('click', pause)

    function pause(){
      pausebtn.textContent = "play"
      pausebtn.addEventListener('click', play)
      pausebtn.removeEventListener('click', pause)
     return video.pause()
    }

    function play(){
      pausebtn.textContent = "pause"
      pausebtn.addEventListener('click', pause)
      pausebtn.removeEventListener('click', play) 
     return video.play()
    }

    
  })()


 