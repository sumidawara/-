var MyCanvas;
var CTX;
var Log;
var Button;

var WinFlag = 0;

const GRIDCOUNT = 3;
const CONTINUECOUNT = 3;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_WIDTH = CANVAS_WIDTH / GRIDCOUNT;
const GRID_HEIGHT = CANVAS_HEIGHT / GRIDCOUNT;

const BG_COLOR = 'rgb( 255, 255, 255)';
const O_COLOR = 'rgb( 0, 255, 255)';
const X_COLOR = 'rgb( 255, 0, 0)';

var Grid = new Array(GRIDCOUNT);
for (let i = 0; i < GRIDCOUNT; i++) Grid[i] = new Array(GRIDCOUNT).fill(0);

window.onload = function () {
    MyCanvas = document.getElementById('mycanvas');
    MyCanvas.width = CANVAS_WIDTH;
    MyCanvas.height = CANVAS_HEIGHT;
    CTX = MyCanvas.getContext('2d');

    Button = document.getElementById('btn');
    Log = document.getElementById('log');

    MyCanvas.addEventListener('click', mouseClicked, false);

    Log.textContent = "先行はあなたです"

    drawBackGround(BG_COLOR);
    drawGrid();
}

function reset() {
    Log.textContent = "先行はあなたです";
    WinFlag = 0;
    for (let y = 0; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT; x++) {
            Grid[x][y] = 0;
        }
    }

    draw();
}

function mouseClicked(e) {
    if(WinFlag != 0)
    {
        Log.textContent = "リセットしてください";
        return;
    }
    Log.textContent = "";

    var rect = MyCanvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    //プレイヤーのターン
    if(playerInput( whereGridClicked(new Vector2(x, y))) == false) return;
    judge()

    //敵のターン
    computer();
    judge();

    draw();
}

function playerInput(_clickedGridPos)
{
    if(Grid[_clickedGridPos.x][_clickedGridPos.y] != 0)
    {
        Log.textContent = "そこには置けません";
        return false;
    }

    Grid[_clickedGridPos.x][_clickedGridPos.y] = 1;
    return true;
}

function computer()
{
    var candidate = [];
    for (let y = 0; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT; x++) {
            if(Grid[x][y] == 0)
            {
                candidate[candidate.length] = new Vector2(x,y);
            }
        }
    }

    if(candidate.length == 0) return;

    var randomNum = Math.floor(Math.random() * candidate.length);
    var answerPoint = candidate[randomNum];
    
    Grid[answerPoint.x][answerPoint.y] = -1;
}

function judge() {
    //横
    for (let y = 0; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT - CONTINUECOUNT + 1; x++) {
            var sum = xSectionSum(x, x + CONTINUECOUNT - 1, y);
            if (sum == CONTINUECOUNT) WinFlag = 1;
            if (sum == -CONTINUECOUNT) WinFlag = -1;
        }
    }
    //縦
    for (let x = 0; x < GRIDCOUNT; x++) {
        for (let y = 0; y < GRIDCOUNT - CONTINUECOUNT + 1; y++) {
            var sum = ySectionSum(y, y + CONTINUECOUNT - 1, x);
            if (sum == CONTINUECOUNT) WinFlag = 1;
            if (sum == -CONTINUECOUNT) WinFlag = -1;
        }
    }
    //スラッシュ
    for (let y = CONTINUECOUNT - 1; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT - CONTINUECOUNT + 1; x++) {
            var sum = slashSectionSum(new Vector2(x, y));
            if (sum == CONTINUECOUNT) WinFlag = 1;
            if (sum == -CONTINUECOUNT) WinFlag = -1;
        }
    }
    //バックスラッシュ
    for (let y = 0; y < GRIDCOUNT - CONTINUECOUNT + 1; y++) {
        for (let x = 0; x < GRIDCOUNT - CONTINUECOUNT + 1; x++) {
            var sum = backSlashSectionSum(new Vector2(x, y));
            if (sum == CONTINUECOUNT) WinFlag = 1;
            if (sum == -CONTINUECOUNT) WinFlag = -1;
        }
    }

    var allFilled = true;
    for (let y = 0; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT; x++) {
            if(Grid[x][y] == 0)
            {
                allFilled = false;
            }
        }
    }

    if (WinFlag == 1) {
        Log.textContent = "あなたの勝利です";
        return true;
    }
    if (WinFlag == -1) {
        Log.textContent = "コンピューターの勝利です";
        return true;
    }
    if(allFilled == true)
    {
        Log.textContent = "引き分けです";
        return true;
    }
    return false;
}

function xSectionSum(_left, _right, _y) {
    var sum = 0;
    for (let i = _left; i <= _right; i++) {
        sum += Grid[i][_y];
    }
    return sum;
}
function ySectionSum(_left, _right, _x) {
    var sum = 0;
    for (let i = _left; i <= _right; i++) {
        sum += Grid[_x][i];
    }
    return sum;
}
function slashSectionSum(_leftUnderPoint) {
    var sum = 0;
    for (let i = 0; i < CONTINUECOUNT; i++) {
        sum += Grid[_leftUnderPoint.x + i][_leftUnderPoint.y - i];
    }
    return sum;
}
function backSlashSectionSum(_rightUpPoint) {
    var sum = 0;
    for (let i = 0; i < CONTINUECOUNT; i++) {
        sum += Grid[_rightUpPoint.x + i][_rightUpPoint.y + i];
    }
    return sum;
}

function whereGridClicked(_clickedPoint) {
    var clickedArea = new Vector2(Math.floor(_clickedPoint.x / GRID_WIDTH), Math.floor(_clickedPoint.y / GRID_HEIGHT));
    return clickedArea;
}

function draw() {
    drawBackGround();
    drawOX();
    drawGrid();
}
function drawOX() {
    for (let y = 0; y < GRIDCOUNT; y++) {
        for (let x = 0; x < GRIDCOUNT; x++) {
            if (Grid[x][y] == 1) {
                CTX.fillStyle = O_COLOR;
                CTX.fillRect(x * GRID_WIDTH, y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT)
            }
            else if (Grid[x][y] == -1) {
                CTX.fillStyle = X_COLOR;
                CTX.fillRect(x * GRID_WIDTH, y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT)
            }
        }
    }
}
function drawBackGround() {
    CTX.beginPath();
    CTX.fillStyle = BG_COLOR;
    CTX.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function drawGrid() {
    CTX.strokeStyle = "black";
    CTX.lineWidth = 1;

    CTX.beginPath();
    for (var i = 1; i < GRIDCOUNT; i++) {
        CTX.moveTo(i * GRID_WIDTH, 0);
        CTX.lineTo(i * GRID_WIDTH, CANVAS_HEIGHT)
    }

    for (var i = 1; i < GRIDCOUNT; i++) {
        CTX.moveTo(0, i * GRID_HEIGHT);
        CTX.lineTo(CANVAS_WIDTH, i * GRID_HEIGHT)
    }

    CTX.stroke();
}