let tasks = [];

let workingTime, pauseTime, longPauseTime, cycleLimit;
chrome.storage.sync.get(
    ['workingTime', 'pauseTime', 'longPauseTime', 'cycleLimit'],
    (res) => {
        workingTime = res.workingTime ? res.workingTime : 25;
        pauseTime = res.pauseTime ? res.pauseTime : 5;
        longPauseTime = res.longPauseTime ? res.longPauseTime : 20;
        cycleLimit = res.cycleLimit ? res.cycleLimit : 4;
    }
);

const updateTime = () => {
    chrome.storage.local.get(['timer', 'isPause', 'cycleNumber'], (res) => {
        let timeLimit = workingTime;

        if (res.isPause) {
            timeLimit = pauseTime;
            if (res.cycleNumber === cycleLimit - 1) {
                timeLimit = longPauseTime;
            }
        }

        const time = document.getElementById('time');
        const minutes = `${Math.floor(timeLimit - res.timer / 60)}`.padStart(
            2,
            '0'
        );
        const seconds = `${60 - (res.timer % 60)}`.padStart(2, '0');

        const infoElement = document.getElementById('info');
        const cycleInfoElement = document.getElementById('cycle-info');

        infoElement.textContent = res.isPause ? 'Pause' : 'Work';
        time.textContent = `${minutes}:${seconds === '60' ? '00' : seconds}`;

        cycleInfoElement.textContent = `This is cycle # ${
            res.cycleNumber + 1
        }/${cycleLimit}.`;

        chrome.action.setBadgeText({
            text: `${minutes}:${seconds === '60' ? '00' : seconds}`,
        });
    });
};

updateTime();
setInterval(updateTime, 1000);

const toggleTimerBtn = document.getElementById('toggle-timer-btn');
toggleTimerBtn.addEventListener('click', () => {
    chrome.storage.local.get(['isRunning'], (res) => {
        chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
            toggleTimerBtn.textContent = !res.isRunning ? 'Pause' : 'Start';
        });
    });
});

const resetTimerBtn = document.getElementById('reset-timer-btn');
resetTimerBtn.addEventListener('click', () => {
    chrome.storage.local.set(
        {
            timer: 0,
            isRunning: false,
            isPause: false,
            cycleNumber: 0,
        },
        () => {
            toggleTimerBtn.textContent = 'Start';
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
    deleteBtn.classList.add('delete-btn');
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
