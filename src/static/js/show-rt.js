    // Based on this source, for a better understanding 
    // Gonna test it to try the peers, and then write my own logic  
    // https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

const socket = io()

const { RTCPeerConnection, RTCSessionDescription } = window;


const configuration =  {'iceServers': [{
  'urls': 'stun:stun.l.google.com:19302'}
]}
const peerConnection = new RTCPeerConnection(configuration);


// Feature detect navigator mediaDevices and getuserMedia
function FD_checkMediaDevices(){
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? true : false
}

function promptMedia(constraints){
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
  
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
  
      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  
  return navigator.mediaDevices.getUserMedia(constraints)
  
}



// video: {
//   facingMode: { 
//     exact: 'user'
//   }
// },

promptMedia({
  video: {
    facingMode: 'user'
  },
  audio: true,
})
  .then(function(stream) {
    console.log('setting up tracks')
    const localVideo = document.getElementById("local-video");
    if (localVideo) {
      localVideo.srcObject = stream;
    }

    stream.getTracks().forEach(track => {
      console.log(track, stream)
      peerConnection.addTrack(track, stream)
    
    });
  })
  .catch(function(err) {
    console.log(err)
  });



  // .then(function(stream) {
  //   var video = document.querySelector('video');
  //   // Older browsers may not have srcObject
  //   // if ("srcObject" in video) {
  //   //   video.srcObject = stream;
  //   // } else {
  //   //   // Avoid using this in new browsers, as it is going away.
  //   //   video.src = window.URL.createObjectURL(stream);
  //   // }
  
  //   const localVideo = document.getElementById("local-video");
  //       if (localVideo) {
  //         localVideo.srcObject = stream;
  //       }
  
  
  
  //   video.onloadedmetadata = function(e) {
  //     video.play();
  //   };
  // })









 socket.on("update-user-list", (msg)=>{
   console.log(msg)
 })


 socket.on("update-user-list", ({ users }) => {
  updateUserList(users);
 });
  
 socket.on("remove-user", ({ socketId }) => {
  const elToRemove = document.getElementById(socketId);
  
  if (elToRemove) {
    elToRemove.remove();
  }
 });


 function updateUserList(socketIds) {
  const activeUserContainer = document.getElementById("active-user-container");

  console.log(socketIds)
  
  socketIds.forEach(socketId => {
    const alreadyExistingUser = document.getElementById(socketId);
    if (!alreadyExistingUser) {
      const userContainerEl = createUserItemContainer(socketId);
      activeUserContainer.appendChild(userContainerEl);
    }
  });
 }

 function createUserItemContainer(socketId) {
  const userContainerEl = document.createElement("div");
  
  const usernameEl = document.createElement("p");
  
  userContainerEl.setAttribute("class", "active-user");
  userContainerEl.setAttribute("id", socketId);
  usernameEl.setAttribute("class", "username");
  usernameEl.innerHTML = `Socket: ${socketId}`;
  
  userContainerEl.appendChild(usernameEl);
  
  userContainerEl.addEventListener("click", () => {
    // unselectUsersFromList();
    userContainerEl.setAttribute("class", "active-user active-user--selected");
    const talkingWithInfo = document.getElementById("talking-with-info");
    talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
    console.log(socketId)
    callUser(socketId);
  }); 
  return userContainerEl;
 }

 async function callUser(socketId) {
   console.log(peerConnection)
  const offer = await peerConnection.createOffer();

console.log(`Gonna call ${offer}`)

  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  
  socket.emit("call-user", {
    offer,
    to: socketId
  });
 }
 

 socket.on("call-made", async data => {
  // const peerConnection = new RTCPeerConnection()
  console.log(data)
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  
  socket.emit("make-answer", {
    answer,
    to: data.socket
  });





 });

 let isAlreadyCalling = false;

 socket.on("answer-made", async data => {
  console.log("test")
  // const peerConnection = new RTCPeerConnection()
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  )
  .then(res => console.log(res))
  .catch(err => console.log(`Error: ${err}` ))
  
  if (!isAlreadyCalling) {
    callUser(data.socket);
    console.log(data.socket)
    isAlreadyCalling = true;
  }
 });


 peerConnection.ontrack = function({ streams: [stream] }) {
  console.log("on track")
  const remoteVideo = document.getElementById("remote-video");
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
 };