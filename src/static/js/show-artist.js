
const peerConnections = {};
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const pathnameParts = window.location.pathname.split('/')
const roomId = `/${pathnameParts[pathnameParts.length -1]}`

const socket = io.connect(roomId)
console.log(roomId)
const video = document.querySelector("video");

// Media contrains
const constraints = {
  video: { 
    facingMode: "user" 
  },
  audio: true,
};


navigator.mediaDevices
  .getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    console.log('emit broadcaster')
    socket.emit("broadcaster", socket.id);
  })
  .catch(error => console.error(error));



  socket.on("watcher", id => {
    console.log('watcher?')
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
  
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


 