//Enemy.js

//playerPosition is a reference to the playerPosition
function Enemy(row_, col_, playerPosition_)
{
	var self = this;

	self.playerPosition = playerPosition_; //this should be a reference

	self.timeSinceProjectileThrown = 0;
	self.animationTime = Math.random() * 200; //randomise between 0 and 200
	self.animationNum = 0;
	self.whenNextProjectileWillBeThrown = 0;
	self.pauseTime = 0;
	self.readyToThrowProjectile = false;
	self.pauseToThrowProjectile = false;

	self.sprite = PIXI.Sprite.fromImage("./img/enemy_run1.png");
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.position.x = col_ * 32;
	self.sprite.position.y = row_ * 32;
	self.lastX;

	//enemy textures
	self.textures = [];
	self.textures.push(PIXI.Texture.fromImage("./img/enemy_run1.png"));
	self.textures.push(PIXI.Texture.fromImage("./img/enemy_run2.png"));
	self.textures.push(PIXI.Texture.fromImage("./img/enemy_throw1.png"));
	self.textures.push(PIXI.Texture.fromImage("./img/enemy_throw2.png"));

	//create bottom left/bottom right enemy colliders (detect when about to step off an edge)
	self.blCol = {};
	self.brCol = {};

	self.blCol.height = 1;
	self.blCol.width = 1;
	self.blCol.position = {x : 0, y : 0};

	self.brCol.height = 1;
	self.brCol.width = 1;
	self.brCol.position = {x : 0, y : 0};

	self.direction = 'left'; //can be left or right

	this.randomiseProjectileFrequency = function()
	{
		//number between 2 and 5
		self.whenNextProjectileWillBeThrown = (Math.random() * 2000) + 1000;
		console.log(self.whenNextProjectileWillBeThrown);
	}

	self.randomiseProjectileFrequency();

	this.updateColliders = function()
	{
		self.blCol.position.x = self.sprite.position.x - 16;
		self.blCol.position.y = self.sprite.position.y + 18;
		self.brCol.position.x = self.sprite.position.x + 16;
		self.brCol.position.y = self.sprite.position.y + 18;
	}

	this.update = function(environment_)
	{
		self.timeSinceProjectileThrown += AH_GLOBALS.FPS;
		self.animationTime += AH_GLOBALS.FPS;

		//while pausing to throw the projectile
		if ( self.pauseToThrowProjectile === true )
		{
			self.pauseTime += AH_GLOBALS.FPS;
			if ( self.pauseTime > 400 )
			{

				console.log('throw projectile');
				self.pauseToThrowProjectile = false;
				self.readyToThrowProjectile = true;
				self.timeSinceProjectileThrown = 0;
				self.randomiseProjectileFrequency();
			}
		}
		else //normal patrolling state
		{
			if ( self.direction === 'left' )
			{
				self.sprite.scale.x = -1; //flip sprite
			}
			else
			{
				self.sprite.scale.x = 1; //flip sprite	
			}

			if ( self.animationTime > 400)
			{
				self.animationTime = 0;
				++self.animationNum;
				self.sprite.texture = self.textures[self.animationNum % 2];
			}

			if ( self.timeSinceProjectileThrown > self.whenNextProjectileWillBeThrown )
			{
				//throw projectile
				console.log('pause to throw projectile');
				self.pauseToThrowProjectile = true;				
				self.pauseTime = 0;
				self.sprite.texture = self.textures[2];

				//evaluate flippage of sprite based on position and player position
				var dirToPlayer = self.playerPosition.x - self.sprite.position.x;

				//if dir is positive then scale 1 else scale -1
				if ( dirToPlayer > 0 )
				{
					self.sprite.scale.x = 1;
				}
				else
				{
					self.sprite.scale.x = -1;
				}

			}


			self.lastX = self.sprite.x;

			if (self.direction === 'left')
				self.sprite.x -= 1;
			else
				self.sprite.x += 1;

			self.updateColliders();		
		}
	}

	this.changeDirection = function()
	{
		self.sprite.x = self.lastX;

		if ( self.direction === 'left')
		{
			self.direction = 'right';
		}
		else
		{
			self.direction = 'left';
		}
	}
}