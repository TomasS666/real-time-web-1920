

const socket = io()

window.onload = function(){

    if(document.querySelector("form")){
    listenToForm(document.querySelector("form"))


    function listenToForm(form){
        
        form.addEventListener("submit", function(event){
            // event.preventDefault()
            const data = new FormData(document.querySelector("form"))
            console.log(data)
            // for (var [key, value] of data.entries()) { 
            //     console.log(key, value);
            //   }
            // socket.emit('add show', {data:data})
            return true
        })
    }

}


if(document.querySelector('section#shows')){
    const showWrapper = document.querySelector('section#shows')

    showWrapper.addEventListener('click', (event) => {
        event.preventDefault()
        if(event.target.tagName.toLowerCase() == 'button'){
            
        console.log('coming here')


            const room_id = event.target.getAttribute('data-room_id')


            fetch(`/remove-show/${room_id}`, {
                method: 'DELETE'
            }).then(res => {
                console.log(res)

                socket.emit('artist deleted show', room_id )
                // window.location.reload()
            })
            .catch(err => console.log(err))
        }
    })
}

function hostingShow(){

}

}

    