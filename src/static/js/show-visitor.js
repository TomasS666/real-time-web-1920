
// let socket = io()


// const { RTCPeerConnection, RTCSessionDescription } = window;

// const configuration =  {'iceServers': [{
//   'urls': 'stun:stun.l.google.com:19302'}
// ]}
// const peerConnection = new RTCPeerConnection(configuration);



// socket.on('call user', function(msg){
//   console.log('call made')
// })


// socket.on('client joined room', async function(msg){
//   console.log(msg)
  
//   // await peerConnection.setRemoteDescription(
//   //     new RTCSessionDescription(msg.answer)
//   //   )
//   //   .then(res => console.log(res))
//   //   .catch(err => console.log(`Error: ${err}` ))
    
//   //   if (!isAlreadyCalling) {
//   //     callUser(data.socket);
//   //     console.log(data.socket)
//   //     isAlreadyCalling = true;
//   //   }
// })











let peerConnection;
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const pathnameParts = window.location.pathname.split('/')
const roomId = `/${pathnameParts[pathnameParts.length -1]}`

console.log(roomId);

const socket = io(roomId);

const video = document.querySelector("video");


socket.on("offer", (id, description) => {
  console.log('offer done')
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    })
    .catch(err => console.log(err));
  peerConnection.ontrack = event => {
    console.log(' on track')
    video.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});


socket.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("connect", () => {
  socket.emit("watcher");
});

socket.on("broadcaster", () => {
  console.log('yes, it came here')
  socket.emit("watcher");
});

socket.on("disconnectPeer", () => {
  peerConnection.close();
});


socket.on('test', (data)=>{
  console.log(data)
  console.log("what")
})

window.onunload = window.onbeforeunload = () => {
  socket.close();
};



function initCrowd(){
  const svg = d3.select('svg')



  

  const field = d3.select('g#field')
  console.log('initfield')
  field.append('circle')
        .attr('r', '30')
        .attr('cx', '300')
        .attr('cy', '1200')
        .attr('fill', 'red')

}


// function changeSky(){
//   const sky = d3.select('#sky')

//   function update(json){
//     sky
//       .fill('')

//       switch(time)
//   }
// }

initCrowd()