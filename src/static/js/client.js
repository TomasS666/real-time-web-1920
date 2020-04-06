
var socket = io();

socket.on("message", addMessages)

const submitBtn = document.querySelector("#send")

submitBtn.addEventListener("click", function(e){
    console.log("test")
    sendMessage({
        name: document.querySelector("#name").value, 
        message:document.querySelector("#message").value, 
    });
getMessages();
});


function addMessages(message){
    console.log(message)
    const messageBox = document.querySelector("#messages")

    messageBox.insertAdjacentHTML("afterbegin", 
    `<h4> ${message.name} </h4>
    <p>  ${message.message} </p>`
    )
}
    
 function getMessages(){
console.log("Get messages")
   fetch(`${window.location.href}messages`) 
   .then(data => {
       console.log(data)     
       return data.json()
    })
    .then(json =>{
        console.log(json)
        return json.forEach(addMessages);
    })
  }
  
 function sendMessage(message){

    socket.emit("message", message)

    fetch(`${window.location.href}messages`,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(message) // body data type must match "Content-Type" header
      })
  }