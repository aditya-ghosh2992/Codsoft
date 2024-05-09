// Digital Clock
function updateClock() {
    const now = new Date();
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const seconds = formatTime(now.getSeconds());

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    // Check if any alarm matches the current time
    const currentTime = `${hours}:${minutes}`;
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.forEach(alarm => {
        if (alarm.time === currentTime && !alarm.ringing) {
            ringAlarm(alarm.id);
        }
    });
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Alarm
document.getElementById('set-alarm').addEventListener('click', function() {
    const alarmTime = prompt('Enter the time for the alarm (HH:MM):');
    if (alarmTime) {
        const [hours, minutes] = alarmTime.split(':');
        const alarm = {
            id: Date.now(),
            time: alarmTime,
            ringing: false
        };
        addAlarmToList(alarm);
        saveAlarm(alarm);
    }
});

function addAlarmToList(alarm) {
    const alarmsList = document.getElementById('alarms');
    const li = document.createElement('li');
    li.className = 'alarm-item';
    li.innerHTML = `
        <span>${alarm.time}</span>
        <button onclick="deleteAlarm(${alarm.id})">Delete</button>
    `;
    alarmsList.appendChild(li);
}

function saveAlarm(alarm) {
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms.push(alarm);
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

function deleteAlarm(id) {
    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    alarms = alarms.filter(alarm => alarm.id !== id);
    localStorage.setItem('alarms', JSON.stringify(alarms));
    // Remove from DOM
    document.getElementById('alarms').innerHTML = '';
    alarms.forEach(alarm => addAlarmToList(alarm));
}

function ringAlarm(id) {
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    const alarmIndex = alarms.findIndex(alarm => alarm.id === id);
    if (alarmIndex !== -1) {
        alarms[alarmIndex].ringing = true;
        localStorage.setItem('alarms', JSON.stringify(alarms));
        document.getElementById('alarm-sound').play();
        setTimeout(() => {
            stopAlarm(id);
        }, 5000); // Ring for 5 seconds
    }
}

function stopAlarm(id) {
    const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    const alarmIndex = alarms.findIndex(alarm => alarm.id === id);
    if (alarmIndex !== -1) {
        alarms[alarmIndex].ringing = false;
        localStorage.setItem('alarms', JSON.stringify(alarms));
        document.getElementById('alarm-sound').pause();
        document.getElementById('alarm-sound').currentTime = 0;
    }
}
