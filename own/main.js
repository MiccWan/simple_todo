/**
 * global state setup
 */
const todoListStorageKey = 'todo-list.todoItems';
let todoItems = JSON.parse(localStorage.getItem(todoListStorageKey)) || [];
let state;
const FilterStates = {
  All: 0,
  Active: 1,
  Completed: 2
}

/**
 * DOMs
 */
const inputDOM = document.getElementById('todo-input');
const buttonsDOM = [];

for (const key in FilterStates) {
  const ulDOM = document.querySelector('#todo-footer > ul');
  const newNode = compileHTML(`
    <button onclick="setFilter(FilterStates.${key})">${key.toLowerCase()}</button>
  `);
  ulDOM.appendChild(newNode);
  buttonsDOM[FilterStates[key]] = newNode;
}

/**
 * initialize
 */
setFilter(FilterStates.All);

/**
 * Model/Controller
 */
inputDOM.addEventListener('keyup', e => {
  if (isEnter(e) && e.target.value !== '') {
    todoItems.push({
      message: e.target.value,
      isCompleted: false
    });

    e.target.value = '';
    refresh();
  }
});

function removeItem(i) {
  todoItems.splice(i, 1);
  refresh();
}

function clearCompleted() {
  todoItems = todoItems.filter(item => !item.isCompleted);
  refresh();
}

function itemCheck(i) {
  todoItems[i].isCompleted = !todoItems[i].isCompleted;
  refresh();
}

function setFilter(s, t) {
  if (state !== s) {
    state = s;

    for (const buttonDOM of buttonsDOM) {
      buttonDOM.classList.remove('active');
    }

    buttonsDOM[s].classList.add('active');

    refresh();
  }
}

/**
 * View
 */
function refresh() {
  const listDOM = document.getElementById('todo-list');
  listDOM.textContent = '';
  for (let i = 0; i < todoItems.length; i++) {
    const item = todoItems[i];
    if (isFiltered(item)) {
      continue;
    }

    const newNode = compileHTML(`
      <li class="todo-app__item">
        <div class="todo-app__checkbox">
          <input type="checkbox" id="item-${i}" ${item.isCompleted ? 'checked' : ''}>
          <label for="item-${i}" onclick="itemCheck(${i})">
        </div>
        <h1 class="todo-app__item-detail">${item.message}</h1>
        <img src="./img/x.png" class="todo-app__item-x" onclick="removeItem(${i})">
      </li>
    `);

    if (item.isCompleted) {
      newNode.style["textDecoration"] = "line-through";
      newNode.style["opacity"] = 0.5;
    }

    listDOM.appendChild(newNode);
  }

  updateCount();
  localStorage.setItem(todoListStorageKey, JSON.stringify(todoItems));
}

function updateCount() {
  const countDOM = document.getElementById("todo-count");
  const count = todoItems.filter(item => !item.isCompleted).length;
  countDOM.innerHTML = `${count} left`;
}

function isFiltered(item) {
  switch (state) {
    case FilterStates.All:
      return false;
    case FilterStates.Active:
      return item.isCompleted;
    case FilterStates.Completed:
      return !item.isCompleted;
  }
}

/**
 * Utils
 */

function compileHTML(str) {
  const div = document.createElement('div');
  div.innerHTML = str.trim();

  return div.firstChild;
}

function isEnter(e) {
  if (e.key === 'Enter') {
    return true;
  }
  else if (e.keyCode === 13) {
    return true;
  }
  return false;
}