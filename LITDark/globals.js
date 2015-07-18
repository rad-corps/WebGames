////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//GAME GLOBALS
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

//level key
// 0 = terrain0
// 1 = terrain1
// 2 = wall

var levelBottom = [
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
[2,1,2,2,2,1,0,1,0,2,2,2,2,2,2,1,0,1,0,1,0,1,0,1,2],
[2,0,2,0,1,2,1,0,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
[2,1,2,1,0,1,0,1,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2],
[2,0,2,0,1,0,1,0,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
[2,1,2,1,0,2,0,1,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2],
[2,0,2,2,2,0,1,0,1,2,2,2,2,0,1,0,1,0,1,0,1,0,1,0,2],
[2,1,2,1,0,1,0,1,0,2,2,2,2,1,0,1,0,1,0,1,0,1,0,1,2],
[2,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
[2,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2],
[2,0,2,0,1,0,1,0,1,2,2,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
[2,1,2,1,0,1,0,1,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];


//0 = nothing
//1 = wall moving down
//2 = wall moving up
//3 = wall moving right/east
//4 = wall moving right/east
//5 = zig zag wall 1 
//6 = zig zag wall 2
//8 = goal
//9 = crate

var levelTop = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
[0,0,0,8,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,9,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,3,0,0,4,0,0,0,0,0,0,0,0,0,0],
];


var gameState = 'loadMenu'; //'playing', 'gameOver', 'menu', 'loadMenu'
var gameLoop = null;
var lastUpdate = Date.now();

var AH_GLOBALS = { 
    //SCREEN_W: 848,
    //SCREEN_H: 480,
    SCREEN_W: 800,
    SCREEN_H: 450,    
    PLAYER_SPEED: 3,
    WALL_SPEED: 1
};

var fontStyle = {
    align: 'center',
    font : '36px Arial bold italic',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
};