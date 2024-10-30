let taskList = document.getElementById('task-list');
let addTaskForm = document.getElementById('add-task-form');
let taskInput = document.getElementById('task-input');

// Initialize tasks array from localStorage or empty array if nothing stored
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load tasks when page loads
window.addEventListener('load', () => {
    showTaskList();
});

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let taskText = taskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        taskInput.value = '';
    }
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(taskText, completed = false) {
    let task = {
        id: Date.now(), // Add unique id for each task
        text: taskText,
        completed: completed
    };
    tasks.push(task);
    showTaskList();
    saveTasks();
}

function showTaskList() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        let taskItem = document.createElement('li');
        taskItem.className = 'task';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);

        // Complete button
        taskItem.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            taskItem.classList.toggle('completed');
            saveTasks();
        });

        // Edit button
        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            let editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = task.text;
            taskItem.innerHTML = '';
            taskItem.appendChild(editInput);
            
            let saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            taskItem.appendChild(saveBtn);
            
            editInput.focus();
            
            saveBtn.addEventListener('click', () => {
                saveEdit();
            });
            
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
            
            function saveEdit() {
                let newTaskText = editInput.value.trim();
                if (newTaskText) {
                    task.text = newTaskText;
                    showTaskList(); // Refresh the entire list
                    saveTasks();
                }
            }
            
            taskItem.classList.add('editing');
        });

        // Delete button
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            let index = tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks.splice(index, 1);
                showTaskList(); // Refresh the entire list
                saveTasks();
            }
        });
    });
}

// Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    showTaskList();
    saveTasks();
}

// Get all tasks
function getAllTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Clear all tasks
function clearAllTasks() {
    localStorage.removeItem('tasks');
    tasks = [];
    showTaskList();
}