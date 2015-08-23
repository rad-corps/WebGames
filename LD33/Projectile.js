//FlamingProjectile.js

//from_ and to_ are Point objects {x: , y: }
function Projectile(from_, to_)
{
	var self = this; 

	self.sprite = PIXI.Sprite.fromImage("./img/torch.png");

	self.sprite.position.x = from_.x;
	self.sprite.position.y = from_.y;
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;

	this.update = function()
	{
		self.sprite.position.x -= 1;
	}
}