// window.addEventListener('offline', function(event){
//     console.log("You lost connection.");
//     socket.disconnect();
// });

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
        console.log(json)
        update(json)

        shows = json
        socket.on('client show added', (data)=>{
            console.log(data.data)

            // Why does unshift not work as expected?
            shows.unshift(data.data)
            console.log(shows)
            update(shows)
        })
    })


// const test = [{name: 'Tomas'}, {name: 'Marcella'}, {name: 'Wim'}]

// update(test)
function update(json){



    const container = d3.select('#shows')
    const articles = container.selectAll('article')
    
    console.log(articles.order())

    articles
    .data(json)
    .style('transform', 'scale(0)')
        .select('h3')
        .text(d => d.name);
    articles.transition().delay((d, i)=>{
        console.log(i * 10)
        return i * 400
    })
    .duration(1000)
        .style('transform', 'scale(1)')
        // .style('padding', '1rem')


    articles
    .data(json)
        .select('div')
        .text(d => {
            console.log(d)
            return d.genres.join(', ')
        })
    articles
    .data(json)
    .enter()
        .append('article')
        .attr('id', (d, i)=> i)
        // .style('height', '0%')
        // .style('padding', '0')
        .append('h3')
        .text(d => d.name)

        .append('div')
        .text(d => {
            console.log('enter')
            return d.genres.join(', ')
        })


        // container.selectAll('article').transition()
        // .delay((d, i)=>{
        //     console.log(i * 10)
        //     return i * 400
        // })
        // .duration(1000)
        // .style('height', '100%')
        // .style('padding', '1rem')


    articles.data(json).exit().remove()
        

    // console.log('updating')
    // d3
    // .select('#shows')

    // .selectAll('article')
    //     .data(json)
    //     .join(
    //         function(enter){
    //             console.log('Enter')

    //             const article = enter.append('article').style('opacity', 0)
                    
    //             article.append('h3')
    //                 .text(function(d){
    //                     return d.name
    //                 });
               
    //             article.selectAll('div')
    //                     .data(d => d.genres)
    //                         .join(
    //                             function(enter){
    //                                 return enter
    //                                     .append('div')
    //                                     .text( d => d )
    //                             }
    //                         );
                     
    //             article
    //                 .append('a')
    //                 .attr('href', function(d){
    //                     return '/show'
    //                 })
    //                 .text('join show')

    //             return article.lower()

    //         },
    //         function(update){
    //             const article = update.select('article').select('h3').text(function(d){
    //                 return d.name
    //             });

    //             article.selectAll('div')
    //             .data(d => d.genres)
    //                 .join(
    //                     function(enter){
    //                         return enter
    //                             .append('div')
    //                             .text( d => d )
    //                     }
    //                 );

    //                 return article
    //         },
    //         function(exit){
    //             return exit.remove()
    //         }
    //     ).transition()
    //     .delay((d, i)=>{
    //         return i * 100;
    //     })
    //     .duration(200)
        
    //     .style("opacity", 1);

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