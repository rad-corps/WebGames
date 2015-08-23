//Enemy.js

function Enemy(row_, col_)
{
	var self = this;

	self.timeSinceProjectileThrown = 0;
	self.whenNextProjectileWillBeThrown = 0;
	self.readyToThrowProjectile = false;

	self.sprite = PIXI.Sprite.fromImage("./img/enemy.png");
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.position.x = col_ * 32;
	self.sprite.position.y = row_ * 32;
	self.lastX;

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
		if ( self.timeSinceProjectileThrown > self.whenNextProjectileWillBeThrown )
		{
			//throw projectile
			console.log('throw projectile');
			self.readyToThrowProjectile = true;
			self.randomiseProjectileFrequency();
			self.timeSinceProjectileThrown = 0;
		}


		self.lastX = self.sprite.x;

		if (self.direction === 'left')
			self.sprite.x -= 1;
		else
			self.sprite.x += 1;

		self.updateColliders();		
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