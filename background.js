chrome.alarms.create('pomodoroTimer', {
    periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
    let workingTime = 25;
    let pauseTime = 5;

    chrome.storage.sync.get(['workingTime', 'pauseTime'], (res) => {
        workingTime = res.workingTime;
        pauseTime = res.pauseTime;
    });

    if (alarm.name === 'pomodoroTimer') {
        chrome.storage.local.get(['timer', 'isRunning'], (res) => {
            const seconds = `${60 - (res.timer % 60)}`.padStart(2, '0');
            const minutes = `${Math.floor(
                workingTime - res.timer / 60
            )}`.padStart(2, '0');

            chrome.action.setBadgeText({
                text: `${minutes}:${seconds === '60' ? '00' : seconds}`,
            });

            if (res.isRunning) {
                let timer = res.timer + 1;
                let isRunning = true;
                console.log(timer);
                if (timer === 60 * workingTime) {
                    this.registration.showNotification(
                        'Pomodoro notification',
                        {
                            body: `${workingTime} minutes passed`,
                            icon: 'icon.png',
                        }
                    );
                    timer = 0;
                    isRunning = false;
                }
                chrome.storage.local.set({ timer, isRunning });
            }
        });
    }
});

chrome.storage.local.get(['timer', 'isRunning'], (res) => {
    chrome.storage.local.set({
        timer: 'timer' in res ? res.timer : 0,
        isRunning: 'isRunning' in res ? res.isRunning : false,
    });
});
