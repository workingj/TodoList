const createButton = document.getElementById("create-button");
console.log(createButton);

const createPopup = document.getElementById("popup-create");
console.log(createPopup);

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

createButton.addEventListener("click", (event) => openPopup(createPopup));
