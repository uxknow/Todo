// const input = document.querySelector('input');
// const butttonAdd = document.querySelector('.todo__add-button');

// let taskContainer = document.querySelector('.result');

// const $ = document.querySelector.bind(document);

// const tasks = {
//     all: [],
//     pending: [],
//     completed: [],
//     deleted: [],
// }


// butttonAdd.disabled = true;

// function renderTasks(data) {
//     taskContainer.textContent = '';
//     const ul = document.createElement('ul');
//     ul.className = 'tasks-list';

//     data.forEach((task, idx) => {
//         ul.innerHTML += `
//         <li class="tasks-item">
//             <div>
//                 <input id="check${idx}" onchange=completeTask(${idx}) class="checkbox-custom" type="checkbox">
//                 <label for="check${idx}">
//                 <span>${task}</span>
//                 </label>
//             </div>
//             <div class="icons-container">
//                 <i class="edit fa-regular fa-pen-to-square"></i>
//                 <i onclick=deleteTask(${idx}) class="basket fa-regular fa-trash-can"></i>
//             </div>
//         </li>
//         `
//     })

//     taskContainer.append(ul);
// }

// function disabledButton() {
//     if(input.value) {
//         butttonAdd.disabled = false;
//     } else {
//         butttonAdd.disabled = true;
//     }
// }
// input.addEventListener('input', disabledButton);

// function addToTaskList() {
//     tasks.all.push(input.value);
//     renderTasks(tasks.all.concat(tasks.deleted, tasks.pending, tasks.completed));
//     butttonAdd.disabled = true;
//     input.value = '';
// }

// butttonAdd.addEventListener('click', addToTaskList)

// //Выполненые задачи из списка
// function completeTask(idx) {
//     if(this) {
//         tasks.completed.push(tasks.all.splice(idx,1));
//         renderTasks(tasks.all);
//     }
// }

// //Удаление задачи из списка
// function deleteTask(idx) {
//     if (this) { 
//         console.log(tasks.all[idx])
//         tasks.deleted.push(tasks.all.splice(idx, 1));
//         renderTasks(tasks.all);
//     }
// }

// //Активная категория todo
// const tabContainer = document.querySelector('.todo__category-list');

// function clickHandlerActiveTab(e) {
//    const tabList = document.querySelectorAll('.category__list-item');
//    const click = e.target.closest('.category__list-item');

//    if (click) {
//     const activeCategory = click.textContent.toLowerCase();

//     for(let tab of tabList) {
//         tab.classList.remove('active');
//     }
//     click.classList.add('active');
//     renderTasks(tasks[activeCategory])

//    if(activeCategory === 'deleted' && tasks.deleted.length) {
//        document.querySelectorAll('.basket').forEach(item => item.classList.add('no-active'));
//     } 

//     if(activeCategory === 'completed' && tasks.completed.length) {
//         document.querySelectorAll('span').forEach(item => item.classList.add('delete'));
//     }

//     if(activeCategory === 'all') {
//         renderTasks(tasks.all.concat(tasks.deleted, tasks.pending, tasks.completed));
//     }

// }
// }
// tabContainer.addEventListener('click', clickHandlerActiveTab)











//initial data
const taskInput = document.querySelector('input');
const clearBtn = document.querySelector('.todo__add-button');

const taskContainer = document.querySelector('.result');

const tabContainer = document.querySelector('.todo__category-list');


//get localstorage todo-list
let todoTasks = JSON.parse(localStorage.getItem('todo-list'));

//variables for editTask
let editTaskId;
let isEditedTask = false;

//change active category
function clickHandlerActiveTab(e) {
    const click = e.target.closest('.category__list-item');

    if(click) {
        document.querySelector('li.active').classList.remove('active');
        click.classList.add('active');

        const activeCategory = click.textContent.toLowerCase();
        renderTodo(activeCategory)
    }
}
tabContainer.addEventListener('click', clickHandlerActiveTab)

//render todolist
function renderTodo(filter) {
    taskContainer.textContent = '';
    const ul = document.createElement('ul');
    ul.className = 'tasks-list';
    let li = '';

    if(todoTasks) {
    todoTasks.forEach((task, idx) => {
        const isCompleted = task.status === "completed" ? "checked" : "";
        const isActiveTab = task.status === 'completed' ? 'completed' : 'pending' || 'all';

        if(filter === task.status || filter === 'all') 
        li += `
        <li class="tasks-item">
            <div class="checkbox-container">
                <input onchange = "updateStatus(this)" id="${idx}" ${isCompleted} class="checkbox-custom" type="checkbox">
                <label for="${idx}">
                    <span class="${isCompleted}">${task.name}</span>
                </label>
            </div>
            <div class="icons-container">
                <i onclick="editTask(${idx}, '${task.name}', '${isActiveTab}')" class="edit fa-regular fa-pen-to-square"></i>
                <i onclick="deleteTask(${idx}, '${isActiveTab}')" class="basket fa-regular fa-trash-can"></i>
            </div>
        </li>
        `
        })
    } 

    ul.innerHTML = li || `<span>You don't have any task here</span>`
    taskContainer.append(ul);
}
renderTodo('all')

//update status of task
function updateStatus(selectedTask) {
    //get name of Task-name
     const taskText = selectedTask.nextElementSibling.firstElementChild;
    if (selectedTask.checked) {
        taskText.classList.add('checked');
        //update status of selected task to completed
        todoTasks[selectedTask.id].status = 'completed';
    } else {
        taskText.classList.remove('checked');
        //update status of selected task to pending
        todoTasks[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('todo-list', JSON.stringify(todoTasks));
}

//delete current task
function deleteTask(id, filter) {
    todoTasks.splice(id, 1);
    localStorage.setItem('todo-list', JSON.stringify(todoTasks));
    renderTodo(filter);
} 

//change current task
function editTask(id, text, filter) {
    taskInput.value = text;

    isEditedTask = true;
    editTaskId = id;

    localStorage.setItem('todo-list', JSON.stringify(todoTasks));
    renderTodo(filter);
}

//Add task to array and localestorage
function addTask(e) {
    const userData = e.target.value.trim()
    if(e.keyCode === 13 && userData) {
        if (!isEditedTask)   {
            if(!todoTasks) { //if todoTasks isnt exist, pass an empty array to todoTasks
                todoTasks = [];
            }
            const newTask = {name: userData, status: 'pending'};
            todoTasks.push(newTask);
            } else {
                todoTasks[editTaskId].name = userData;
                isEditedTask = false;
            }
        taskInput.value = '';
    }
    
    localStorage.setItem('todo-list', JSON.stringify(todoTasks));
   
    renderTodo('all');
}

taskInput.addEventListener('keyup', addTask)

//Delete  all in todo array and localestorage
function clearAll() {
    taskContainer.innerHTML = '';
    todoTasks.length = 0;
    localStorage.clear();
}

clearBtn.addEventListener('click', clearAll)

