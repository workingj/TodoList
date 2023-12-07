// Todo Item Object
class TodoItem {
  #id;
  #creationDate;
  #dueDate;
  #content;
  #done;
  #due;
  constructor(text, deadline) {
    this.id = Date.now();
    this.creationDate = Date.now();
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
    } catch (error) {}
  } else {
    return [];
  }
}

function localStorageUpdate(listitems) {
  localStorage.setItem("todolist", JSON.stringify(listitems));
  // updateTodoListHTML();
}

function listItemCreateNew() {
  let textinput = document.querySelector("#todo-text");
  let deadlineinput = document.querySelector("#deadline");
  const text = textinput.value;

  if (text != "") {
    const deadline = deadlineinput.value;
    console.log(deadline);
    textinput.value = "";

    let listitems = localStorageLoad();
    listitems.push(new TodoItem(text, deadline));
    localStorageUpdate(listitems);
    updateTodoListHTML();
  }
}

function listItemEdit(event) {
  alert(event);
  // item.content = text;
}

function listItemCheckBox(event) {
  const id = event.target.dataset.id;
  let items = localStorageLoad();
  let i = items.findIndex((item) => item.id == id);

  if (document.getElementById(id).dataset.done == "false") {
    document.getElementById(id).dataset.done = true;
    items[i].done = true;
  } else {
    document.getElementById(id).dataset.done = false;
    items[i].done = false;
  }
  // console.table(items);
  localStorageUpdate(items);
}

function listItemDelete(event) {
  const id = event.target.dataset.id;
  document.getElementById(id).remove();

  let items = localStorageLoad();
  items = items.filter((item) => item.id != id);

  localStorageUpdate(items);
  updateTodoListHTML();
}

function createListitemHTML(item) {
  // Create Listitem
  let li = document.createElement("li");
  li.setAttribute("id", dataItemGetId(item));
  li.dataset.due = item.due;
  li.dataset.done = item.done;

  // Create Content Span
  let span = document.createElement("span");
  span.textContent = dataItemGetContent(item);
  li.appendChild(span);

  // Create Checkbox and add to Listitem
  let checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.dataset.id = dataItemGetId(item);
  checkbox.addEventListener("click", listItemCheckBox);
  checkbox.checked = item.done;
  li.appendChild(checkbox);

  // Create Edit Button and add to Listitem
  let btnEdit = document.createElement("i");
  btnEdit.setAttribute("class", "fas fa-edit edit-icon");
  btnEdit.dataset.id = dataItemGetId(item);
  btnEdit.addEventListener("click", listItemEdit);
  li.appendChild(btnEdit);

  // Create Delete Button and add to Listitem
  let btnDelete = document.createElement("i");
  btnDelete.setAttribute("class", "fas fa-trash delete-icon");
  btnDelete.dataset.id = dataItemGetId(item);
  btnDelete.addEventListener("click", listItemDelete);
  li.appendChild(btnDelete);

  if (item.due && !item.done) {
    let days = document.createElement("div");
    days.textContent = Math.floor((Date.now() - item.dueDate) / 86400);
    days.setAttribute("class", "due");
    li.appendChild(days);
  }

  return li;
}

function updateTodoListHTML() {
  let listitems = localStorageLoad();
  const todolist = document.getElementById("todolist");

  todolist.innerHTML = "";

  listitems = listitems.map((item) => {
    if (Date.now() < item.dueDate) {
      item.due = false;
    } else {
      item.due = true;
    }
    todolist.appendChild(createListitemHTML(item));
    return item;
  });

  localStorageUpdate(listitems);
}
