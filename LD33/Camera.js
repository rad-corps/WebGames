//Camera.js

var tempPlayerWorldX;
var tempPlayerWorldY;

function applyCamera(player_, platformArray_)
{
	//where is the player? 
	var tempPlayerWorldX = player_.sprite.position.x;
	var tempPlayerWorldY = player_.sprite.position.y;

	//move all the platforms in relation to the player
	for (i in platformArray_) 
	{
		platformArray_[i].sprite.position.x += tempPlayerWorldX;
		platformArray_[i].sprite.position.y += tempPlayerWorldY;
	}

	//set the player to the centre of the screen 
	player_.sprite.position.x = AH_GLOBALS.SCREEN_W / 2;
	player_.sprite.position.y = AH_GLOBALS.SCREEN_H / 2;

}

function reapplyWorldPositions(player_, platformArray_)
{
	player_.sprite.position.x = tempPlayerWorldX;
	player_.sprite.position.y = tempPlayerWorldY;

	for (i in platformArray_) 
	{
		platformArray_[i].sprite.position.x -= tempPlayerWorldX;
		platformArray_[i].sprite.position.y -= tempPlayerWorldY;
	}
}