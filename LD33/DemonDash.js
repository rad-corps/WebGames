function onAssetsLoaded(){

	window.gameLoop = new GameLoop();
//	window.gameLoop.init();
	gameState = 'showMainMenu';
	window.gameLoop.run();
//	document.getElementById("loader").style.display = "none";
}

function preloadTextures() {
	
	// create a new loader
	var loader = PIXI.loader;

	loader.add('player', SITE_PATH + 'img/player.png');
	loader.add('player_run1', SITE_PATH + 'img/player_run1.png');
	loader.add('player_run2', SITE_PATH + 'img/player_run2.png');
	loader.add('player_jump1', SITE_PATH + 'img/player_jump1.png');
	loader.add('player_jump2', SITE_PATH + 'img/player_jump2.png');
	loader.add('player_land', SITE_PATH + 'img/player_land.png');
	loader.add('enemy_run1', SITE_PATH + 'img/enemy_run1.png');
	loader.add('enemy_run2', SITE_PATH + 'img/enemy_run2.png');
	loader.add('enemy_throw1', SITE_PATH + 'img/enemy_throw1.png');
	loader.add('enemy_throw2', SITE_PATH + 'img/enemy_throw2.png');
	loader.add('ground', SITE_PATH + 'img/wall_stone_grass_1.png');
	loader.add('goal', SITE_PATH + 'img/goal.png');
	loader.add('wall_stone_grass_1', SITE_PATH + 'img/wall_stone_grass_1.png');
	loader.add('wall_stone_grass_2', SITE_PATH + 'img/wall_stone_grass_2.png');
	loader.add('wall_stone_grass_3', SITE_PATH + 'img/wall_stone_grass_3.png');
	loader.add('wall_stone_grass_4', SITE_PATH + 'img/wall_stone_grass_4.png');
	loader.add('wall_stone_grass_5', SITE_PATH + 'img/wall_stone_grass_5.png');
	loader.add('wall_stone_grass_6', SITE_PATH + 'img/wall_stone_grass_6.png');
	loader.add('wall_stone_grass_7', SITE_PATH + 'img/wall_stone_grass_7.png');
	loader.add('wall_stone_grass_8', SITE_PATH + 'img/wall_stone_grass_8.png');
	loader.add('wall_stone_grass_9', SITE_PATH + 'img/wall_stone_grass_9.png');
	loader.add('spikes_down', SITE_PATH + 'img/spikes_down.png');
	loader.add('spikes_up', SITE_PATH + 'img/spikes_up.png');
	loader.add('spikes_left', SITE_PATH + 'img/spikes_left.png');
	loader.add('spikes_right', SITE_PATH + 'img/spikes_right.png');
	loader.add('bg1', SITE_PATH + 'img/bg1.jpg');
	loader.add('mainMenu', SITE_PATH + 'img/mainMenu.png');
	loader.add('game_complete', SITE_PATH + 'img/game_complete.png');
	loader.add('torch', SITE_PATH + 'img/torch.png');
	loader.add('flame1', SITE_PATH + 'img/flame1.png');
	loader.add('flame2', SITE_PATH + 'img/flame2.png');

	//load sounds
	soundStep1 = new Howl({urls: [SITE_PATH + 'sounds/running1.mp3'],volume: 0.2});
	soundStep2 = new Howl({urls: [SITE_PATH + 'sounds/running2.mp3'],volume: 0.2});
	soundLandJump = new Howl({urls: [SITE_PATH + 'sounds/landing.mp3'],volume: 0.2});
	soundJump = new Howl({urls: [SITE_PATH + 'sounds/jumping2.mp3'],volume: 0.12});
	soundFallThrough = new Howl({urls: [SITE_PATH + 'sounds/death_fall.mp3'],volume: 0.2});
	soundSpikeDeath = new Howl({urls: [SITE_PATH + 'sounds/death_spike.mp3'],volume: 0.1});
	soundSpikeFire = new Howl({urls: [SITE_PATH + 'sounds/death_fire.mp3'],volume: 0.1});
	soundHitByEnemy = new Howl({urls: [SITE_PATH + 'sounds/collision.mp3'],volume: 0.2});
	soundGoal = new Howl({urls: [SITE_PATH + 'sounds/goal.mp3'],volume: 0.8});
	soundMainMenu = new Howl({urls: [SITE_PATH + 'sounds/menu_music.wav'],volume: 0.4, loop: true});
	soundGameBG = new Howl({urls: [SITE_PATH + 'sounds/game_music.wav'],volume: 0.2, loop: true});
	soundHeadBump = new Howl({urls: [SITE_PATH + 'sounds/head_bump.mp3'],volume: 0.2});
	soundTerrainFlame = new Howl({urls: [SITE_PATH + 'sounds/terrain_flame.mp3'],volume: 0.15});
	soundThrowTorch = new Howl({urls: [SITE_PATH + 'sounds/throw_torch.mp3'],volume: 0.15});
	
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