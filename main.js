const audio = document.createElement('audio');
const guns = document.getElementsByClassName('gun')
const levels = document.getElementsByClassName('level')
let chosenGun = 0;
let chosenLevel = 0;
let point = 0;
let pointsArr = []
const finishingLine = document.getElementById('finishingLine');
const targetsContainer = document.getElementById('targetsContainer');
const pointSpan = document.getElementById('point');
pointSpan.innerText = point;
const highestSpan = document.getElementById('highest');
highestSpan.innerText = point;
const menu = document.getElementById('menu');
const playButton = document.getElementById('playButton');

let targetsArr = [];
let targetsDeadsIndexArr = [];
let count = 0;

let targetsSpawningInterval;
let targetsMovingInterval;
let finishingInterval;

let sniperCircle;
let pistolCircle;
let knifeCircle;

const incPointContainer = document.createElement('div');
incPointContainer.id = "incPointContainer";
document.body.appendChild(incPointContainer);

for (let i = 0; i < guns.length; i++) {
    guns[i].addEventListener('click', function () {
        guns[i].style.border = "solid 2px green";
        guns[i].style.transform = "scale(1)";
        for (let j = 0; j < guns.length; j++) {
            if (i != j) {
                guns[j].style.border = "none";
                guns[j].style.transform = "scale(1)";
            }
        }
        chosenGun = i;
    })
}

for (let i = 0; i < levels.length; i++) {
    levels[i].addEventListener('click', function () {
        levels[i].style.border = "solid 2px green";
        levels[i].style.transform = "scale(1)";
        for (let j = 0; j < levels.length; j++) {
            if (i != j) {
                levels[j].style.border = "none";
                levels[j].style.transform = "scale(1)";
            }
        }
        chosenLevel = i;
    })
}

playButton.addEventListener('click', () => {
    start(game);
    targetsContainer.style.height = "100%"
})
function game() {
    if (chosenGun == 0) {
        sniperCircle = document.createElement('div');
        sniperCircle.id = "sniperCircle";
        const sniperHorzLine = document.createElement('div');
        sniperHorzLine.id = "sniperHorzLine";
        sniperCircle.appendChild(sniperHorzLine);
        targetsContainer.appendChild(sniperCircle);

        document.addEventListener('mousemove', function (e) {
            sniperCircle.style.left = `${e.clientX - sniperCircle.offsetWidth / 2}px`;
            sniperCircle.style.top = `${e.clientY - sniperCircle.offsetHeight / 2}px`;
        })
    } else if (chosenGun == 1) {
        pistolCircle = document.createElement('div');
        pistolCircle.id = "pistolCircle";
        const pistolHorzLine = document.createElement('div');
        pistolHorzLine.id = "pistolHorzLine";
        pistolCircle.appendChild(pistolHorzLine);
        console.log(targetsContainer);
        targetsContainer.appendChild(pistolCircle);

        document.addEventListener('mousemove', function (e) {
            pistolCircle.style.left = `${e.clientX - pistolCircle.offsetWidth / 2}px`;
            pistolCircle.style.top = `${e.clientY - pistolCircle.offsetHeight / 2}px`;
        })
    } else if (chosenGun == 2) {
        const knifeCircle = document.createElement('div');
        knifeCircle.id = "knifeCircle";
        const knifeHorzLine = document.createElement('div');
        knifeHorzLine.id = "knifeHorzLine";
        knifeCircle.appendChild(knifeHorzLine);
        targetsContainer.appendChild(knifeCircle);

        document.addEventListener('mousemove', function (e) {
            knifeCircle.style.left = `${e.clientX - knifeCircle.offsetWidth / 2}px`;
            knifeCircle.style.top = `${e.clientY - knifeCircle.offsetHeight / 2}px`;
        })
    }

    targetsSpawningInterval = setInterval(() => {
        if (count < 50) {
            let randomStartingTopValue = Math.floor(Math.random() * (document.body.offsetHeight - 165));
            target = document.createElement('div');
            targetIn = document.createElement('div');
            target.appendChild(targetIn)
            targetIn.innerText = count
            target.className = "target";
            targetsArr.push(target);
            targetsArr[count].style.top = `${randomStartingTopValue}px`;
        }
        if (count < targetsArr.length) {
            targetsContainer.appendChild(targetsArr[count]);
        }
        count++;
    }, chosenLevel == 0 ? 1000 : chosenLevel == 1 ? 700 : chosenLevel == 2 && 400);

    setInterval(() => {
        if (targetsDeadsIndexArr.length > 0) {
            for (let i = 0; i < targetsDeadsIndexArr.length; i++) {
                targetsDeadsIndexArr[i].style.left = "0"
            }
        }
    }, 50);

    targetsMovingInterval = setInterval(() => {
        for (let i = 0; i < targetsArr.length; i++) {
            if (Number(targetsArr[i].style.left.slice(0, targetsArr[i].style.left.length - 2)) < Math.floor(finishingLine.getBoundingClientRect().right - 60)) {
                let randomStartingLeftValue = 15;
                targetsArr[i].style.left = `${Number(targetsArr[i].style.left.slice(0, targetsArr[i].style.left.length - 2)) + randomStartingLeftValue}px`
            }
        }
    }, chosenLevel == 0 ? 200 : chosenLevel == 1 ? 130 : chosenLevel == 2 && 70)

    document.addEventListener('click', function (e) {
        for (let i = 0; i < targetsArr.length; i++) {
            if (
                //! !targetsArr[i].clicked && 
                isClicked(targetsArr[i], e.clientX, e.clientY)) {
                targetsDeadsIndexArr.push(targetsArr[i])
                targetsArr[i].style.display = "none";
                point += 1;
                pointSpan.innerText = point;
                incPointContainer.innerText = "+1";
                incPointContainer.style.fontSize = "70px";
                setTimeout(() => {
                    incPointContainer.style.display = "none";
                }, 100);
                break;
            }
        }
    });

    finishingInterval = setInterval(() => {
        for (let i = 0; i < targetsArr.length; i++) {
            if (Number(targetsArr[i].style.left.slice(0, targetsArr[i].style.left.length - 2)) > Math.floor(finishingLine.getBoundingClientRect().right - 60)) {
                gameOver();
                targetsArr = []
                // targetsContainer.innerHTML = "";
                for (let i = 0; i < targetsContainer.children.length; i++) {
                    if (targetsContainer.children[i].className.includes("target")) {
                        targetsContainer.children[i].remove();
                    }
                }
                targetsContainer.style.height = "0%"
            }
        }
    }, 1);

    function isClicked(target, clickX, clickY) {
        return (
            clickX >= target.getBoundingClientRect().left + 45 &&
            clickX <= target.getBoundingClientRect().right - 45 &&
            clickY >= target.getBoundingClientRect().top + 10 &&
            clickY <= target.getBoundingClientRect().bottom - 10
        );
    }
}

function start(callback) {
    playButton.style.transform = "scale(0.1)"
    setTimeout(() => {
        playButton.style.display = "none"
        menu.style.display = "none"
    }, 300);
    setTimeout(() => {
        callback();
    }, 300);
    console.log("ELCIN");
}

function gameOver() {
    clearInterval(targetsSpawningInterval);
    clearInterval(targetsMovingInterval);
    clearInterval(finishingInterval);
    targetsArr = [];
    count = 0;
    point = 0;

    pointSpan.innerText = point;
    showMenu();
}

function showMenu() {
    playButton.style.transform = "scale(1)";
    playButton.style.display = "flex";
    menu.style.display = "flex";
}