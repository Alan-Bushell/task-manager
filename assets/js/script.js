// wait for page to load
document.addEventListener('DOMContentLoaded', loadTasks);

// element selectors
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const dueDateInput = document.getElementById('dueDateInput');
const taskList = document.getElementById('taskList');

// event listener for adding task from enter key
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// add task
function addTask() {
    const taskText = taskInput.value.trim();
    const isPriority = priorityInput.checked;
    const dueDate = dueDateInput.value;

    if (taskText) {
        const task = { text: taskText, priority: isPriority, completed: false, dueDate: dueDate };
        saveTask(task);
        taskInput.value = '';
        priorityInput.checked = false;
        dueDateInput.value = '';
        loadTasks();
    }
}

function saveTask(task) {
    let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    tasks.push(task);
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDueDate(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const remTime = due - now;
    const remDays = Math.ceil(remTime / (1000 * 60 * 60 * 24));

    if (remDays < 30 && diffDays >= 0) {
        return `${remDays} days remaining`;
    } else if (remDays < 0) {
        return 'Overdue';
    } else {
        const day = String(due.getDate()).padStart(2, '0');
        const month = String(due.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const hours = String(due.getHours()).padStart(2, '0');
        const minutes = String(due.getMinutes()).padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
    }
}

function loadTasks() {
    taskList.innerHTML = '';
    let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const textColor = task.priority ? 'style="color: blue;"' : '';
        const dueDateText = task.dueDate ? formatDueDate(task.dueDate) : '';

        li.innerHTML = `
            <span ${textColor}>${task.text}</span> 
            ${dueDateText ? `<span> (Due: ${dueDateText})</span>` : ''}
            <div>
                <button onclick="toggleComplete(${index})"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                <button onclick="removeTask(${index})"><i class="fas fa-times"></i></button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    let tasks = JSON.parse(sessionStorage.getItem('tasks'));
    tasks[index].completed = !tasks[index].completed;
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function removeTask(index) {
    let tasks = JSON.parse(sessionStorage.getItem('tasks'));
    tasks.splice(index, 1);
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}
