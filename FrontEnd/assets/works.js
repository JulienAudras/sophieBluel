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
} else {
  generateFilters();
}

function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}
function escapeClose(e) {
  if (e.keyCode === 27) {
    closeModal();
    closeAddPhotoModal();
  }
}
function openAddPhotoModal() {
  addPhotoModal.style.display = "block";
}

function closeAddPhotoModal() {
  addPhotoModal.style.display = "none";
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

  addPhotoButton.addEventListener("click", function () {
    closeModal();
    generateAndOpenAddPhotoModal();
  });

  const addPhotoText = document.createElement("p");
  addPhotoText.innerText = "Ajouter une photo";

  const deleteAll = document.createElement("p");
  deleteAll.classList.add("deleteAll");
  deleteAll.innerText = "Supprimer la galerie";

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

      data.forEach((item, index) => {
        const workElement = document.createElement("figure");
        workElement.classList.add("figureForModal");
        const figureId = item.id;
        workElement.id = `${figureId}`;

        const imgWorkElement = document.createElement("img");
        imgWorkElement.src = item.imageUrl;
        imgWorkElement.classList.add("imgForModal");

        const trashContainer = document.createElement("div");
        trashContainer.classList.add("figureContainer", "trashContainer");

        const trashElement = document.createElement("i");
        trashElement.classList.add("fa-solid", "fa-trash-can");

        const captionWorkElement = document.createElement("figcaption");
        captionWorkElement.innerText = "editer";
        captionWorkElement.classList.add("figcaptionForModal");

        modalGallery.appendChild(workElement);
        workElement.appendChild(imgWorkElement);
        workElement.appendChild(captionWorkElement);

        if (index === 0) {
          const arrowsContainer = document.createElement("div");
          arrowsContainer.classList.add("figureContainer", "arrowsContainer");

          const arrowsElement = document.createElement("i");
          arrowsElement.classList.add(
            "fa-solid",
            "fa-arrows-up-down-left-right"
          );

          workElement.appendChild(arrowsContainer);
          arrowsContainer.appendChild(arrowsElement);
        }

        workElement.appendChild(trashContainer);
        trashContainer.appendChild(trashElement);

        const trashContainers = document.querySelectorAll(".trashContainer");
        trashContainers.forEach((trashContainer) => {
          trashContainer.addEventListener("click", function (event) {
            event.preventDefault();
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

let addPhotoModal;

function generateAddPhotoModal() {
  addPhotoModal = document.createElement("div");
  addPhotoModal.classList.add("modal", "photoModal");
  document.body.appendChild(addPhotoModal);

  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");

  modalBackground.addEventListener("click", closeAddPhotoModal);

  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");

  const iconBar = document.createElement("div");
  iconBar.classList.add("iconBar");

  const backButton = document.createElement("i");
  backButton.classList.add("fa-solid", "fa-arrow-left");
  backButton.addEventListener("click", function () {
    closeAddPhotoModal();
    generateAndOpenModal();
  });

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";

  closeBtn.addEventListener("click", closeAddPhotoModal);

  const addPhotoForm = document.createElement("form");
  addPhotoForm.classList.add("addPhotoForm");

  const formTitleContainer = document.createElement("div");
  formTitleContainer.classList.add("formTitleContainer");
  addPhotoForm.appendChild(formTitleContainer);

  const modalTitle = document.createElement("h3");
  modalTitle.classList.add("addPhotomodalTitle");
  modalTitle.innerText = "Ajout photo";
  formTitleContainer.appendChild(modalTitle);

  const uploadPhotoContainer = document.createElement("div");
  uploadPhotoContainer.classList.add("uploadPhotoContainer");
  addPhotoForm.appendChild(uploadPhotoContainer);

  const uploadPhotoIcon = document.createElement("i");
  uploadPhotoIcon.classList.add("fa-solid", "fa-image");
  uploadPhotoContainer.appendChild(uploadPhotoIcon);

  const uploadPhotoButtonContainer = document.createElement("div");
  uploadPhotoButtonContainer.classList.add("uploadPhotoButtoncontainer");
  uploadPhotoContainer.appendChild(uploadPhotoButtonContainer);

  const uploadPhotoButton = document.createElement("input");
  uploadPhotoButton.classList.add("uploadPhotoButton");
  uploadPhotoButton.type = "file";
  uploadPhotoButton.id = "photo";
  uploadPhotoButton.accept = ".jpg, .png";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButton);

  let img;

  uploadPhotoButton.addEventListener("input", () => {
    const photoPreview = new FileReader();
    photoPreview.readAsDataURL(uploadPhotoButton.files[0]);

    photoPreview.addEventListener("load", () => {
      const invalidFile = document.querySelector(".invalidFile");
      var fileInput = document.getElementById("photo");
      var file = fileInput.files[0];
      // var invalidFile = document.querySelector(".invalidFile");

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        invalidFile.innerText = "Veuillez sélectionner un fichier JPG ou PNG.";
        console.log("pas le bon format");
      } else if (file.size > 4 * 1024 * 1024) {
        invalidFile.innerText =
          "Veuillez sélectionner un fichier de moins de 4 Mo.";
        console.log("trop lourd");
      } else {
        invalidFile.innerText = "";
        const url = photoPreview.result;

        img = new Image();
        img.classList.add("photoPreviewImg");
        img.src = url;
        uploadPhotoContainer.appendChild(img);
        return img;
      }
    });
  });

  const uploadPhotoButtonText = document.createElement("label");
  uploadPhotoButtonText.classList.add("uploadPhotoButtonText");
  uploadPhotoButtonText.setAttribute("for", "file-input");
  uploadPhotoButtonText.textContent = "+ Ajouter photo";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButtonText);

  const uploadPhotodescription = document.createElement("p");
  uploadPhotodescription.classList.add("uploadPhotodescription");
  uploadPhotodescription.innerText = "jpg, png : 4mo max";
  uploadPhotoContainer.appendChild(uploadPhotodescription);

  const invalidFile = document.createElement("p");
  invalidFile.innerText = "";
  invalidFile.classList.add("invalidFile");
  addPhotoForm.appendChild(invalidFile);

  const titleLabel = document.createElement("label");
  titleLabel.classList.add("titleLabel");
  titleLabel.textContent = "Titre";
  addPhotoForm.appendChild(titleLabel);

  const nameInput = document.createElement("input");
  nameInput.classList.add("nameInput");
  nameInput.type = "text";
  nameInput.name = "titre";
  addPhotoForm.appendChild(nameInput);

  const categoryLabel = document.createElement("Label");
  categoryLabel.classList.add("categoryLabel");
  categoryLabel.innerText = "Catégorie";
  addPhotoForm.appendChild(categoryLabel);

  const categorySelect = document.createElement("select");
  categorySelect.name = "Categorie";
  categorySelect.classList.add("categorySelect");
  let categoryName;
  let categoryId;
  categorySelect.addEventListener("click", async () => {
    if (categorySelect.options.length === 0) {
      const response = await fetch("http://localhost:5678/api/categories");
      const data = await response.json();

      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      const selectedOption =
        categorySelect.options[categorySelect.selectedIndex];
      categoryName = selectedOption.text;
      categoryId = selectedOption.value;
      console.log("Catégorie sélectionnée :", categoryName);
    }
  });

  addPhotoForm.appendChild(categorySelect);

  const addPhotoIcon = document.createElement("i");
  addPhotoIcon.classList.add("addPhotoIcon");

  const hr = document.createElement("hr");
  addPhotoForm.appendChild(hr);

  function updateSendButtonId() {
    const uploadPhotoFiles = uploadPhotoButton.files;
    const isNameInputFilled = nameInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (
      uploadPhotoFiles.length > 0 &&
      isNameInputFilled &&
      isCategorySelected
    ) {
      sendButton.id = "buttonReadyToWork";
      console.log(sendButton.id);
    } else {
      sendButton.id = "";
      console.log("not ready to work");
    }
  }

  uploadPhotoButton.addEventListener("change", updateSendButtonId);
  nameInput.addEventListener("input", updateSendButtonId);
  categorySelect.addEventListener("change", updateSendButtonId);

  const sendButton = document.createElement("button");
  sendButton.type = "submit";

  addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (sendButton.id === "buttonReadyToWork") {
      console.log(uploadPhotoButton.files, nameInput.value, categoryName);
      event.preventDefault();
      postDatas();
      return false;
    } else {
      event.preventDefault();
      console.log("Alright");
    }
  });

  async function postDatas() {
    console.log(categoryName);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", uploadPhotoButton.files[0]);
    formData.append("title", nameInput.value);
    formData.append("category", categoryId);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 201) {
      console.log("Données envoyées avec succès");
      const data = await response.json();
      console.log("Données retournées :", data);
      console.log("Attribut 1 :", data.attribut1);
      console.log("Attribut 2 :", data.attribut2);
      return data;
    } else if (response.status === 400) {
      console.log("Échec de l'envoi des données code 400 Bad Request");
    } else if (response.status === 401) {
      console.log("Échec de l'envoi des données code 401 Unauthorized");
    } else if (response.status === 500) {
      console.log("Échec de l'envoi des données code 500 Unexpected Error");
    } else {
      console.log("nolosé");
    }
  }

  sendButton.classList.add("sendButton");
  addPhotoForm.appendChild(sendButton);

  const sendButtonText = document.createElement("p");
  sendButtonText.classList.add("sendButtonText");
  sendButtonText.innerText = "Valider";
  sendButton.appendChild(sendButtonText);

  window.addEventListener("keyup", escapeClose);

  addPhotoModal.appendChild(modalBackground);
  addPhotoModal.appendChild(modalWindow);
  modalWindow.appendChild(iconBar);
  iconBar.appendChild(backButton);
  iconBar.appendChild(closeBtn);
  modalWindow.appendChild(modalTitle);
  modalWindow.appendChild(addPhotoForm);

  return addPhotoModal;
}

function generateAndOpenModal() {
  if (modal) {
    document.body.removeChild(modal);
  }

  modal = generateModal();
  document.body.appendChild(modal);
  openModal();
  getWorksDatasForModal();
}

function generateAndOpenAddPhotoModal() {
  if (addPhotoModal) {
    document.body.removeChild(addPhotoModal);
  }

  addPhotoModal = generateAddPhotoModal();
  document.body.appendChild(addPhotoModal);
  openAddPhotoModal();
}

console.log(localStorage);
console.log("token: ", token);
