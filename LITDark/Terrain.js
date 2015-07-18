
//takes a 2D array 15x15
function Terrain(level_){

	var self = this;
	
	//iterators
	var row = 0;
	var col = 0;
	
	//temp
	var spriteRow = [];
	var tempTile = undefined;
	var tempSprite = undefined;

	//2D array of sprites based on the level passed in
	this.level = level_;
	this.spriteArray = [];


	this.level = level_;

	for (row = 0; row < level_.length; ++row )
	{		
		//empty spriteRow array
		spriteRow = [];

		for (col = 0; col < level_[row].length; ++col )	
		{
			//add one to the spriteRow
			tempTile = level_[row][col];

			if ( tempTile === 0 || tempTile === 1 )
			{
				var terrainNum = col % 2;
				if ( row % 2 === 1){
					if (terrainNum === 0) {
						terrainNum = 1;
					}
					else {
						terrainNum = 0;	
					}
				}
				tempSprite = PIXI.Sprite.fromImage("./img/terrain" + terrainNum + ".png");
			}
			// else if ( tempTile === 1)
			// {
			// 	tempSprite = PIXI.Sprite.fromImage("./img/terrain1.png");
			// }
			else if ( tempTile === 2)
			{
				tempSprite = PIXI.Sprite.fromImage("./img/wall.png");
			}

			//set the position of the sprite
//			tempSprite.anchor.x = 0.5;
//			tempSprite.anchor.y = 0.5;
			tempSprite.position.x = col * 32;
			tempSprite.position.y = row * 32;
			spriteRow.push(tempSprite);			
		}

		this.spriteArray.push(spriteRow);
	}

	//console.log(this.spriteArray);

	this.update = function() { 

	}

	this.getSpriteArray = function(){ 
		return self.spriteArray;
	}

	this.addToStage = function(stage_){
		
		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				stage_.addChild(self.spriteArray[row][col]);	
			}
		}		
	}

	this.walkableTerrain = function(row_, col_)
	{
		if ( self.level[row_][col_] === 2 ) { 
			return false;
		}
		return true;
	}

	this.collidesWith = function(playerSprite_)
	{
		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				if ( self.walkableTerrain(row, col) === false)
				{
					//check for collision
					if ( collisionManager( playerSprite_, self.spriteArray[row][col]) )
					{

						return true;
					}
				}
			}
		}
		return false;
	}
}

function TopLevelTerrain(level_)
{
	var self = this;
	
	//iterators
	var row = 0;
	var col = 0;
	
	//temp
	var spriteRow = [];
	var tempTile = undefined;
	var tempSprite = undefined;

	//2D array of sprites based on the level passed in
	this.level = level_;
	this.spriteArray = [];

	this.distTraveled = 0;

	this.level = level_;
	this.invertDirection = false;

	for (row = 0; row < level_.length; ++row )
	{		
		//empty spriteRow array
		spriteRow = [];

		for (col = 0; col < level_[row].length; ++col )	
		{
			//add one to the spriteRow
			tempTile = level_[row][col];

			if ( tempTile === 0 )
			{
				tempSprite = undefined;
				//tempSprite = PIXI.Sprite.fromImage("./img/terrain0.png");
			}
			else if ( tempTile >= 1 && tempTile <= 6 )
			{
				tempSprite = PIXI.Sprite.fromImage("./img/spikes.png");
			}
			else if ( tempTile === 8 )
			{
				tempSprite = PIXI.Sprite.fromImage("./img/goal.png");
			}
			else if ( tempTile === 9 )
			{
				tempSprite = PIXI.Sprite.fromImage("./img/crate.png");
			}

			if ( tempSprite !== undefined )
			{
				//set the position of the sprite
//				tempSprite.anchor.x = 0.5;
//				tempSprite.anchor.y = 0.5;
				tempSprite.position.x = col * 32;
				tempSprite.position.y = row * 32;
				tempSprite.velocity = vector2.create(0,0);
				tempSprite.speedMulti = 1;
						
			}
			spriteRow.push(tempSprite);	
		}

		this.spriteArray.push(spriteRow);
	}

	this.addToStage = function(stage_){
		
		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				if ( self.spriteArray[row][col] !== undefined )
				{
					stage_.addChild(self.spriteArray[row][col]);	
				}
			}
		}		
	}

	this.walkableTerrain = function(row_, col_)
	{
		if ( self.level[row_][col_] === 0 ) { 
			return true;
		}
		return false;
	}

	this.causesDeathTo = function(playerSprite_)
	{
		var tileType = 0;

		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				tileType = self.level[row][col];
				
				//from 1 to 6 are all rat types
				if ( tileType >= 1 && tileType <= 6)
				{
					//check for collision
					if ( collisionManager( playerSprite_, self.spriteArray[row][col]) )
					{
						return true;
					}
				}
			}
		}
		return false;
	}

	this.moveCrates = function(playerSprite_)
	{
		var tileType = 0;

		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				tileType = self.level[row][col];
				
				//from 1 to 6 are all rat types
				if ( tileType === 9 )
				{
					//check for collision
					if ( collisionManager( playerSprite_, self.spriteArray[row][col]) )
					{						
						//set the velocity to the players velocity.
						self.spriteArray[row][col].velocity = playerSprite_.velocity.getCopy();
						return true;
					}
				}
			}
		}
		return false;
	}

	this.collisionWithCrate = function(playerSprite_){
		var tileType = 0;

		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				tileType = self.level[row][col];
				
				//from 1 to 6 are all rat types
				if ( tileType === 9 )
				{
					//check for collision
					if ( collisionManager( playerSprite_, self.spriteArray[row][col], 0.66) )
					{						
						return true;
					}
				}
			}
		}
		return false;
	}

	this.reachedGoal = function(playerSprite_)
	{
		var tileType = 0;

		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				tileType = self.level[row][col];
				
				//from 1 to 6 are all rat types
				if ( tileType === 8 )
				{
					//check for collision
					if ( collisionManager( playerSprite_, self.spriteArray[row][col]) )
					{						
						return true;
					}
				}
			}
		}
		return false;
	}

	this.checkCollisionWithTerrain = function(terrain_)
	{
		var tileType = 0;

		for (var row = 0; row < self.spriteArray.length; row++)
		{
			for (var col = 0; col < self.spriteArray[row].length; col++)
			{
				tileType = self.level[row][col];

				//check if crates collided with walls.
				if ( tileType === 9)
				{
					if ( terrain_.collidesWith(self.spriteArray[row][col]))
					{
						return true;	
					}
				}
			}
		}
		return false;
	}

	this.update = function(dt_, terrain_)
	{
		var oldX = 0;
		var oldY = 0;
		
		var speed = AH_GLOBALS.WALL_SPEED;
		var tempSprite = undefined;
		// if (self.distTraveled >= 32 )
		// {
		// 	self.invertDirection = !self.invertDirection;
		// 	self.distTraveled = 0;
		// }
		// self.distTraveled += speed;



		//iterate over all tile types		
		for (var row = 0; row < self.level.length; row++)
		{
			for (var col = 0; col < self.level[row].length; col++)
			{
				if ( self.level[row][col] !== 0 )
				{
					tempSprite = self.spriteArray[row][col];
					oldX = tempSprite.position.x;
					oldY = tempSprite.position.y;
				}

				if ( self.level[row][col] === 1 ) //move down
				{
					tempSprite.position.y += speed * tempSprite.speedMulti;
				}
				else if ( self.level[row][col] === 2 ) //move up
				{
					tempSprite.position.y -= speed * tempSprite.speedMulti;
				}
				else if ( self.level[row][col] === 3 ) //move left
				{
					tempSprite.position.x -= speed * tempSprite.speedMulti;
					
				}
				else if ( self.level[row][col] === 4 ) //move right
				{
					tempSprite.position.x += speed * tempSprite.speedMulti;
				}
				else if ( self.level[row][col] === 5 ) //zig zag 1
				{
					if ( self.invertDirection === true)
						self.spriteArray[row][col].position.x += speed;
					if ( self.invertDirection === false)
						self.spriteArray[row][col].position.y -= speed;
				}
				else if ( self.level[row][col] === 6 ) //zig zag 2
				{
					if ( self.invertDirection === true)
						self.spriteArray[row][col].position.x -= speed;
					if ( self.invertDirection === false)
						self.spriteArray[row][col].position.y += speed;
				}	
				else if ( self.level[row][col] === 9 ) //crate
				{					
					oldX = self.spriteArray[row][col].position.x;
					oldY = self.spriteArray[row][col].position.y;

					self.spriteArray[row][col].position.x += self.spriteArray[row][col].velocity._x;
					if ( self.checkCollisionWithTerrain(terrain_) )
						self.spriteArray[row][col].position.x = oldX;

					self.spriteArray[row][col].position.y += self.spriteArray[row][col].velocity._y;
					if ( self.checkCollisionWithTerrain(terrain_) )
						self.spriteArray[row][col].position.y = oldY;

					//drag velocity
					self.spriteArray[row][col].velocity.multiplyBy(0.80);
				}

				//moving spike, check collision and reverse if necessary
				if ( self.level[row][col] >= 1 && self.level[row][col] <= 4) 
				{
					//check if it is colliding with terrain
					if ( terrain_.collidesWith(tempSprite) )
					{
						tempSprite.position.y = oldY;
						tempSprite.position.x = oldX;
						tempSprite.speedMulti = -tempSprite.speedMulti;
					}	
				}
			}
		}
	}
}