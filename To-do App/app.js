document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const clearBtn = document.getElementById('clear-tasks');
    const toast = document.getElementById('toast');

    // Load tasks from local storage
    loadTasks();

    // Add task event
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            addTask(taskText);
            showToast('Task added successfully', 'success');
            // Clear input
            taskInput.value = '';
            // Save to local storage
            saveTask(taskText);
        } else {
            showToast('Please enter a task!', 'error');
        }
    });

    // Delete task event
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const taskItem = e.target.parentElement;
            const checkBox = taskItem.querySelector('.checkbox');
            if (checkBox.checked) {
                showToast('Task already done. Cannot delete!', 'error');
            } else {
                if (confirm('Are you sure you want to delete this task?')) {
                    taskItem.remove();
                    showToast('Task deleted successfully', 'success');
                    // Remove from local storage
                    removeTask(taskItem);
                }
            }
        }
    });

    // Mark task as done event
    taskList.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const taskItem = e.target.parentElement;
            taskItem.classList.toggle('done');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            if (e.target.checked) {
                deleteBtn.disabled = true;
            } else {
                deleteBtn.disabled = false;
            }
            showToast('Task marked as done', 'info');
        }
    });

    // Clear tasks event
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            taskList.innerHTML = '';
            showToast('All tasks cleared', 'success');
            // Clear local storage
            localStorage.clear();
        }
    });

    // Function to add a task
    function addTask(taskText) {
        const li = document.createElement('li');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.className = 'checkbox';
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        li.appendChild(checkBox);
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Function to save task to local storage
    function saveTask(taskText) {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.forEach(function(task) {
            addTask(task);
        });
    }

    // Function to remove task from local storage
    function removeTask(taskItem) {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        const taskIndex = Array.from(taskList.children).indexOf(taskItem);
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to show toast messages
    function showToast(message, type) {
        toast.textContent = message;
        toast.style.backgroundColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#333';
        toast.style.display = 'block';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
    }
});
