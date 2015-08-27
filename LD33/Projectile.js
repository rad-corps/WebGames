//FlamingProjectile.js

//from_ and to_ are Point objects {x: , y: }
function Projectile(from_, to_)
{
	var self = this; 

	self.sprite = PIXI.Sprite.fromImage(SITE_PATH + "img/torch.png");

	self.sprite.position.x = from_.x;
	self.sprite.position.y = from_.y;
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.flagForRemoval = false;

	//self.sprite.blendMode = PIXI.blendModes.MULTIPLY;

	//create a direction vector and normalise it
	self.from = vector2.create();
	self.from._x = from_.x;
	self.from._y = from_.y;

	self.extraLift = vector2.create();
	self.extraLift._x = 0;
	self.extraLift._y = Math.random() + 0.2;

	self.to = vector2.create();
	self.to._x = to_.x;
	self.to._y = to_.y;

	self.direction = self.from.subtract(self.to);
	
	self.direction.normalise();
	self.direction.addTo(self.extraLift);

	self.velocity = vector2.create();
	self.velocity = self.direction.multiply(6);

	this.update = function()
	{
		//effect velocity by gravity
		self.velocity._y -= 0.1;

		self.sprite.position.x -= self.velocity._x;
		self.sprite.position.y -= self.velocity._y;
		self.sprite.rotation -= self.direction._x * 0.1;
	}
}