// Todo Item Object
class TodoItem {
  #creationDate;
  #dueDate;
  #content;
  #state;
  #due;
  constructor(text, deadline) {
    this.creationDate = Date.now();
    this.dueDate = this.creationDate + deadline * 86400; // Seconds per day
    this.content = text;
    this.finish = true; // open, done
    this.due = false;
  }
}

function itemRead(item) {
  return item.content;
}

function itemUpdate(item, text) {
  item.content = text;
}

function itemDelete(item, sender) {
  alert("<b>ToDo !!!</b><br /> Delete from Local Storage <br />" + sender);
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
    let li = document.createElement("li");

    li.innerHTML = itemRead(item);
    todolist.appendChild(li);
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
