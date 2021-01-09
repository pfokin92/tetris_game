let main = document.querySelector(".main");
const scoreElem = document.getElementById('score');
const levelElem = document.getElementById('level');

let figures = {
    O: [
        [1,1],
        [1,1]
    ],
    I: [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    S: [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    Z: [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    L:[
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    J: [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    T: [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ]
};

let playfiled = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

let currentLevel = 1;

let possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 500
    },
    2: {
        scorePerLine: 15,
        speed: 300,
        nextLevelScore: 1000
    },
    3: {
        scorePerLine: 20,
        speed: 200,
        nextLevelScore: 2000
    },
    4: {
        scorePerLine: 30,
        speed: 100,
        nextLevelScore: 4000
    },
    5: {
        scorePerLine: 50,
        speed: 50,
        nextLevelScore: Infinity
    }
};


let activeTetro = {
    x:3,
    y:0,
    shape: [
        [0,0,0],
        [0,1,0],
        [1,1,1]
    ]
};


let score = 0;

function getNewTetro() {
    const posibleFigures = 'OISZLJT';
    const rand = Math.floor(Math.random()*7)
    return figures[posibleFigures[rand]];
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfiled.length; y++) {
        for (let x = 0; x < playfiled[y].length; x++) {
            if (playfiled[y][x] === 1){
                playfiled[y][x] = 0;
            }
        }        
    }
    
}

function moveTetroDown() {
    activeTetro.y += 1;
    if(hasCollisions()){
        activeTetro.y -= 1;
        fixTetro();
        activeTetro.shape = getNewTetro();
        activeTetro.y = 0;
        activeTetro.x = Math.floor((10 - activeTetro.shape[0].length)/2);
    }
}

function addActiveTetro() {
    removePrevActiveTetro()
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if(activeTetro.shape[y][x]===1){
                playfiled[activeTetro.y+y][activeTetro.x+x] = activeTetro.shape[y][x];
            }
            
        }
        
    }
}

function rotateTetro() {
    const prevTetroState = activeTetro.shape;
    activeTetro.shape = activeTetro.shape.map((val,index)=>activeTetro.shape.map((row)=>row[index]).reverse()); 
    if(hasCollisions()){
       activeTetro.shape=prevTetroState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if(activeTetro.shape[y][x] && 
                (playfiled[activeTetro.y + y] === undefined ||
                playfiled[activeTetro.y+y][activeTetro.x+x] === undefined || 
                playfiled[activeTetro.y+y][activeTetro.x+x] === 2)){
               return true;
            }            
        }
    }      
    return false; 
}


function draw(){
    let mainInnerHTML = '';
    for (let y = 0; y < playfiled.length; y++) {
        for (let x = 0; x < playfiled[y].length; x++) {
            if (playfiled[y][x] === 1){
                mainInnerHTML += '<div class="cell movingCell"></div>';
            } else if (playfiled [y][x] ===2) {
                mainInnerHTML += '<div class="cell fixedCell"></div>';
            }
            else {
                mainInnerHTML += '<div class="cell"></div>';
            }            
        }        
    }
    main.innerHTML= mainInnerHTML;
}








function removeFullLines() {
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playfiled.length; y++) {
        for (let x = 0; x < playfiled[y].length; x++) {
            if(playfiled[y][x] !== 2){
                canRemoveLine = false;
            }
        }
        if (canRemoveLine){
            filledLines += 1;
            playfiled.splice(y,1);
            playfiled.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
        canRemoveLine = true;
    }
    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;            
            break;
        case 2:
            score += 3 * possibleLevels[currentLevel].scorePerLine;            
            break;
        case 3:
            score += 6 * possibleLevels[currentLevel].scorePerLine;            
            break;
        case 4:
            score += 12 * possibleLevels[currentLevel].scorePerLine;            
            break;    
        default:

            break;
    }
    scoreElem.innerHTML = score;
    if(score >= possibleLevels[currentLevel].nextLevelScore){
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}



function fixTetro() {
    for (let y = 0; y < playfiled.length; y++) {
        for (let x = 0; x < playfiled[y].length; x++) {
            if(playfiled[y][x]===1){
                playfiled[y][x]=2;
            }

        }
    }

    removeFullLines()
    // addNewTetro();    
}


document.onkeydown = function(event) {
    if (event.keyCode === 37) {
        activeTetro.x -= 1;
        if (hasCollisions()){
            activeTetro.x +=1;
        }
    } else if (event.keyCode ===39) {
        activeTetro.x += 1;
        if (hasCollisions()){
            activeTetro.x -=1;
        }
    } else if (event.keyCode === 40){
        moveTetroDown()
    } else if (event.keyCode === 38){
        rotateTetro();
    }
    addActiveTetro();
    draw();
}

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

addActiveTetro();
draw();

function startGame() {
    moveTetroDown();
    addActiveTetro();
    draw();
    setTimeout(startGame,possibleLevels[currentLevel].speed);
}

setTimeout(startGame, possibleLevels[currentLevel].speed);
