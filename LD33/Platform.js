//Platform.js

function Platform(platformType_) {
	var self = this;

	//self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_5.png");

	switch (platformType_)
    {
    	case '1': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_1.png");
        break;

        case '2': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_2.png");
        break;

        case '3': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_3.png");
        break;

        case '4': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_4.png");
        break;

        case '5': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_5.png");
        break;

        case '6': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_6.png");
        break;

        case '7': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_7.png");
        break;

        case '8': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_8.png");
        break;

        case '9': self.sprite = PIXI.Sprite.fromImage("./img/wall_stone_grass_9.png");
        break;

        default: console.log('unknown platform type: ' + platformType_);
    }

	self.sprite.anchor.x = 0.5;
	self.sprite.anchor.y = 0.5;

	this.SetPos = function(x_, y_) {
		self.sprite.x = x_;
		self.sprite.y = y_;
	}
}