chrome.alarms.create('pomodoroTimer', {
    periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
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

    if (alarm.name === 'pomodoroTimer') {
        chrome.storage.local.get(
            ['timer', 'isRunning', 'isPause', 'cycleNumber'],
            (res) => {
                let isPause = res.isPause;
                let cycleNumber = res.cycleNumber;
                let timeLimit = workingTime;

                if (isPause) {
                    timeLimit = pauseTime;
                    if (cycleNumber === cycleLimit - 1) {
                        timeLimit = longPauseTime;
                    }
                }

                const seconds = `${60 - (res.timer % 60)}`.padStart(2, '0');
                const minutes = `${Math.floor(
                    timeLimit - res.timer / 60
                )}`.padStart(2, '0');

                chrome.action.setBadgeText({
                    text: `${minutes}:${seconds === '60' ? '00' : seconds}`,
                });

                if (res.isRunning) {
                    let timer = res.timer + 1;
                    console.log(timer);

                    if (timer === 60 * timeLimit) {
                        isPause = !isPause;

                        this.registration.showNotification(
                            'Pomodoro notification',
                            {
                                body: isPause
                                    ? cycleNumber === cycleLimit - 1
                                        ? 'Long'
                                        : 'Short' + ' pause!'
                                    : 'Go to work!',
                                icon: 'icon.png',
                            }
                        );

                        timer = 0;

                        if (!isPause) {
                            cycleNumber = cycleNumber + 1;
                        }
                        if (cycleNumber === cycleLimit) {
                            cycleNumber = 0;
                        }
                    }
                    chrome.storage.local.set({
                        timer: timer,
                        isPause: isPause,
                        cycleNumber: cycleNumber,
                    });
                }
            }
        );
    }
});

chrome.storage.local.get(
    ['timer', 'isRunning', 'isPause', 'cycleNumber'],
    (res) => {
        chrome.storage.local.set({
            timer: 'timer' in res ? res.timer : 0,
            isRunning: 'isRunning' in res ? res.isRunning : false,
            isPause: 'isPause' in res ? res.isPause : false,
            cycleNumber: 'cycleNumber' in res ? res.cycleNumber : 0,
        });
    }
);
