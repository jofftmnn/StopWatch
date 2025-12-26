let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

let laps = [];
let lastLapElapsed = 0;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");
const lapsList = document.getElementById("laps");

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(milliseconds).padStart(3,"0")}`;
}

function updateDisplay() {
    const current = elapsedTime + (isRunning ? Date.now() - startTime : 0);
    display.textContent = formatTime(current);
}

function renderLaps() {
    lapsList.innerHTML = "";
    clearLapsBtn.disabled = laps.length === 0;

    laps.forEach(lap => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="lap-number">Lap ${lap.number}</span>
            <span class="lap-time">${formatTime(lap.time)}</span>
        `;
        lapsList.appendChild(li);
    });
}

startBtn.addEventListener("click", () => {
    if (!isRunning) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 10);
        isRunning = true;

        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
        resetBtn.disabled = true;
    }
});

stopBtn.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        isRunning = false;

        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true;
        resetBtn.disabled = false;
        updateDisplay();
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    startTime = 0;
    laps = [];
    lastLapElapsed = 0;

    display.textContent = "00:00:00.000";

    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    clearLapsBtn.disabled = true;
    renderLaps();
});

lapBtn.addEventListener("click", () => {
    if (!isRunning) return;

    const currentElapsed = elapsedTime + (Date.now() - startTime);
    const lapTime = currentElapsed - lastLapElapsed;
    lastLapElapsed = currentElapsed;

    laps.unshift({
        number: laps.length + 1,
        time: lapTime
    });

    renderLaps();
});

clearLapsBtn.addEventListener("click", () => {
    laps = [];
    lastLapElapsed = elapsedTime;
    renderLaps();
});