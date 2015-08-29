//Goal.js

function Goal(row_, col_)
{
	var self = this;
	self.sprite = PIXI.Sprite.fromImage("./img/goal.png");
	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;
	
	self.sprite.position.x = col_ * 32;
	self.sprite.position.y = row_ * 32;
}
