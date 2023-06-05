// // // Creating Filters // // //
const filtersArray =[];

async function generateFilters(){

    const filterSection = document.querySelector(".filters");
    
    const filterTous = document.createElement("div");
    filterTous.classList.add("filter");
    filterTous.setAttribute("id", "selected")
    filterTous.innerText = "Tous";
    filterSection.appendChild(filterTous);
    filtersArray.push(filterTous); 
    
   
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
    });
    
}

generateFilters()


// // // Selected Filter Function // // //

const filterSection = document.querySelector(".filters");

let currentIndex = 0;
let lastCategory ="";


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
  update(index, currentIndex);
  console.log ("index actif: ", index);
});
    


// // Extract datas from api and create elements on page // // //

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


// // // Filters // // //

async function getDatasFromFilters() {
    await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const gallery = document.querySelector(".gallery");
        const filterSection = document.querySelector(".filters");
        const filter = document.querySelector(".filter");
       
        filterSection.addEventListener("click", function(event) {
            const selectedFilter = event.target;
            const index = filtersArray.indexOf(selectedFilter)
            const selectedCategory = (index === -1) ? lastCategory : selectedFilter.innerText;
            
            
          gallery.innerHTML = "";

          if (selectedCategory === "Tous"){
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
          }
          
          else{
            data.forEach(item => {
              const categoryName = item.category.name;
              if (selectedCategory === categoryName) {

                const workElement = document.createElement("figure");

                const imgWorkElement = document.createElement("img");
                imgWorkElement.src = item.imageUrl;

                const captionWorkElement = document.createElement("figcaption");
                captionWorkElement.innerText = item.title;

                gallery.appendChild(workElement);
                workElement.appendChild(imgWorkElement);
                workElement.appendChild(captionWorkElement);
              }
            });    
        }
          lastCategory = selectedCategory;
          console.log("last category: ", lastCategory);
          
        });
         
})};

getDatasFromFilters();

