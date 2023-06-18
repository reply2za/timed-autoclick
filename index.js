const robot = require('robotjs');


// Set the timeout (in milliseconds)
let programTimeout = 60 * 60 * 1000;

setTimeout(() => {
    console.log("Timeout reached. Exiting...");
    process.exit();
}, programTimeout);

let lastPosition = undefined;

function endIfMouseMoved() {
    if (lastPosition && lastPosition.x !== robot.getMousePos().x && lastPosition.y !== robot.getMousePos().y) {
        console.log("Mouse moved. Exiting...");
        process.exit();
    }
}
async function clickAtIntervals(locations, intervals) {
    let locationIndex = 0;
    let location = locations[locationIndex];
    while (true) {
        // if the user moved the mouse, stop the program
        await new Promise(resolve => setTimeout(resolve, location.beforeMove * 1000));
        endIfMouseMoved();
        const xLocation = location.x + Math.random() * 5;
        const yLocation = location.y + Math.random() * 5;
        robot.moveMouseSmooth(xLocation, yLocation, Math.random() * 2 + .02);
        lastPosition = robot.getMousePos();
        await new Promise(resolve => setTimeout(resolve, location.beforeClick * 1000));
        endIfMouseMoved();
        robot.mouseClick();
        locationIndex = ++locationIndex % locations.length;
        location = locations[locationIndex];
        lastPosition = robot.getMousePos();
    }
}

function getMousePosition() {
    let mouse = robot.getMousePos();
    console.log(`{x: ${mouse.x}, y: ${mouse.y}, beforeMove: 0, beforeClick: 3}`);
}

function runProgram(waitBeforeExecution, debug, locations) {
    if (debug) {
        console.log('Running in debug mode. Mouse position will be logged every few seconds.');
        setInterval(getMousePosition, 2000);
    } else {
        if (waitBeforeExecution) {
            console.log(`Waiting ${waitBeforeExecution} seconds before starting...`);
            setTimeout(() => {
                console.log('Starting...');
                clickAtIntervals(locations);
            }, waitBeforeExecution * 1000);
        } else clickAtIntervals(locations);
    }
}


// ---- customize below code ----

// set to true if you need to print your mouse position
const CHANGE_INTERVALS = false;
// time to wait (in seconds) before starting the program
const WAIT_BEFORE_START = 0;
// Each location is represented as {x, y}.
// beforeMove is the time (in seconds) to wait before moving the mouse to this location.
// beforeClick is the time (in seconds) to wait before clicking the mouse at this location.
const locations = [
    {x: 415, y: 341, beforeMove: 0, beforeClick: 1},
    {x: 584, y: 347, beforeMove: 0, beforeClick: 1},
    {x: 525, y: 541, beforeMove: 0, beforeClick: 1},
    {x: 295, y: 536, beforeMove: 0, beforeClick: 1}
];

runProgram(WAIT_BEFORE_START, CHANGE_INTERVALS, locations);
