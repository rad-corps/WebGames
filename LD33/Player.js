//Player.js

function Player(){
	var self = this;

	//just for testing until platforms are included
	//self.groundYPos = AH_GLOBALS.SCREEN_H/2;

	self.sprite = PIXI.Sprite.fromImage("./img/player.png");
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.position.set(AH_GLOBALS.SCREEN_W/2, self.groundYPos);
	self.sprite.interactive = true;
	self.sprite.on('mousedown', this.playerMouseDown);	

	self.lCol = {};
	self.rCol = {};
	self.tCol = {};
	self.bCol = {};

	self.lCol.height = 10;
	self.lCol.width = 1;
	self.lCol.position = {x : 0, y : 0};
	self.rCol.height = 10;
	self.rCol.width = 1;
	self.rCol.position = {x : 0, y : 0};
	self.bCol.height = 1;
	self.bCol.width = 10;	
	self.bCol.position = {x : 0, y : 0};
	self.tCol.height = 1;
	self.tCol.width = 10;		
	self.tCol.position = {x : 0, y : 0};

	self.maxSpeed = 14;
	self.kEDown = false;
	self.kWDown = false;
	self.kNDown = false;
	self.kSDown = false;

	scaleSprite(this.sprite);

	self.velocity = vector2.create(0,0);
	self.direction = vector2.create(0,0);
	self.onGround = true;

	self.kN = keyboard(38);
	self.kS = keyboard(40);
	self.kE = keyboard(39);
	self.kW = keyboard(37);

	//jump key
	this.kN.press = function() {
		self.kNDown = true;	

		if (self.onGround === true){
			self.velocity._y = -AH_GLOBALS.JUMP_FORCE;
			self.onGround = false;
		}
	}

	this.kN.release = function() {				
		self.kNDown = false;	
	}

	//run left and right
	this.kE.press = function() {
		self.kEDown = true;		
		self.sprite.scale.x = 1; //flip sprite
	}

	this.kE.release = function() {
		self.kEDown = false;
	}

	this.kW.press = function() {
		self.kWDown = true;
		self.sprite.scale.x = -1; //flip sprite
	}

	this.kW.release = function() {
		self.kWDown = false;
	}

	this.setOnGround = function(onGround_, groundSprite_) {
		self.onGround = onGround_;
		if ( self.onGround === true )
		{
			self.velocity._y = 0;

			//move player to the top of the ground
			self.sprite.position.y = groundSprite_.position.y - 32;
		}
	}

	this.bumpHead = function(groundSprite_)
	{
		console.log('bump head');
		if ( self.velocity._y < 0 )
		{
			console.log('inverting velocity');
			self.velocity._y = -self.velocity._y;
		}
	}

	this.pushAgainstTerrain = function(direction_, groundSprite_) 
	{
		self.velocity._x = 0;

		if ( direction_ === 'right')
		{
			console.log('RIGHT');
			self.sprite.position.x = groundSprite_.position.x - 32;	
		}
		else
		{
			console.log('LEFT');
			self.sprite.position.x = groundSprite_.position.x + 32;	
		}
	}

	this.playerMouseDown = function (){
		console.log('playerMouseDown');
	}

	this.update = function()
	{
		if ( gameState === 'playing'){ 

			//accellerate player
			if ( self.kEDown === true )
				self.velocity._x += 1;
			if ( self.kWDown === true )
				self.velocity._x -= 1;


			//dont go faster than max speed
			if ( self.velocity._x > self.maxSpeed)
				self.velocity._x = self.maxSpeed;
			if ( self.velocity._x < -self.maxSpeed)
				self.velocity._x = -self.maxSpeed;

			//drag
			if ( self.kEDown === false && self.kWDown === false)
			{
				//scale down the velocity x vector
				self.velocity._x = 0.8 * self.velocity._x;
			}
			
			self.sprite.position.x += self.velocity.getX();
			self.sprite.position.y += self.velocity.getY();

			//update the players 4 colliders
			self.rCol.position.x = self.sprite.position.x + 10;
			self.rCol.position.y = self.sprite.position.y;
			self.lCol.position.x = self.sprite.position.x - 10;
			self.lCol.position.y = self.sprite.position.y;
			self.bCol.position.x = self.sprite.position.x;
			self.bCol.position.y = self.sprite.position.y + 16;
			self.tCol.position.x = self.sprite.position.x;
			self.tCol.position.y = self.sprite.position.y - 10;

			//console.log(self.lCol);

			//apply gravity if not on ground
			if ( self.onGround === false )
			{
				if ( self.kNDown === true ) //apply less gravity if still holding jump
				{ 
					if ( self.velocity._y < 0 )//not falling yet
					{
						self.velocity._y += AH_GLOBALS.GRAV_HOLDING_JUMP_RISING; 
					}
					else if ( self.velocity._y >= 0 ) //although apply the more gravity if we are falling. 
					{
						self.velocity._y += AH_GLOBALS.GRAV_HOLDING_JUMP_FALLING; 	
					}					
				}
				if ( self.kNDown === false ) 
				{
					self.velocity._y += AH_GLOBALS.GRAV;	
				}

				// if ( self.sprite.position.y >= self.groundYPos )
				// {
				// 	self.sprite.position.y = self.groundYPos;
				// 	self.onGround = true;
				// 	self.velocity._y = 0;
				// }
			}
		}
	}
}