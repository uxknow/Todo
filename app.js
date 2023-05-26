const taskInput = document.querySelector(".form__input");
const addBtn = document.querySelector(".todo_add-btn");
const clearBtn = document.querySelector(".todo_clear-btn");
const todoForm = document.querySelector(".todo__form");
const tabsContainer = document.querySelector(".todo__category-list");
let taskList = document.querySelector(".result");

//get localstorage todo-list
let todoTasks = JSON.parse(localStorage.getItem("todo-list")) || [];

addBtn.disabled = true;
let isEditedTask = false;
let isEditId;

//submit new task
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
  addBtn.disabled = true;
});

//change disabled on button
taskInput.addEventListener("input", () => {
  addBtn.disabled = !taskInput.value;
});

//Function  to set active tab
const activeTabHandler = (e) => {
  const click = e.target.closest("li");

  if (!click) {
    return;
  }

  document.querySelector("li.active").classList.remove("active");
  click.classList.add("active");

  renderTasks();
};
tabsContainer.addEventListener("click", activeTabHandler);

//Funcrion to render tasks
const renderTasks = () => {
  taskList.innerHTML = "";

  let li = "";

  const filteredTasks = filterTasks() || [];

  filteredTasks.map((task) => {
    const isCompleted = task.status === "completed" ? "checked" : "";
    const isDeleted = task.status === "deleted" ? "checked" : "";
    const deletedColor = task.status === "deleted" ? "deleted" : "";

    li += `
    <li class="task-item">
            <div class="checkbox-container">
                <input onchange = toggleChecked(this) id=${task.id} ${
      isCompleted || isDeleted
    }  class="checkbox-custom" type="checkbox">
                <label for=${task.id}>
                    <span class=${isCompleted || deletedColor}>${
      task.text
    }</span>
                </label>
            </div>
            <div class="icons-container">
                  <i
                    onclick="editTask(${task.id})"
                    class="edit fa-regular fa-pen-to-square"
                  ></i>

                <i onclick="deleteTask(${task.id})"
                } class="basket fa-regular fa-trash-can"></i>
            </div>
    </li>
  `;
  });

  taskList.innerHTML = li || `<span>You don't have any task here</span>`;

  updateTabAmount();
};

//Function to filter tasks on the selected tab
const filterTasks = () => {
  const selectedTask = document.querySelector("li.active");

  if (selectedTask.textContent.toLowerCase().includes("all")) {
    return todoTasks;
  } else if (selectedTask.textContent.toLowerCase().includes("pending")) {
    return todoTasks.filter((task) => task.status === "pending");
  } else if (selectedTask.textContent.toLowerCase().includes("completed")) {
    return todoTasks.filter((task) => task.status === "completed");
  } else {
    return todoTasks.filter((task) => task.status === "deleted");
  }
};

//Function to update amount tasks to tab
const updateTabAmount = () => {
  const tabItems = document.querySelectorAll(".category__list-item");

  for (let tab of tabItems) {
    if (tab.textContent.toLowerCase().includes("all")) {
      tab.innerHTML = `All <span>(${todoTasks.length})</span>`;
    } else if (tab.textContent.toLowerCase().includes("pending")) {
      tab.innerHTML = `Pending <span>(${
        todoTasks.filter((task) => task.status === "pending").length
      })</span>`;
    } else if (tab.textContent.toLowerCase().includes("completed")) {
      tab.innerHTML = `Completed <span>(${
        todoTasks.filter((task) => task.status === "completed").length
      })</span>`;
    } else {
      tab.innerHTML = `Deleted <span>(${
        todoTasks.filter((task) => task.status === "deleted").length
      })</span>`;
    }
  }
};

//Function to add new task
const addTask = () => {
  const taskText = taskInput.value;

  if (!taskText) {
    return;
  }

  if (!isEditedTask) {
    const task = {
      id: Date.now(),
      text: taskText,
      status: "pending",
      isDeleted: false,
    };

    todoTasks.push(task);
  } else {
    todoTasks[isEditId].text = taskText;
    isEditedTask = false;
  }

  taskInput.value = "";
  renderTasks();

  localStorage.setItem("todo-list", JSON.stringify(todoTasks));
};

//Function  to toggle completed/pending task
const toggleChecked = (selectedTask) => {
  const task = todoTasks.find((task) => task.id === +selectedTask.id);
  const index = todoTasks.findIndex((task) => task.id === +selectedTask.id);

  if (selectedTask.checked) {
    todoTasks[index] = { ...task, status: "completed", isDeleted: false };
  } else {
    todoTasks[index] = { ...task, status: "pending", isDeleted: false };
  }
  renderTasks();

  localStorage.setItem("todo-list", JSON.stringify(todoTasks));
};

//Function to delete task
const deleteTask = (id) => {
  const task = todoTasks.find((task) => task.id === id);
  const index = todoTasks.findIndex((task) => task.id === id);

  if (id && !todoTasks[index].isDeleted) {
    todoTasks[index] = { ...task, status: "deleted", isDeleted: true };
  } else if (id && todoTasks[index].isDeleted) {
    todoTasks = todoTasks.filter((el) => el.id !== task.id);
  }

  renderTasks();

  localStorage.setItem("todo-list", JSON.stringify(todoTasks));
};

//Function to edit task
const editTask = (id) => {
  const task = todoTasks.find((task) => task.id === id);
  const index = todoTasks.findIndex((task) => task.id === id);

  taskInput.value = task.text;
  isEditedTask = true;
  isEditId = index;
};

//Clear localeStorage
const clearTodoList = () => {
  localStorage.clear();
  todoTasks.length = 0;
  renderTasks();
};
clearBtn.addEventListener("click", clearTodoList);

renderTasks();
