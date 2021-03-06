
const socket = io();

socket.on("message", addMessages)
socket.on("detected lang", assignDefaultLang)

const submitBtn = document.querySelector("#send")
getMessages();

socket.on("lang set", serverMsg)

submitBtn.addEventListener("click", function(e){
    console.log("test")
    e.preventDefault()

//  Check form with native HTML 5 validation
//  If not empty, send.
//  If someone somehow manages to send an empty message, the server will resolve this by sending
//  back an error message to the sender.
    if(document.forms['chat'].reportValidity()){
        sendMessage({
            name: "You",
            message:document.querySelector("#message").value, 
        });
        
        document.querySelector("#message").value = null;
    }
});

function assignDefaultLang(lang){
 
    const dropdown = document.querySelector("select");
    // console.log(dropdown)
    if(dropdown){
        const options = dropdown.querySelectorAll("option")
        for(let i = 0; i < options.length; i++){
            // console.log(options[i])
            if(options[i].value == lang){
                options[i].selected = true;
            }
        }
    }
}

function detectUserPrefLang(){
  
    

    const lang = window.navigator.language || window.navigator.userLanguage

    const langCode = lang.split("-")[0];

    socket.emit("detected lang", {lang: langCode})

    assignDefaultLang(langCode)
    // {
    //     language: window.navigator.language || window.navigator.userLanguage
    // })
}



function changeLanguage(langcode){

    socket.emit("detected lang", {
        lang: langcode
    })
}

const dropdown = document.querySelector("select");

dropdown.addEventListener("change", function(event){
    console.log(this.value)

    changeLanguage(this.value)
})

detectUserPrefLang()


function getCursorElement (id) {
  var elementId = 'cursor-' + id;
  var element = document.getElementById(elementId);
  if(element == null) {
    element = document.createElement('div');
    element.id = elementId;
    element.className = 'cursor';
    // Perhaps you want to attach these elements another parent than document
    document.appendChild(element);
  }
  return element;
}


function addMessages(message){
    // console.log(message)
    const messageBox = document.querySelector("#messages")

    messageBox.insertAdjacentHTML("beforeend", 
    `<h4> ${message.name} </h4>
    <p>  ${message.message} </p>`
    )

    window.scrollTo(0,document.querySelector("#messages").scrollHeight);
}


socket.on("test", receiveError)


function serverMsg(message){
    const messageBox = document.querySelector("#messages")
    messageBox.insertAdjacentHTML("beforeend", 
    `<div class="error">
    <h4> ${message.name} </h4>
    <p>  ${message.body} </p>
    </div>`
    )
}

function receiveError(err){
    console.log(err)
    const messageBox = document.querySelector("#messages")
    messageBox.insertAdjacentHTML("beforeend", 
    `<div class="error">
    <h4> ${err.name} </h4>
    <p>  ${err.body} </p>
    </div>`
    )
    
}
    
 function getMessages(){
console.log("Get messages")
   fetch(`${window.location.href}/messages`) 
   .then(data => {
    //    console.log(data)     
       return data.json()
    })
    .then(json =>{
        console.log(json)
        return json.forEach(addMessages);
    })
  }
  
 function sendMessage(message){

    socket.emit("message", message)

    fetch(`${window.location.href}/messages`,{
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