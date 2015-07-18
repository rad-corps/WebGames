//Button.js

function Button(buttonDefinition_){
	var self = this;
	self.buttonDefinition = buttonDefinition_;

	self.sprite = PIXI.Sprite.fromImage("./img/button0.png");
	self.sprite.position.set(buttonDefinition_.col * 32, buttonDefinition_.row * 32);
	self.buttonDown = false;

	this.collidesWith = function(sprite_)
	{
		if ( collisionManager( sprite_, self.sprite) ){
			return true;
		}
		return false;
	}
}