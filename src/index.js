const popupCreate = document.querySelector("#popupCreate");
const popupDelete = document.querySelector("#popupDelete");
const popupEdit = document.querySelector("#popupEdit");
const overlay = document.getElementById("overlay");
let currentEvent = "";

class TodoItem {
  #id;
  #creationDate;
  #dueDate;
  #content;
  #done;
  #due;
  constructor(text, deadline) {
    this.id = getTimeStamp();
    this.creationDate = getTimeStamp();
    this.dueDate = this.creationDate + deadline * 86400; // Seconds per day
    this.content = text;
    this.done = false; // open, done
    this.due = false;
  }
}

function dataItemGetContent(item) {
  return item.content;
}
function dataItemGetId(item) {
  return item.id + "";
}

function localStorageLoad() {
  if (localStorage.getItem("todolist") != null) {
    let items = localStorage.getItem("todolist");
    try {
      return JSON.parse(items);
    } catch (error) {
      console.error(error);
    }
  } else {
    return [];
  }
}
function localStorageUpdate(listitems) {
  localStorage.setItem("todolist", JSON.stringify(listitems));
}

function listItemCreateNew() {
  let textinput = document.querySelector("#todo-text");
  let deadlineinput = document.querySelector("#deadline");
  const text = textinput.value;

  if (text != "") {
    const deadline = deadlineinput.value;
    textinput.value = "";

    let listitems = localStorageLoad();
    listitems.push(new TodoItem(text, deadline));
    localStorageUpdate(listitems);
    updateTodoListHTML();
    closePopup();
  }
}

function listItemEdit() {
  const textinput = document.querySelector("#edit-text");
  const text = textinput.value;
  if (text != "") {
    const deadlineinput = document.querySelector("#deadline-edit");
    const id = currentEvent.target.dataset.id;
    const deadline = deadlineinput.value;

    console.log(deadline);

    let listitems = localStorageLoad();
    const i = listitems.findIndex((item) => item.id == id);

    listitems[i].content = text;
    listitems[i].dueDate = listitems[i].creationDate + deadline * 86400;
    textinput.value = "";

    localStorageUpdate(listitems);
    updateTodoListHTML();
    closePopup();
  }
}

function listItemCheckBox(event) {
  const id = event.target.dataset.id;
  let items = localStorageLoad();
  let i = items.findIndex((item) => item.id == id);
  const chekcid = "check" + event.target.dataset.id;
  let checkbox = document.getElementById(chekcid);

  if (document.getElementById(id).dataset.done == "false") {
    document.getElementById(id).dataset.done = true;
    items[i].done = true;
    checkbox.setAttribute("class", "fa-regular fa-circle-check float-left mr-2");
  } else {
    document.getElementById(id).dataset.done = false;
    items[i].done = false;
    checkbox.setAttribute("class", "fa-regular fa-circle float-left mr-2");
  }
  localStorageUpdate(items);
}

function listItemDelete() {
  const id = currentEvent.target.dataset.id;
  document.getElementById(id).remove();

  let items = localStorageLoad();
  items = items.filter((item) => item.id != id);

  localStorageUpdate(items);
  updateTodoListHTML();
  closePopup();
}

function createListitemHTML(item) {
  // Create Listitem
  let li = document.createElement("li");
  li.setAttribute("id", dataItemGetId(item));
  li.dataset.due = item.due;
  li.dataset.done = item.done;

  if (item.due) {
    // Urgend
    li.setAttribute("class", "list-item bg-gradient-to-b from-tumbleweed-300 to-my-pink-500 h-flow p-4 flex-1 w-full rounded-lg items-center text-shark-700 border-2 border-solid border-white hover:bg-gradient-to-b hover:from-my-pink-700 hover:to-my-pink-500 hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-lg font-medium");
  } else {
    // Normal
    li.setAttribute("class", "list-item bg-gradient-to-b from-sky-300 to-eastern-blue-500 h-flow p-4 flex-1 w-full rounded-lg text-shark-700 border-2 border-solid border-white hover:bg-gradient-to-b hover:from-eastern-blue-700 hover:to-eastern-blue-500 hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-lg font-medium");
  }

  // Create Checkbox and add to Listitem
  let checkbox = document.createElement("i");
  checkbox.dataset.id = dataItemGetId(item);
  checkbox.addEventListener("click", listItemCheckBox);
  checkbox.setAttribute("id", "check" + item.id);

  if (item.done == true) {
    checkbox.setAttribute("class", "fa-regular fa-circle-check float-left mr-2");
  } else {
    checkbox.setAttribute("class", "fa-regular fa-circle float-left mr-2");
  }
  checkbox.dataset.done = item.done;
  li.appendChild(checkbox);

  // Create Content Span
  let span = document.createElement("span");
  span.textContent = dataItemGetContent(item);
  li.appendChild(span);

  // Create Edit Button and add to Listitem
  let btnEdit = document.createElement("i");
  btnEdit.setAttribute("class", "fa-regular fa-edit edit-icon");
  btnEdit.dataset.id = dataItemGetId(item);
  btnEdit.addEventListener("click", openPopupEdit);
  btnEdit.addEventListener("click", (event) => document.getElementById("edit-text").focus());
  document.getElementById("edit-text").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      closePopup();
    }
  });
  li.appendChild(btnEdit);

  // Create Delete Button and add to Listitem
  let btnDelete = document.createElement("i");
  btnDelete.setAttribute("class", "fa-regular fa-trash-can delete-icon ");
  btnDelete.dataset.id = dataItemGetId(item);
  btnDelete.addEventListener("click", openPopupDelete);
  li.appendChild(btnDelete);

  if (item.due && !item.done) {
    let days = document.createElement("div");
    days.textContent = Math.floor((getTimeStamp() - item.dueDate) / 86400);
    days.setAttribute("class", "due ");
    days.setAttribute("style", "float:right;");
    li.appendChild(days);
  }

  return li;
}

function updateTodoListHTML() {
  let listitems = localStorageLoad();
  const todolist = document.getElementById("todolist");

  todolist.innerHTML = "";

  listitems = listitems.map((item) => {
    if (getTimeStamp() < item.dueDate) {
      item.due = false;
    } else {
      item.due = true;
    }
    todolist.appendChild(createListitemHTML(item));
    return item;
  });

  localStorageUpdate(listitems);
}

function searchTodolistItems() {
  const search = document.getElementById("search").value;
  const ul = document.getElementById("todolist");
  const itemlist = ul.getElementsByTagName("li");

  for (i = 0; i < itemlist.length; i++) {
    let span = itemlist[i].getElementsByTagName("span")[0];
    let text = span.textContent || span.innerText;
    if (text.indexOf(search) > -1) {
      itemlist[i].style.display = "";
    } else {
      itemlist[i].style.display = "none";
    }
  }
}

function filterTodolistItems() {
  const ul = document.getElementById("todolist");
  const itemlist = ul.querySelectorAll("li");

  switch (document.querySelector("#categorie").value) {
    case "done":
      for (let item of itemlist) {
        if (item.dataset.done === "true") {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      }
      break;
    case "due":
      for (let item of itemlist) {
        if (item.dataset.due === "true") {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      }
      break;
    default:
      console.log("All");
      Array.from(itemlist).forEach((item) => {
        item.style.display = "";
      });
      break;
  }
}

function getTimeStamp() {
  return Math.round(Date.now() / 1000);
}

function openPopupCreate(event) {
  currentEvent = event;
  popupCreate.style.display = "block";
  overlay.style.display = "block";
}
function openPopupEdit(event) {
  const textinput = document.querySelector("#edit-text");
  const deadlineinput = document.querySelector("#deadline-edit");
  const id = event.target.dataset.id;
  const listitems = localStorageLoad();
  const i = listitems.findIndex((item) => item.id == id);
  textinput.value = listitems[i].content;
  deadlineinput.value = (listitems[i].dueDate - listitems[i].creationDate) / 86400;
  currentEvent = event;
  popupEdit.style.display = "block";
  overlay.style.display = "block";
}
function openPopupDelete(event) {
  currentEvent = event;
  popupDelete.style.display = "block";
  overlay.style.display = "block";
}

function maybeDelete() {
  Math.round(Math.random()) === 1 ? listItemDelete() : null;
  closePopup();
}

function closePopup(a) {
  popupCreate.style.display = "none";
  popupEdit.style.display = "none";
  popupDelete.style.display = "none";
  overlay.style.display = "none";
}
