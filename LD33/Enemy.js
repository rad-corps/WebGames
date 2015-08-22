//Enemy.js

function Enemy(row_, col_)
{
	var self = this;
	self.sprite = PIXI.Sprite.fromImage("./img/enemy.png");
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.position.x = col_ * 32;
	self.sprite.position.y = row_ * 32;
	self.lastX;


	self.direction = 'left'; //can be left or right

	this.update = function(environment_)
	{
		self.lastX = self.sprite.x;

		if (self.direction === 'left')
			self.sprite.x -= 1;
		else
			self.sprite.x += 1;
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