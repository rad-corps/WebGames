//Platform.js

function Platform() {
	var self = this;
	self.sprite = PIXI.Sprite.fromImage("./img/ground.png");

	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;

	this.SetPos = function(x_, y_) {
		self.sprite.x = x_;
		self.sprite.y = y_;
	}
}