//Flame.js


//pos is a Point {x: , y: }
function Flame(pos_, rotation_)
{
	var self = this;
	self.sprite = PIXI.Sprite.fromImage("./img/torch.png");
	self.sprite.position.x = pos_.x;
	self.sprite.position.y = pos_.y;
	self.timeSinceCreation = 0;
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.rotation = rotation_;

	//self.sprite.blendMode = PIXI.blendModes.ADD;
	//self.sprite.blendMode = PIXI.blendModes.MULTIPLY;
	//self.sprite.blendMode = PIXI.blendModes.SCREEN;

	self.flaggedForRemoval = false;

	this.update = function()
	{
		self.timeSinceCreation += AH_GLOBALS.FPS;		

		if ( self.timeSinceCreation > 1200 )
		{
			console.log('flame flaggedForRemoval');
			self.flaggedForRemoval = true;
		}
	}
}
