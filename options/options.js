const workingTimeInput = document.getElementById('input-working-time');
const pauseTimeInput = document.getElementById('input-pause-time');
const longPauseTimeInput = document.getElementById('input-long-pause-time');
const cycleLimitInput = document.getElementById('input-cycle-limit');
const saveBtn = document.getElementById('save-btn');

workingTimeInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 60) {
        workingTimeInput.value = 20;
    }
});

pauseTimeInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 20) {
        pauseTimeInput.value = 5;
    }
});

longPauseTimeInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 40) {
        longPauseTimeInput.value = 20;
    }
});

cycleLimitInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 10) {
        cycleLimitInput.value = 4;
    }
});

saveBtn.addEventListener('click', () => {
    const workingTime = workingTimeInput.value;
    const pauseTime = pauseTimeInput.value;
    const longPauseTime = longPauseTimeInput.value;
    const cycleLimit = cycleLimitInput.value;

    chrome.storage.sync.set({
        workingTime: workingTime,
        pauseTime: pauseTime,
        longPauseTime: longPauseTime,
        cycleLimit: cycleLimit,
    });
    
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
        isPause: false,
        cycleNumber: 0,
    });
});

chrome.storage.sync.get(
    ['workingTime', 'pauseTime', 'longPauseTime', 'cycleLimit'],
    (res) => {
        workingTimeInput.value = res.workingTime ?? 25;
        pauseTimeInput.value = res.pauseTime ?? 5;
        longPauseTimeInput.value = res.longPauseTime ?? 20;
        cycleLimitInput.value = res.cycleLimit ?? 4;
    }
);
