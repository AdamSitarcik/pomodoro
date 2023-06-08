let tasks = [];

const config = {
    work_time: 15,
};

const updateTime = () => {
    chrome.storage.local.get(['timer'], (res) => {
        const time = document.getElementById('time');
        const minutes = `${Math.floor(
            config.work_time - res.timer / 60
        )}`.padStart(2, '0');
        const seconds = `${60 - (res.timer % 60)}`.padStart(2, '0');
        time.textContent = `${minutes}:${seconds === '60' ? '00' : seconds}`;

        chrome.action.setBadgeText({
            text: `${minutes}:${seconds === '60' ? '00' : seconds}`,
        });
    });
};

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById('start-timer-btn');
startTimerBtn.addEventListener('click', () => {
    chrome.storage.local.get(['isRunning'], (res) => {
        chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
            startTimerBtn.textContent = !res.isRunning ? 'Pause' : 'Start';
        });
    });
});

const resetTimerBtn = document.getElementById('reset-timer-btn');
resetTimerBtn.addEventListener('click', () => {
    chrome.storage.local.set(
        {
            timer: 0,
            isRunning: false,
        },
        () => {
            startTimerBtn.textContent = 'Start';
            updateTime();
        }
    );
});

const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', () => addTask());

chrome.storage.sync.get(['tasks'], (res) => {
    tasks = res.tasks ?? [];
    renderTasks();
});

const saveTasks = () => {
    chrome.storage.sync.set({
        tasks: tasks,
    });
};

const renderTask = (taskNum) => {
    const taskRow = document.createElement('div');

    const text = document.createElement('input');
    text.type = 'text';
    text.placeholder = 'Enter a task...';
    text.value = tasks[taskNum];

    text.addEventListener('change', () => {
        tasks[taskNum] = text.value;
        saveTasks();
    });

    const deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.value = 'X';
    deleteBtn.addEventListener('click', () => {
        deleteTask(taskNum);
    });

    taskRow.appendChild(text);
    taskRow.appendChild(deleteBtn);

    const taskContainer = document.getElementById('task-container');
    taskContainer.appendChild(taskRow);
};

const addTask = () => {
    const taskNum = tasks.length;
    tasks.push('');
    renderTask(taskNum);
    saveTasks();
};

const deleteTask = (taskNum) => {
    tasks.splice(taskNum, 1);
    renderTasks();
    saveTasks();
};

const renderTasks = () => {
    const taskContainer = document.getElementById('task-container');
    taskContainer.textContent = '';
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum);
    });
};
