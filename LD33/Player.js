//Player.js

function Player(){
	var self = this;

	//just for testing until platforms are included
	//self.groundYPos = AH_GLOBALS.SCREEN_H/2;

	self.sprite = PIXI.Sprite.fromImage("./img/player.png");

	//preload the textures
	self.textureIdle = PIXI.Texture.fromImage("./img/player.png");
	self.textureRun1 = PIXI.Texture.fromImage("./img/player_run1.png");
	self.textureRun2 = PIXI.Texture.fromImage("./img/player_run2.png");
	self.textureJump1 = PIXI.Texture.fromImage("./img/player_jump1.png");
	self.textureJump2 = PIXI.Texture.fromImage("./img/player_jump2.png");
	self.textureLand = PIXI.Texture.fromImage("./img/player_land.png");

	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;	

	self.timeSinceFootstep = 0;
	self.timeSinceLand = 0;
	self.stepNum = 0;

	self.wasInAir = false;

	self.lCol = {};
	self.rCol = {};
	self.tCol = {};
	self.bCol = {};

	self.lCol.height = PLAYER_CONSTS.L_COLLIDER_H;
	self.lCol.width = PLAYER_CONSTS.L_COLLIDER_W;
	self.lCol.position = {x : 0, y : 0};
	self.rCol.height = PLAYER_CONSTS.R_COLLIDER_H;
	self.rCol.width = PLAYER_CONSTS.R_COLLIDER_W;
	self.rCol.position = {x : 0, y : 0};
	self.bCol.height = PLAYER_CONSTS.B_COLLIDER_H;
	self.bCol.width = PLAYER_CONSTS.B_COLLIDER_W;	
	self.bCol.position = {x : 0, y : 0};
	self.tCol.height = PLAYER_CONSTS.T_COLLIDER_H;
	self.tCol.width = PLAYER_CONSTS.T_COLLIDER_W;		
	self.tCol.position = {x : 0, y : 0};

	self.maxSpeed = PLAYER_CONSTS.MAX_SPEED;
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
	self.kData = keyboard(68);

	this.setPos = function(row_, col_)
	{
		self.sprite.position.x = col_ * 32;
		self.sprite.position.y = row_ * 32;
	}

	this.updateColliders = function()
	{
		//update the players 4 colliders
		self.rCol.position.x = self.sprite.position.x + PLAYER_CONSTS.R_COLLIDER_OFFSET;
		self.rCol.position.y = self.sprite.position.y;
		self.lCol.position.x = self.sprite.position.x - PLAYER_CONSTS.L_COLLIDER_OFFSET;
		self.lCol.position.y = self.sprite.position.y;
		self.bCol.position.x = self.sprite.position.x;
		self.bCol.position.y = self.sprite.position.y + PLAYER_CONSTS.B_COLLIDER_OFFSET;
		self.tCol.position.x = self.sprite.position.x;
		self.tCol.position.y = self.sprite.position.y - PLAYER_CONSTS.T_COLLIDER_OFFSET;
	}

	this.kData.press = function() {	
		console.log('x: ' + self.sprite.position.x);
		console.log('y: ' + self.sprite.position.y);
	}

	//jump key
	this.kN.press = function() {
		self.kNDown = true;	

		if (self.onGround === true){
			self.velocity._y = -PLAYER_CONSTS.JUMP_FORCE;
			soundJump.play();
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
			self.updateColliders();

			//play landing sound
			if ( self.wasInAir === true )
			{
				soundLandJump.play();
				self.sprite.texture = self.textureLand;
				self.timeSinceLand = 0;
				self.wasInAir = false;
			}
		}
	}

	this.bumpHead = function(groundSprite_)
	{
		if ( self.velocity._y < 0 )
		{
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
		self.updateColliders();
	}

	this.playerMouseDown = function (){
		console.log('playerMouseDown');
	}

	this.update = function()
	{
		if ( gameState === 'playing'){ 

			self.timeSinceLand += AH_GLOBALS.FPS;

			//accellerate player
			if ( self.kEDown === true )
				self.velocity._x += PLAYER_CONSTS.ACCELL;
			if ( self.kWDown === true )
				self.velocity._x -= PLAYER_CONSTS.ACCELL;

			//play footstep sound
			if ( self.kEDown === true || self.kWDown === true )
			{
				if ( self.onGround === true )
				{					
					self.timeSinceFootstep += AH_GLOBALS.FPS;
					

					if ( self.timeSinceFootstep > 100 )
					{
						//animate player and play footstep sounds
						if ( self.stepNum % 2 === 0)
						{			
							self.sprite.texture = self.textureRun1;
							soundStep1.play();
						}
						else
						{
							self.sprite.texture = self.textureRun2;
							soundStep2.play();	
						}

 						++self.stepNum;
						self.timeSinceFootstep = 0;
					}
				}
			}
			//set texture to idle
			else if (self.onGround === true)
			{
				if ( self.timeSinceLand < 100 )
				{
					self.sprite.texture = self.textureLand;	
				}
				else
				{
					self.sprite.texture = self.textureIdle;
				}
			}

			//dont go faster than max speed
			if ( self.velocity._x > self.maxSpeed)
				self.velocity._x = self.maxSpeed;
			if ( self.velocity._x < -self.maxSpeed)
				self.velocity._x = -self.maxSpeed;

			//drag
			if ( self.kEDown === false && self.kWDown === false)
			{
				//scale down the velocity x vector
				self.velocity._x = PLAYER_CONSTS.DRAG * self.velocity._x;
			}
			
			self.sprite.position.x += self.velocity.getX();
			self.sprite.position.y += self.velocity.getY();

			self.updateColliders();

			//apply gravity if not on ground
			if ( self.onGround === false )
			{
				self.wasInAir = true;
				if ( self.kNDown === true ) //apply less gravity if still holding jump
				{ 
					if ( self.velocity._y < 0 )//not falling yet
					{
						self.sprite.texture = self.textureJump1;
						self.velocity._y += PLAYER_CONSTS.GRAV_HOLDING_JUMP_RISING; 
					}
					else if ( self.velocity._y >= 0 ) //although apply the more gravity if we are falling. 
					{
						self.sprite.texture = self.textureJump2;
						self.velocity._y += PLAYER_CONSTS.GRAV_HOLDING_JUMP_FALLING; 	
					}					
				}
				if ( self.kNDown === false ) 
				{
					self.sprite.texture = self.textureJump2;
					self.velocity._y += PLAYER_CONSTS.GRAV;	
				}
			}
			else
			{
				self.wasInAir = false;
			}
		}
	}
}