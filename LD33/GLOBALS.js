//GLOBALS.js

var gameState = 'loading'; //'playing', 'gameOver', 'loading'
var gameLoop = null;

var lastUpdate = Date.now();

var AH_GLOBALS = { 
	SCREEN_W: 848,
	SCREEN_H: 480,

	FPS: 16.66666
};

var PLAYER_CONSTS = {
    GRAV_HOLDING_JUMP_RISING: 0.25,
    GRAV_HOLDING_JUMP_FALLING : 0.5,
    GRAV : 1,
    JUMP_FORCE: 10,
    MAX_SPEED: 8,
    ACCELL: 0.6,

    //player collider vars
    T_COLLIDER_W: 1,
    T_COLLIDER_H: 1,
    T_COLLIDER_OFFSET: 16,

    B_COLLIDER_W: 1,
    B_COLLIDER_H: 1,
    B_COLLIDER_OFFSET: 16,

    L_COLLIDER_W: 1,
    L_COLLIDER_H: 5,
    L_COLLIDER_OFFSET: 10,

    R_COLLIDER_W: 1,
    R_COLLIDER_H: 5,
    R_COLLIDER_OFFSET: 10,

    DRAG: 0.8

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