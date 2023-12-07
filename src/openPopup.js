// Find and save buttons and popus for create & edit
const createButton = document.getElementById("create-button");
console.log(createButton);
const editButton = document.getElementById("edit-button");
console.log(editButton);

const createPopup = document.getElementById("popup-create");
console.log(createPopup);
const editPopup = document.getElementById("popup-edit");
console.log(editPopup);

const overlay = document.getElementById("overlay");
let currentPopup = null;

// Function to open a popup
function openPopup(popup) {
  currentPopup = popup;
  popup.style.display = "block";
  overlay.style.display = "block";
}

// Function to close the popup
function closePopup() {
  currentPopup.style.display = "none";
  overlay.style.display = "none";
}

// Register onClick popup events
createButton.addEventListener("click", (event) => openPopup(createPopup));
editButton.addEventListener("click", (event) => openPopup(editPopup));
