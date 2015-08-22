//GLOBALS.js

var gameState = 'loading'; //'playing', 'gameOver', 'loading'
var gameLoop = null;

var lastUpdate = Date.now();

var AH_GLOBALS = { 
	SCREEN_W: 848,
	SCREEN_H: 480,
	MAX_SPEED: 3.5,
	ACCELLERATION: 0.15,
	TIME_STEP: 30
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

var Collider = { 
	width: 0,
	height: 0,
	position: 0
};