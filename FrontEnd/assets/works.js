// // Extract datas from api and create elements on page // // //
async function getWorksDatas() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const gallery = document.querySelector(".gallery");

      data.forEach((item) => {
        const workElement = document.createElement("figure");
        workElement.id = item.id;

        const imgWorkElement = document.createElement("img");
        imgWorkElement.src = item.imageUrl;

        const captionWorkElement = document.createElement("figcaption");
        captionWorkElement.innerText = item.title;

        gallery.appendChild(workElement);
        workElement.appendChild(imgWorkElement);
        workElement.appendChild(captionWorkElement);
      });
    });
}

getWorksDatas();

// // // Creating Filters // // //
const filtersArray = [];

async function generateFilters() {
  // Variables pour la fonction
  const filterSection = document.querySelector(".filters");

  const filterTous = document.createElement("div");
  filterTous.classList.add("filter");
  filterTous.setAttribute("id", "selected");
  filterTous.innerText = "Tous";
  filterSection.appendChild(filterTous);
  filtersArray.push(filterTous);

  const gallery = document.querySelector(".gallery");

  let currentIndex = 0;
  let lastCategory = "";

  //  Récupération des données
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const categoriesSet = new Set();

      data.forEach((item) => {
        const { name } = item.category;
        categoriesSet.add(name);
      });

      // Fonction pour le click sur Tous
      filterTous.addEventListener("click", function () {
        gallery.innerHTML = "";
        getWorksDatas();
      });

      const categories = Array.from(categoriesSet);

      // Création des filtres
      categories.forEach((category) => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.innerText = category;
        filterSection.appendChild(filter);
        filtersArray.push(filter);

        // Fonction de tri par filtres
        filter.addEventListener("click", function (event) {
          const selectedFilter = event.target;
          console.log(selectedFilter);
          const selectedCategory = selectedFilter.innerText;

          gallery.innerHTML = "";

          let worksToDisplay = [];

          worksToDisplay = data.filter(
            (item) => item.category.name === selectedCategory
          );

          worksToDisplay.forEach((item) => {
            const workElement = document.createElement("figure");

            const imgWorkElement = document.createElement("img");
            imgWorkElement.src = item.imageUrl;

            const captionWorkElement = document.createElement("figcaption");
            captionWorkElement.innerText = item.title;

            gallery.appendChild(workElement);
            workElement.appendChild(imgWorkElement);
            workElement.appendChild(captionWorkElement);
          });
        });
      });
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

  filterSection.addEventListener("click", function (event) {
    const selectedFilter = event.target;
    const index = filtersArray.indexOf(selectedFilter);
    if (index !== -1) {
      update(index, currentIndex);
      console.log("index actif: ", index);
    }
  });
}

// // // Editor mode // // //

const closeButton = document.querySelector(".closeBtn");

const token = localStorage.getItem("token");
// const buttonModifiers = [];

let modal;

function editorMode() {
  const header = document.getElementById("pageHeader");
  const body = document.body;

  const editorBar = document.createElement("div");
  editorBar.classList.add("editorBar");
  body.appendChild(editorBar);
  body.insertBefore(editorBar, header);

  const edittorTitle = document.createElement("div");
  edittorTitle.classList.add("edittorTitle");
  editorBar.appendChild(edittorTitle);
  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");
  edittorTitle.appendChild(editorIcon);
  const editorTitleText = document.createElement("h4");
  editorTitleText.innerText = "Mode édition";
  editorTitleText.classList.add("editorTitleText");
  edittorTitle.appendChild(editorTitleText);

  const publishButton = document.createElement("div");
  publishButton.classList.add("publishButton");
  editorBar.appendChild(publishButton);
  const publishText = document.createElement("p");
  publishText.innerText = "publier les changement";
  publishText.classList.add("publishText");
  publishButton.appendChild(publishText);

  // Button to edit

  const introSection = document.querySelector(".sectionPhotoIntro");
  insertButtonModifier(introSection);

  const projetsTitleSection = document.querySelector(".projetsTitleSection");
  insertButtonModifier(projetsTitleSection);

  const buttonModifierGalerie = document.getElementById("buttonModifier-1");

  buttonModifierGalerie.addEventListener("click", generateAndOpenModal);
}

let buttonModifierCounter = 0;

function insertButtonModifier(targetSection) {
  const buttonModifier = document.createElement("div");
  buttonModifier.classList.add("buttonModifier");

  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");
  buttonModifier.appendChild(editorIcon);

  const buttonModifierText = document.createElement("p");
  buttonModifierText.innerText = "modifier";
  buttonModifier.appendChild(buttonModifierText);

  const uniqueId = "buttonModifier-" + buttonModifierCounter;
  buttonModifier.id = uniqueId;
  buttonModifierCounter++;

  targetSection.appendChild(buttonModifier);
  // buttonModifiers.push(buttonModifier);
}

if (token) {
  editorMode();
  insertButtonModifier();
} else {
  generateFilters();
}

function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}

function generateModal() {
  modal = document.createElement("div");
  modal.classList.add("modal");

  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");

  modalBackground.addEventListener("click", closeModal);

  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";

  closeBtn.addEventListener("click", closeModal);

  const modalTitle = document.createElement("h3");
  modalTitle.innerText = "Galerie photo";

  const modalGallery = document.createElement("div");
  modalGallery.classList.add("modal-gallery");

  const hr = document.createElement("hr");

  const addPhotoButton = document.createElement("div");
  addPhotoButton.classList.add("addPhotoButton");

  const addPhotoText = document.createElement("p");
  addPhotoText.innerText = "Ajouter une photo";

  const deleteAll = document.createElement("p");
  deleteAll.classList.add("deleteAll");
  deleteAll.innerText = "Supprimer la galerie";

  function escapeClose(e) {
    if (e.keyCode === 27) {
      closeModal();
    }
  }

  window.addEventListener("keyup", escapeClose);

  modal.appendChild(modalBackground);
  modal.appendChild(modalWindow);
  modalWindow.appendChild(closeBtn);
  modalWindow.appendChild(modalTitle);
  modalWindow.appendChild(modalGallery);
  modalWindow.appendChild(hr);
  modalWindow.appendChild(addPhotoButton);
  addPhotoButton.appendChild(addPhotoText);
  modalWindow.appendChild(deleteAll);

  return modal;
}

async function getWorksDatasForModal() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const modalGallery = document.querySelector(".modal-gallery");
      modalGallery.innerHTML = "";

      data.forEach((item) => {
        const workElement = document.createElement("figure");
        workElement.classList.add("figureForModal");
        const figureId = item.id;
        workElement.id = `${figureId}`;

        const imgWorkElement = document.createElement("img");
        imgWorkElement.src = item.imageUrl;
        imgWorkElement.classList.add("imgForModal");

        const trashContainer = document.createElement("div");
        trashContainer.classList.add("trashContainer");

        const trashElement = document.createElement("i");
        trashElement.classList.add("fa-solid", "fa-trash-can");

        const captionWorkElement = document.createElement("figcaption");
        captionWorkElement.innerText = "editer";
        captionWorkElement.classList.add("figcaptionForModal");

        modalGallery.appendChild(workElement);
        workElement.appendChild(imgWorkElement);
        workElement.appendChild(captionWorkElement);
        workElement.appendChild(trashContainer);
        trashContainer.appendChild(trashElement);

        const trashContainers = document.querySelectorAll(".trashContainer");
        trashContainers.forEach((trashContainer) => {
          trashContainer.addEventListener("click", function () {
            deleteElementById(item.id);
            getWorksDatas();
            generateAndOpenModal();
          });
        });
      });
    });
}

async function deleteElementById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const parentElement = document.getElementById(id);
    if (parentElement) {
      parentElement.remove();
    }

    const modalElement = document.getElementById(`figure-${id}`);
    if (modalElement) {
      modalElement.remove();
    }
  }
}

// async function deleteElementFromModal(event) {
//   const token = localStorage.getItem("token");

//   const trashContainer = event.target.closest(".trashContainer");
//   if (trashContainer) {
//     const parentElement = trashContainer.parentNode;
//     if (parentElement && parentElement.id) {
//       const elementId = parentElement.id;
//       await deleteElementById(elementId);
//     }
//   }
// }

// async function updateMainPage() {
//   const response = await fetch("http://localhost:5678/api/works");
//   if (response.ok) {
//     const data = await response.json();
//     const mainGallery = document.querySelector(".main-gallery");
//     mainGallery.innerHTML = "";

//     data.forEach((item) => {
//       const workElement = document.createElement("figure");
//       workElement.id = item.id;

//       const imgWorkElement = document.createElement("img");
//       imgWorkElement.src = item.imageUrl;

//       const captionWorkElement = document.createElement("figcaption");
//       captionWorkElement.innerText = item.title;

//       gallery.appendChild(workElement);
//       workElement.appendChild(imgWorkElement);
//       workElement.appendChild(captionWorkElement);

//       mainGallery.appendChild(workElement);
//     });

//     console.log("Page principale mise à jour avec succès.");
//   }
// }

function generateAndOpenModal() {
  if (modal) {
    document.body.removeChild(modal);
  }

  modal = generateModal();
  document.body.appendChild(modal);
  openModal();
  getWorksDatasForModal();
}

console.log(localStorage);
console.log("token: ", token);

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
