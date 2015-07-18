//Player.js

function Player(row_, col_){
	var self = this;

	this.frames = [];
	this.sprite = {};

	for (var i = 0; i < 4; i++) 
	{
        // magically works since the spritesheet was loaded with the pixi loader
        this.frames.push(PIXI.Texture.fromFrame('./img/player_' + i + '.png'));
    }

    this.sprite = new PIXI.extras.MovieClip(this.frames);
    this.sprite.animationSpeed = 0.08;

	//this.sprite = PIXI.Sprite.fromImage("./img/player.png");
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.position.set(col_*32 + 16, row_*32 + 16);
	this.sprite.velocity = vector2.create(0,0);	
	//this.sprite.play();
	this.reachedGoal = false;
	this.walkingSoundPlaying = false;
	//this.speedMulti = 1;

	this.oldX = 0;
	this.oldY = 0;

	this.receivingInput = true;

	scaleSprite(this.sprite);

	//define keyObjects and listeners
	this.kN = keyboard(38);
	this.kS = keyboard(40);
	this.kE = keyboard(39);
	this.kW = keyboard(37);

	this.turnOffInput = function() {
		self.receivingInput = false;
		self.sprite.gotoAndStop(0);
	}

	this.cancelVelocity = function()
	{
		self.sprite.velocity._x = 0;
		self.sprite.velocity._y = 0;
	}

	this.playWalkingSound = function() {
		if ( self.walkingSoundPlaying === false ) {
			self.walkingSoundPlaying = true;
			soundFootsteps.play();
		}
	}

	this.stopWalkingSound = function() {
		if ( self.walkingSoundPlaying === true ) {
			self.walkingSoundPlaying = false;
			soundFootsteps.stop();
		}
	}

	this.stopAnimationIfStill = function(){
		if ( self.sprite.velocity._x === 0 && self.sprite.velocity._y === 0){
			self.sprite.gotoAndStop(0);	
			self.stopWalkingSound();
		}
	}

	//NORTH
	this.kN.press = function() {
		if ( self.receivingInput === false )
			return;
		self.cancelVelocity();
		self.sprite.velocity._y -= AH_GLOBALS.PLAYER_SPEED;
		self.sprite.rotation = 0;
		self.sprite.play();
		self.playWalkingSound();
	}
	this.kN.release = function() {				
		if ( self.sprite.velocity._y < 0 ) self.sprite.velocity._y = 0;
		self.stopAnimationIfStill();
	}
	//SOUTH
	this.kS.press = function() {
		if ( self.receivingInput === false )
			return;
		self.cancelVelocity();
		self.sprite.velocity._y += AH_GLOBALS.PLAYER_SPEED;
		self.sprite.rotation = 3.14;
		self.sprite.play();
		self.playWalkingSound();
	}
	this.kS.release = function() {
		if ( self.sprite.velocity._y > 0 ) self.sprite.velocity._y = 0;
		self.stopAnimationIfStill();
	}	
	//EAST
	this.kE.press = function() {
		if ( self.receivingInput === false )
			return;
		self.cancelVelocity();
		self.sprite.velocity._x += AH_GLOBALS.PLAYER_SPEED;
		self.sprite.rotation = (3.14 /2) * 3;
		self.sprite.play();
		self.playWalkingSound();
	}
	this.kE.release = function() {
		if ( self.sprite.velocity._x > 0 ) self.sprite.velocity._x = 0;
		self.stopAnimationIfStill();
	}	
	//WEST
	this.kW.press = function() {
		if ( self.receivingInput === false )
			return;		
		self.cancelVelocity();
		self.sprite.velocity._x -= AH_GLOBALS.PLAYER_SPEED;
		self.sprite.rotation = 3.14 /2;
		self.sprite.play();
		self.playWalkingSound();
	}
	this.kW.release = function() {
		if ( self.sprite.velocity._x < 0 ) self.sprite.velocity._x = 0;
		self.stopAnimationIfStill();
	}	

	// this.setSpeedMulti = function(val_){
	// 	self.speedMulti = val_;
	// }

	this.updateX = function()
	{
		if ( gameState === 'playing'){ 
			self.oldX = self.sprite.position.x;
			self.sprite.position.x += this.sprite.velocity._x;
		}
	}

	this.updateY = function()
	{
		if ( gameState === 'playing'){ 
			self.oldY = self.sprite.position.y;
			self.sprite.position.y += this.sprite.velocity._y;
		}
	}

	this.undoX = function(){
		
		//move back double the distance to avoid getting stuck to things
		var direction = vector2.create(self.oldX - self.sprite.position.x, 0);
		direction.normalise();
		direction.multiplyBy(6);
		self.sprite.position.x = self.sprite.position.x + direction._x;
		self.sprite.velocity._x = 0;
	}

	this.undoY = function() {
		var direction = vector2.create(0, self.oldY - self.sprite.position.y);
		direction.normalise();
		direction.multiplyBy(6);
		self.sprite.position.y = self.sprite.position.y + direction._y;
		self.sprite.velocity._y = 0;
	}

}