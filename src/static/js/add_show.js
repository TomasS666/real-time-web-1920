const socket = io()

window.onload = function(){

    if(document.querySelector("form")){
    listenToForm(document.querySelector("form"))


    function listenToForm(form){
        
        form.addEventListener("submit", function(event){
            event.preventDefault()
            const data = new FormData(document.querySelector("form"))
            for (var [key, value] of data.entries()) { 
                console.log(key, value);
              }
            socket.emit('add show', {data:data})
        })
    }
    }


    socket.on('show added', (data)=>{
        console.log(data)
    })
    // function addShow(){

    // }

}



    