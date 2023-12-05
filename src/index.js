// Todo Item Object
class TodoItem {
  #id;
  #creationDate;
  #dueDate;
  #content;
  #state;
  #due;
  constructor(text, deadline) {
    this.id = Date.now();
    this.creationDate = Date.now();
    this.dueDate = this.creationDate + deadline * 86400; // Seconds per day
    this.content = text;
    this.finish = true; // open, done
    this.due = false;
  }
}

function itemGetContent(item) {
  return item.content;
}
function itemGetId(item) {
  return item.id + "";
}

function itemUpdate(event) {
  alert('event');
  // item.content = text;
}

function itemDelete(event) {
  const id = event.target.dataset.id;
  document.getElementById(id).remove();

  let items = loadLocalStorage();
  items = items.filter((item) => item.id != id);

  updateLocalStorage(items);
  updateTodoListHTML();
}

function itemCheckDueDate(item) {
  if (Date.now() > item.dueDate) {
    item.due = true;
  }
}

function loadLocalStorage() {
  if (localStorage.getItem("todolist") != null) {
    let items = localStorage.getItem("todolist");
    try {
      return JSON.parse(items);
    } catch (error) {}
  } else {
    return [];
  }
}

function updateTodoListHTML() {
  const listitems = loadLocalStorage();
  const todolist = document.getElementById("todolist");

  todolist.innerHTML = "";

  listitems.forEach((item) => {
    todolist.appendChild(createListitem(item));
  });
}

function updateLocalStorage(listitems) {
  localStorage.setItem("todolist", JSON.stringify(listitems));
  updateTodoListHTML();
}

function createNewItem() {
  let textinput = document.querySelector("#todo-text");
  let deadlineinput = document.querySelector("#deadline");
  const text = textinput.value;

  if (text != "") {
    const deadline = deadlineinput.value;
    textinput.value = "";

    let listitems = loadLocalStorage();
    listitems.push(new TodoItem(text, deadline));
    updateLocalStorage(listitems);
  }
}

function createListitem(item) {
  // Create Listitem
  let li = document.createElement("li");
  li.setAttribute("id", itemGetId(item));
  li.innerHTML = itemGetContent(item);

  // Create Checkbox and add to Listitem
  let btnCheck = document.createElement("INPUT");
  btnCheck.setAttribute("type", "checkbox");
  btnCheck.dataset.id = itemGetId(item);
  li.appendChild(btnCheck);

  // Create Edit Button and add to Listitem
  let btnEdit = document.createElement("i");
  btnEdit.setAttribute("class", "fas fa-edit edit-icon");
  btnEdit.dataset.id = itemGetId(item);
  btnEdit.addEventListener("click", itemUpdate);
  li.appendChild(btnEdit);

  // Create Delete Button and add to Listitem
  let btnDelete = document.createElement("i");
  btnDelete.setAttribute("class", "fas fa-trash delete-icon");
  btnDelete.dataset.id = itemGetId(item);
  btnDelete.addEventListener("click", itemDelete);
  li.appendChild(btnDelete);

  return li;
}
