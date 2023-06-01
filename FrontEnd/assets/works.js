// // // Extract datas from api and create elements on page // // //
async function getWorksDatas(){

    await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const gallery = document.querySelector(".gallery");
       
        data.forEach(item => {
            const workElement = document.createElement("figure");
            
            const imgWorkElement = document.createElement ("img");
            imgWorkElement.src=item.imageUrl;

            const captionWorkElement = document.createElement ("figcaption")
            captionWorkElement.innerText=item.title;

            gallery.appendChild(workElement);
            workElement.appendChild(imgWorkElement);
            workElement.appendChild(captionWorkElement);

        });
    })
}

getWorksDatas()

