// // // Creating Filters // // //
const filtersArray =[];
async function generateFilters(){

    const filterSection = document.querySelector(".filters");
    
    const filter = document.createElement("div");
    filter.classList.add("filter");
    filter.setAttribute("id", "selected")
    filter.innerText = "Tous";
    filterSection.appendChild(filter);
    filtersArray.push(filter); 
   
    await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const categoriesSet = new Set();

        data.forEach(item => {
            const { name } = item.category;
            categoriesSet.add(name);
        })
        
        const categories = Array.from(categoriesSet);
        
        categories.forEach(category => {
            const filter = document.createElement("div");
            filter.classList.add("filter")
            filter.innerText = category;
            filterSection.appendChild(filter);
            filtersArray.push(filter);
        })
    })
}

generateFilters()


// // // Filter Function // // //
const filterSection = document.querySelector(".filters");

function update(index) {
    
  for (let i = 0; i < filtersArray.length; i++) {
    if (i === index) {
      filtersArray[i].setAttribute("id", "selected");
    } else {
      filtersArray[i].removeAttribute("id");
    }
  }
}

filterSection.addEventListener("click", function(event) {
  const selectedFilter = event.target;
  const index = filtersArray.indexOf(selectedFilter);
  update(index);
});
    

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

