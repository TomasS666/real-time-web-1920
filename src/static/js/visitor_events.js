window.addEventListener('offline', function(event){
    console.log("You lost connection.");
    socket.disconnect();
});

const socket = io()





// console.log(transition)

// window.onload = function(){



    socket.on('client show updated', (data)=>{
        console.log(data.data.data)
        console.log(data)
    })

    socket.on('client show deleted', (data)=>{
        console.log(data.data.data)
        console.log(data)
    })


// }


function getShows(){
    return fetch("/shows")
}

let shows = []

getShows()
    .then(string =>{
        return string.json()
    })
    .then(json => {
        update(json)

        shows = json
        socket.on('client show added', (data)=>{
            console.log(data.data)

            // Why does unshift not work as expected?
            shows.push(data.data)
            console.log(shows)
            update(shows)
        })
    })

function update(json){

    console.log('updating')
    d3
    .select('#shows')

    .selectAll('article')
        .data(json)
        .join(
            function(enter){
                console.log('Enter')

                const article = enter.append('article').style('opacity', 0)
                    
                article.append('h3')
                    .text(function(d){
                        return d.name
                    });
               
                article.selectAll('div')
                        .data(d => d.genres)
                            .join(
                                function(enter){
                                    return enter
                                        .append('div')
                                        .text( d => d )
                                }
                            );
                     
                article
                    .append('a')
                    .attr('href', function(d){
                        return '/show'
                    })
                    .text('join show')

                return article.lower()

            },
            function(update){
                return update
            },
            function(exit){
                return exit
            }
        ).transition()
        .delay((d, i)=>{
            return i * 100;
        })
        .duration(200)
        
        .style("opacity", 1);

}





function getRenderedShows(parent, node){
    return document.querySelectorAll(`${target} ${node}`)
}


function insertShow(show){
    const showsContainer = document.querySelector("#shows")
    let genres = ''

    if(show.genres.length){
        
        for(let i = 0; i < show.genres.length; i++){
            genres += `<div>${show.genres[i]}</div>`
        }
    }

   return showsContainer.insertAdjacentHTML('afterbegin', `
    <article>
    <div class="new-show">update</div>
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