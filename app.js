const todo__input = document.querySelector(".todo__input")
const add__btn = document.querySelector(".add__btn")
const item__sector = document.querySelector(".item__sector")
const item__status = document.querySelector(".item__status")
let edit__index = -1

function createToDoItem(toDoItem) {
  const position = "beforeend"
  const item = `
    <div class="item">
      <input type="checkbox" class="done__btn">
      <input type="text" class="item__content" value="${toDoItem}" disabled>
      <button class="edit__btn"><i class="far fa-edit"></i></button>
      <button class="delete__btn"><i class="far fa-trash-alt"></i></button>
    </div>
  `
  item__sector.insertAdjacentHTML(position, item)
  return item__sector
}

// add item to the item sector
add__btn.addEventListener("click", e => {
  e.preventDefault()
  const input__value = todo__input.value
  if (input__value) {
    createToDoItem(input__value)
    saveLocalStorage(input__value)
    todo__input.value = ""
  }
})

// keypress Enter
document.addEventListener("keypress", e => {
  if (e.keyCode == 13) {
    e.preventDefault()
    const input__value = todo__input.value
    if (input__value) {
      createToDoItem(input__value)
      saveLocalStorage(input__value)
      todo__input.value = ""
    }
  }
})

// load todo item from localstorage when page is loaded
document.addEventListener("DOMContentLoaded", getLocalStorage)

// the function on item (done, edit, and delete)
item__sector.addEventListener("click", e => {
  const parent = e.target.parentElement

  // done
  if (e.target.classList.contains("done__btn")) {
    e.target.nextElementSibling.classList.toggle("done")
    e.target.parentElement.classList.toggle("finish")
  }
  // edit the todo item 
  if (e.target.classList.contains("edit__btn")) {
    if (e.target.previousElementSibling.disabled.disabled == true) {
      e.target.previousElementSibling.disabled = !e.target.previousElementSibling.disabled
    } else {
      const todos = checkLocalStorage()
      if (edit__index === -1) {
        const valueBeforeEdit = e.target.previousElementSibling.getAttribute("value")
        edit__index = todos.indexOf(valueBeforeEdit)
        console.log(edit__index)
      } else {
        const valueAfterEdit = e.target.previousElementSibling.value
        editLocalStorage(edit__index, valueAfterEdit)
        console.log(edit__index)
        edit__index = -1
      }
      e.target.previousElementSibling.disabled = !e.target.previousElementSibling.disabled
      e.target.previousElementSibling.setAttribute("value", e.target.previousElementSibling.value)
    }
  }
  // delete todo item
  if (e.target.classList.contains("delete__btn")) {
    parent.remove()
    deleteLocalStorage(e.target.previousElementSibling.previousElementSibling)
  }
})

// function for check todo status in the LocalStorage
function checkLocalStorage() {
  let todos
  if (localStorage.getItem("todos") === null) {
    todos = []
  } else {
    todos = JSON.parse(localStorage.getItem("todos"))
  }
  return todos
}

// function for save localstorage
function saveLocalStorage(todo) {
  const todos = checkLocalStorage()
  todos.push(todo)
  localStorage.setItem("todos", JSON.stringify(todos))
}

// function for get item and render to the screen from localstorage
function getLocalStorage() {
  const todos = checkLocalStorage()
  todos.forEach(todo => {
    createToDoItem(todo)
  })
}

// edit localStorage 
function editLocalStorage(editIndex, editValue) {
  const todos = checkLocalStorage()
  todos.splice(editIndex, 1, editValue)
  localStorage.setItem("todos", JSON.stringify(todos))
}

// delete item from LocalStorage
function deleteLocalStorage(todo) {
  const todos = checkLocalStorage()
  const todoIndex = todo.getAttribute("value")
  todos.splice(todos.indexOf(todoIndex), 1)
  localStorage.setItem("todos", JSON.stringify(todos))
}

// filter function
item__status.addEventListener("click", e => {
  let items = Array.from(item__sector.children)
  items.forEach(item => {
    switch (e.target.className) {
      case "all":
        item.style.display = "block"
        break
      case "completed":
        if (item.classList.contains("finish")) {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
        break
      case "incompleted":
        if (!item.classList.contains("finish")) {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
        break
    }
  })
})

