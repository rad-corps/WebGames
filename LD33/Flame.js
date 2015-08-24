//Flame.js


//pos is a Point {x: , y: }
function Flame(pos_, rotation_)
{
	var self = this;

	//preload textures
	self.textures = [];
	self.textures.push(PIXI.Texture.fromImage("./img/flame1.png"));
	self.textures.push(PIXI.Texture.fromImage("./img/flame2.png"));



	self.sprite = PIXI.Sprite.fromImage("./img/flame.png");
	self.sprite.position.x = pos_.x;
	self.sprite.position.y = pos_.y;
	self.timeSinceCreation = 0;
	self.animTime = 0;
	self.animNum = 0;
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	self.sprite.rotation = rotation_;



	self.sprite.blendMode = PIXI.blendModes.ADD;
	//self.sprite.blendMode = PIXI.blendModes.MULTIPLY;
	//self.sprite.blendMode = PIXI.blendModes.SCREEN;

	self.flaggedForRemoval = false;

	this.update = function()
	{
		self.timeSinceCreation += AH_GLOBALS.FPS;	
		self.animTime += AH_GLOBALS.FPS;

		if ( self.animTime > 150 )	
		{
			self.animTime = 0;
			self.animNum++;
		}

		self.sprite.texture = self.textures[self.animNum%2];

		if ( self.timeSinceCreation > 1200 )
		{
			console.log('flame flaggedForRemoval');
			self.flaggedForRemoval = true;
		}
	}
}
