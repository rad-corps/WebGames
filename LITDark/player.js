//Player.js

function Player(row_, col_){
	var self = this;

	this.sprite = PIXI.Sprite.fromImage("./img/player.png");
//	this.sprite.anchor.x = 0.5;
//	this.sprite.anchor.y = 0.5;
	this.sprite.position.set(col_*32, row_*32);
	this.sprite.velocity = vector2.create(0,0);	
	this.reachedGoal = false;
	//this.speedMulti = 1;

	this.oldX = 0;
	this.oldY = 0;
	
	

	scaleSprite(this.sprite);

	//define keyObjects and listeners
	this.kN = keyboard(38);
	this.kS = keyboard(40);
	this.kE = keyboard(39);
	this.kW = keyboard(37);

	this.cancelVelocity = function()
	{
		self.sprite.velocity._x = 0;
		self.sprite.velocity._y = 0;
	}

	//NORTH
	this.kN.press = function() {
		self.cancelVelocity();
		self.sprite.velocity._y -= AH_GLOBALS.PLAYER_SPEED;
	}
	this.kN.release = function() {		
		if ( self.sprite.velocity._y < 0 ) self.sprite.velocity._y = 0;
	}
	//SOUTH
	this.kS.press = function() {
		self.cancelVelocity();
		self.sprite.velocity._y += AH_GLOBALS.PLAYER_SPEED;
	}
	this.kS.release = function() {
		if ( self.sprite.velocity._y > 0 ) self.sprite.velocity._y = 0;
	}	
	//EAST
	this.kE.press = function() {
		self.cancelVelocity();
		self.sprite.velocity._x += AH_GLOBALS.PLAYER_SPEED;
	}
	this.kE.release = function() {
		if ( self.sprite.velocity._x > 0 ) self.sprite.velocity._x = 0;
	}	
	//WEST
	this.kW.press = function() {
		self.cancelVelocity();
		self.sprite.velocity._x -= AH_GLOBALS.PLAYER_SPEED;
	}
	this.kW.release = function() {
		if ( self.sprite.velocity._x < 0 ) self.sprite.velocity._x = 0;
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