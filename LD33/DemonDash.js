function onAssetsLoaded(){

	window.gameLoop = new GameLoop();
//	window.gameLoop.init();
	gameState = 'showMainMenu';
	window.gameLoop.run();
	document.getElementById("loader").style.display = "none";
}

function preloadTextures() {
	
	// create a new loader
	var loader = PIXI.loader;

	loader.add('player', './img/player.png');
	loader.add('player_run1', './img/player_run1.png');
	loader.add('player_run2', './img/player_run2.png');
	loader.add('player_jump1', './img/player_jump1.png');
	loader.add('player_jump2', './img/player_jump2.png');
	loader.add('player_land', './img/player_land.png');
	loader.add('enemy_run1', './img/enemy_run1.png');
	loader.add('enemy_run2', './img/enemy_run2.png');
	loader.add('enemy_throw1', './img/enemy_throw1.png');
	loader.add('enemy_throw2', './img/enemy_throw2.png');
	loader.add('ground', './img/wall_stone_grass_1.png');
	loader.add('goal', './img/goal.png');
	loader.add('wall_stone_grass_1', './img/wall_stone_grass_1.png');
	loader.add('wall_stone_grass_2', './img/wall_stone_grass_2.png');
	loader.add('wall_stone_grass_3', './img/wall_stone_grass_3.png');
	loader.add('wall_stone_grass_4', './img/wall_stone_grass_4.png');
	loader.add('wall_stone_grass_5', './img/wall_stone_grass_5.png');
	loader.add('wall_stone_grass_6', './img/wall_stone_grass_6.png');
	loader.add('wall_stone_grass_7', './img/wall_stone_grass_7.png');
	loader.add('wall_stone_grass_8', './img/wall_stone_grass_8.png');
	loader.add('wall_stone_grass_9', './img/wall_stone_grass_9.png');
	loader.add('spikes_down', './img/spikes_down.png');
	loader.add('spikes_up', './img/spikes_up.png');
	loader.add('spikes_left', './img/spikes_left.png');
	loader.add('spikes_right', './img/spikes_right.png');
	loader.add('bg1', './img/bg1.jpg');
	loader.add('mainMenu', './img/mainMenu.png');
	loader.add('game_complete', './img/game_complete.png');
	loader.add('torch', './img/torch.png');
	loader.add('flame1', './img/flame1.png');
	loader.add('flame2', './img/flame2.png');

	//load sounds
	soundStep1 = new Howl({urls: ['./sounds/running1.mp3'],volume: 0.2});
	soundStep2 = new Howl({urls: ['./sounds/running2.mp3'],volume: 0.2});
	soundLandJump = new Howl({urls: ['./sounds/landing.mp3'],volume: 0.2});
	soundJump = new Howl({urls: ['./sounds/jumping2.mp3'],volume: 0.12});
	soundFallThrough = new Howl({urls: ['./sounds/death_fall.mp3'],volume: 0.2});
	soundSpikeDeath = new Howl({urls: ['./sounds/death_spike.mp3'],volume: 0.1});
	soundSpikeFire = new Howl({urls: ['./sounds/death_fire.mp3'],volume: 0.1});
	soundHitByEnemy = new Howl({urls: ['./sounds/collision.mp3'],volume: 0.2});
	soundGoal = new Howl({urls: ['./sounds/goal.mp3'],volume: 0.8});
	soundMainMenu = new Howl({urls: ['./sounds/menu_music.wav'],volume: 0.4, loop: true});
	soundGameBG = new Howl({urls: ['./sounds/game_music.wav'],volume: 0.2, loop: true});
	soundHeadBump = new Howl({urls: ['./sounds/head_bump.mp3'],volume: 0.2});
	soundTerrainFlame = new Howl({urls: ['./sounds/terrain_flame.mp3'],volume: 0.15});
	soundThrowTorch = new Howl({urls: ['./sounds/throw_torch.mp3'],volume: 0.15});
	
	// use callback
	loader.once('complete', onAssetsLoaded);
	//begin load
	loader.load();
}

function scaleSprite(sprite_){
	
	//commented out to remove scaling
	// sprite_.scale.x = window.innerHeight / AH_GLOBALS.SCREEN_H;
	// sprite_.scale.y = window.innerHeight / AH_GLOBALS.SCREEN_H;
}

function collisionManager(sprite1, sprite2, scale)
{
	if ( !scale ){
		scale = 1;
		//console.log('setting scale to 1 as it is undefined');
	}

	//find left, right, top and bottom of sprite1
	var l1 = sprite1.position.x - (Math.abs(sprite1.width)  * scale) / 2;
	var r1 = sprite1.position.x + (Math.abs(sprite1.width) * scale) / 2;
	var t1 = sprite1.position.y + (Math.abs(sprite1.height) * scale) / 2;
	var b1 = sprite1.position.y - (Math.abs(sprite1.height) * scale) / 2;
	var l2 = sprite2.position.x - (Math.abs(sprite2.width) * scale) / 2;
	var r2 = sprite2.position.x + (Math.abs(sprite2.width) * scale) / 2;
	var t2 = sprite2.position.y + (Math.abs(sprite2.height) * scale) / 2;
	var b2 = sprite2.position.y - (Math.abs(sprite2.height) * scale) / 2;

	if (r1 < l2 || r2 < l1 || b1 > t2 || t1 < b2){
		return false;
	}
	return true;
}

preloadTextures();