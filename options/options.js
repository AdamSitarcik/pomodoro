const workingTimeInput = document.getElementById('input-working-time');
const pauseTimeInput = document.getElementById('input-pause-time');
const saveBtn = document.getElementById('save-btn');

workingTimeInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 60) {
        workingTimeInput.value = 25;
    }
});

pauseTimeInput.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value < 1 || value > 30) {
        pauseTimeInput.value = 5;
    }
});

saveBtn.addEventListener('click', () => {
    const workingTime = workingTimeInput.value;
    const pauseTime = pauseTimeInput.value;

    chrome.storage.sync.set({ workingTime: workingTime, pauseTime: pauseTime });
    chrome.storage.local.set({ timer: 0, isRunning: false });
});

chrome.storage.sync.get(['workingTime', 'pauseTime'], (res) => {
    workingTimeInput.value = res.workingTime ?? 25;
    pauseTimeInput.value = res.pauseTime ?? 5;
});
