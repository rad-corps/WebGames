////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//GAME GLOBALS
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
var gameState = 'loadMenu'; //'playing', 'gameOver', 'menu', 'loadMenu'
var gameLoop = null;
var lastUpdate = Date.now();

var AH_GLOBALS = { 
	SCREEN_W: 848,
	SCREEN_H: 480,
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

var scoreFontStyle = {
	align: 'center',
    font : '20px Arial bold italic',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 1,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 2,
    wordWrap : true,
    wordWrapWidth : 440
};