
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

const socket = io.connect(roomId);

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
  console.log('connect')
  socket.emit("watcher");
});

socket.on("broadcaster", () => {
  console.log('yes, it came here')
  socket.emit("watcher");
});

socket.on("disconnectPeer", () => {
  console.log('closing peer connection')
  peerConnection.close();
});


socket.on('test', (data)=>{
  console.log(data)
  console.log("what")
})


socket.on('visitor chatmessage', (msg)=>{
  
})
socket.on('test', (msg)=>{
  console.log(msg)
})

window.onunload = window.onbeforeunload = () => {
  socket.close();
};


socket.on('new crowdmember', (activeSockets) => {
  console.log(activeSockets)
  initCrowd(activeSockets)
})

socket.on('crowdmember disconnected', (activeSockets) => {
  console.log(activeSockets)
  initCrowd(activeSockets)
})

// socket.on('disconnected', () => {
//   socket.emit('member disconnected')
// })

function initCrowd(activeSockets) {



  const svg = d3.select('svg')


let yDistance = 20;
let xDistance = 200;
  

  const field = d3.select('g#field')
  const people = field.selectAll('image')

  let index = 0; 
  people
  .data(activeSockets)
  .attr('xlink:href', (d)=>{
    return `/images/crowd/${Math.floor(Math.random() * 7) + 1}.png`
  })
  .attr('width', 200)
  .attr('height', 200)
  .attr('x', (d, i) => {

    const fieldProps = document.querySelector('g#field polygon').getBoundingClientRect()


    if(i == 0){
      return index 
    }else{
      index++
      return index * xDistance
    }
  })
  .attr('y', (d, i) => {

    
    const fieldProps = document.querySelector('g#field polygon').getBoundingClientRect()

    console.log(fieldProps)
    
    if(i == 0){
      
      return fieldProps.top
    }else if((index * 200) > fieldProps.width){
      console.log('else if')
      console.log(index * 200)
      
      yDistance += yDistance
      xDistance += 10
      index = 0 
      return fieldProps.top + yDistance
    }else{
      console.log(index, 'else')
      return  fieldProps.top + yDistance
    }


   
     
  })

  people
  .data(activeSockets)
  .enter()
  .append('image')
  .attr('xlink:href', `/images/crowd/${Math.floor(Math.random() * 8) + 1}.png`)
  .attr('width', 200)
  .attr('height', 200)
  .attr('x', (d, i) => {

    const fieldProps = document.querySelector('g#field polygon').getBoundingClientRect()


    if(i == 0){
      return index 
    }else{
      index++
      return index * xDistance
    }
  })
  .attr('y', (d, i) => {

    
    const fieldProps = document.querySelector('g#field polygon').getBoundingClientRect()

    console.log(fieldProps)
    
    if(i == 0){
      
      return fieldProps.top
    }else if((index * 200) > fieldProps.width){
      console.log('else if')
      console.log(index * 200)
      
      yDistance += yDistance
      xDistance += 10
      index = 0 
      return fieldProps.top + yDistance
    }else{
      console.log(index, 'else')
      return  fieldProps.top + yDistance
    }


   
     
  })


  people
  .data(activeSockets)
  .exit()
  .remove()


  // console.log('initfield')
  // field.append('circle')
  //       .attr('r', '30')
  //       .attr('cx', '300')
  //       .attr('cy', '1200')
  //       .attr('fill', 'red')

}


// function changeSky(){
//   const sky = d3.select('#sky')

//   function update(json){
//     sky
//       .fill('')

//       switch(time)
//   }
// }

