const socket = io()

// window.onload = function(){


    socket.on('client show added', (data)=>{
        console.log(data.data)
        insertShow(data.data)
    })

    socket.on('client show updated', (data)=>{
        console.log(data.data.data)
        console.log(data)
    })

    socket.on('client show deleted', (data)=>{
        console.log(data.data.data)
        console.log(data)
    })


// }


function getRenderedShows(parent, node){
    return document.querySelectorAll(`${target} ${node}`)
}


function insertShow(show){
    const showsContainer = document.querySelector("#shows")
    let genres = null

    if(show.genres.length){
        
        for(let i = 0; i < show.genres.length; i++){
            genres += `<div>${show.genres[i]}</div>`
        }
    }

   return showsContainer.insertAdjacentHTML('afterbegin', `
    <article>
        <h2>${show.name}</h2>
        ${genres}
        <a href="/show">Join show</a>
    </article>
    `)


}


// function doesShowExist(){
//     // would want to do diffing, problem is, what to diff with? Don't have a unique id rendered,
//     // And it's actually new and inserted
//     // Later I can emit a message back to check for all nodes if something matches...
//     // And or make a show unique
// }