//Player.js

function Player(){
	var self = this;

	this.sprite = PIXI.Sprite.fromImage("./img/player.png");
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 - 100);

	this.oldX = 0;
	this.oldY = 0;
	
	this.velocity = vector2.create(0,0);	

	scaleSprite(this.sprite);

	//define keyObjects and listeners
	this.kN = keyboard(38);
	this.kS = keyboard(40);
	this.kE = keyboard(39);
	this.kW = keyboard(37);

	//NORTH
	this.kN.press = function() {
		self.velocity._y -= AH_GLOBALS.PLAYER_SPEED;
	}
	this.kN.release = function() {
		self.velocity._y += AH_GLOBALS.PLAYER_SPEED;
	}
	//SOUTH
	this.kS.press = function() {
		self.velocity._y += AH_GLOBALS.PLAYER_SPEED;
	}
	this.kS.release = function() {
		self.velocity._y -= AH_GLOBALS.PLAYER_SPEED;
	}	
	//EAST
	this.kE.press = function() {
		self.velocity._x += AH_GLOBALS.PLAYER_SPEED;
	}
	this.kE.release = function() {
		self.velocity._x -= AH_GLOBALS.PLAYER_SPEED;
	}	
	//WEST
	this.kW.press = function() {
		self.velocity._x -= AH_GLOBALS.PLAYER_SPEED;
	}
	this.kW.release = function() {
		self.velocity._x += AH_GLOBALS.PLAYER_SPEED;
	}	


	// this.update = function()
	// {
	// 	if ( gameState === 'playing'){ 

	// 		self.oldX = self.sprite.position.x;
	// 		self.oldY = self.sprite.position.y;

	// 		self.sprite.position.x += this.velocity._x;
	// 		self.sprite.position.y += this.velocity._y;;
	// 		//self.sprite.rotation += 0.04;
	// 	}
	// }

	this.updateX = function()
	{
		if ( gameState === 'playing'){ 
			self.oldX = self.sprite.position.x;
			self.sprite.position.x += this.velocity._x;
		}
	}

	this.updateY = function()
	{
		if ( gameState === 'playing'){ 
			self.oldY = self.sprite.position.y;
			self.sprite.position.y += this.velocity._y;
		}
	}

	this.undoX = function(){
		self.sprite.position.x = self.oldX;
	}

	this.undoY = function() {
		self.sprite.position.y = self.oldY;
	}

}