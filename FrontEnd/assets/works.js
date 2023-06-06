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

// // // Creating Filters // // //
const filtersArray =[];

async function generateFilters(){
    // Variables pour la fonction
    const filterSection = document.querySelector(".filters");
    
    const filterTous = document.createElement("div");
    filterTous.classList.add("filter");
    filterTous.setAttribute("id", "selected")
    filterTous.innerText = "Tous";
    filterSection.appendChild(filterTous);
    filtersArray.push(filterTous); 

    const gallery = document.querySelector(".gallery");

    let currentIndex = 0;
    let lastCategory ="";
    
    
  //  Récupération des données
    await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        const categoriesSet = new Set();

        data.forEach(item => {
            const { name } = item.category;
            categoriesSet.add(name);
        })
        
        // Fonction pour le click sur Tous
        filterTous.addEventListener("click", function() {
          gallery.innerHTML = "";
          getWorksDatas()
        });
        
        const categories = Array.from(categoriesSet);
        
        // Création des filtres
        categories.forEach(category => {
            const filter = document.createElement("div");
            filter.classList.add("filter")
            filter.innerText = category;
            filterSection.appendChild(filter);
            filtersArray.push(filter);

            // Fonction de tri par filtres
            filter.addEventListener("click", function(event) {
              const selectedFilter = event.target;
              console.log(selectedFilter);
              const selectedCategory = selectedFilter.innerText;
              
              gallery.innerHTML = "";
  
              let worksToDisplay = [];
          
              worksToDisplay=data.filter(item => item.category.name === selectedCategory )
              
              worksToDisplay.forEach(item => {
                  const workElement = document.createElement("figure");
                  
                  const imgWorkElement = document.createElement ("img");
                  imgWorkElement.src=item.imageUrl;
      
                  const captionWorkElement = document.createElement ("figcaption")
                  captionWorkElement.innerText=item.title;
      
                  gallery.appendChild(workElement);
                  workElement.appendChild(imgWorkElement);
                  workElement.appendChild(captionWorkElement);
              });
  
            
            
            
          });
        })
    });

    // Mise en "surbrillance" du filtre séléctionné
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
    
}

generateFilters()


// // // Selected Filter Function // // //

// const filterSection = document.querySelector(".filters");

// let currentIndex = 0;
// let lastCategory ="";


// function update(index) {
    
//   for (let i = 0; i < filtersArray.length; i++) {
//     if (i === index) {
//       filtersArray[i].setAttribute("id", "selected");
//     } else {
//       filtersArray[i].removeAttribute("id");
//     }
//   }
// }

// filterSection.addEventListener("click", function(event) {
//   const selectedFilter = event.target;
//   const index = filtersArray.indexOf(selectedFilter);
//   update(index, currentIndex);
//   console.log ("index actif: ", index);
// });
    







// // // Filters // // //

// async function getDatasFromFilters() {
//     await fetch('http://localhost:5678/api/works')
//     .then(response => response.json())
//     .then(data => {
//         const gallery = document.querySelector(".gallery");
//         const filterSection = document.querySelector(".filters");
//         const filter = document.querySelector(".filter");
          
//         filterSection.addEventListener("click", function(event) {
//             const selectedFilter = event.target;
//             console.log(selectedFilter);
//             const index = filtersArray.indexOf(selectedFilter);
//             console.log(index);
//             const selectedCategory = (index === -1) ? lastCategory : selectedFilter.innerText;
            
            
//             gallery.innerHTML = "";

//             let worksToDisplay = [];
//             if (selectedCategory === "Tous"){
//               data.forEach(item => worksToDisplay.push(item))
//             }
//             else{
//               worksToDisplay=data.filter(item => item.category.name === selectedCategory )
//             }
//             worksToDisplay.forEach(item => {
//                 const workElement = document.createElement("figure");
                
//                 const imgWorkElement = document.createElement ("img");
//                 imgWorkElement.src=item.imageUrl;
    
//                 const captionWorkElement = document.createElement ("figcaption")
//                 captionWorkElement.innerText=item.title;
    
//                 gallery.appendChild(workElement);
//                 workElement.appendChild(imgWorkElement);
//                 workElement.appendChild(captionWorkElement);
//             });

          
//           lastCategory = selectedCategory;
//           console.log("last category: ", lastCategory);
          
//         });
         
// })};

// getDatasFromFilters();




          // if (selectedCategory === "Tous"){
          //   data.forEach(item => {
          //       const workElement = document.createElement("figure");
                
          //       const imgWorkElement = document.createElement ("img");
          //       imgWorkElement.src=item.imageUrl;
    
          //       const captionWorkElement = document.createElement ("figcaption")
          //       captionWorkElement.innerText=item.title;
    
          //       gallery.appendChild(workElement);
          //       workElement.appendChild(imgWorkElement);
          //       workElement.appendChild(captionWorkElement);
          //   });
          // }
          
        //   else{
        //     data.forEach(item => {
        //       const categoryName = item.category.name;
        //       if (selectedCategory === categoryName) {

        //         const workElement = document.createElement("figure");

        //         const imgWorkElement = document.createElement("img");
        //         imgWorkElement.src = item.imageUrl;

        //         const captionWorkElement = document.createElement("figcaption");
        //         captionWorkElement.innerText = item.title;

        //         gallery.appendChild(workElement);
        //         workElement.appendChild(imgWorkElement);
        //         workElement.appendChild(captionWorkElement);
        //       }
        //     });    
        // }