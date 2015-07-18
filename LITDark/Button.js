//Button.js

function Button(buttonDefinition_){
	var self = this;
	self.buttonDefinition = buttonDefinition_;

	self.sprite = PIXI.Sprite.fromImage("./img/button0.png");
	self.sprite.position.set((buttonDefinition_.col * 32) + 16, (buttonDefinition_.row * 32) + 16);

	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;

	self.buttonDown = false;

	this.collidesWith = function(sprite_)
	{
		if ( collisionManager( sprite_, self.sprite) ){
			return true;
		}
		return false;
	}
}