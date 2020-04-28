const socket = io()

window.onload = function(){

    if(document.querySelector("form")){
    listenToForm(document.querySelector("form"))


    function listenToForm(form){
        
        form.addEventListener("submit", function(event){
            // event.preventDefault()
            const data = new FormData(document.querySelector("form"))
            console.log(data)
            for (var [key, value] of data.entries()) { 
                console.log(key, value);
              }
            socket.emit('add show', {data:data})
            return true
        })
    }
    }


    socket.on('client show added', (data)=>{
        console.log(data.data.data)
        console.log(data)
        for (var [key, value] of data.data.data.entries()) { 
            console.log(key, value);
          }
    })
    // function addShow(){

    // }

}



    