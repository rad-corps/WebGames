//GameLoop.js

function GameLoop(){

	var self = this;
	
	//create the renderer
	self.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);
	self.renderer.backgroundColor = 0xE0F0FF;

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();
	//self.bgStage = new PIXI.Container();

	this.init = function(){
		console.log("init");
		console.log(AH_GLOBALS.FPS);

		//load the background and add it to the scene
		self.bgSprite = PIXI.Sprite.fromImage("./img/bg1.jpg");
		self.bgSprite.anchor.x = 0.5;
		self.bgSprite.anchor.y = 0.5;
		self.bgSprite.scale = {x: 2, y: 2};
		self.stage.addChild(self.bgSprite);

		//the list of enemies
		self.enemyArray = [];

		//create a test Enemy
		self.enemyArray.push(new Enemy(12,15));
		self.stage.addChild(self.enemyArray[self.enemyArray.length - 1].sprite);

		//create the player
		self.player = new Player();
		self.player.setPos(levels[0].playerRow, levels[0].playerCol);

		self.platformArray = [];

		//load platforms from level0.platforms
		for (row in levels[0].platforms)
		{
			for (col in levels[0].platforms[row])
			{
				if (levels[0].platforms[row][col] !== '.')
				{
					console.log(levels[0].platforms[row][col]);
					self.platformArray.push(new Platform(levels[0].platforms[row][col]));
					self.platformArray[self.platformArray.length - 1].SetPos(col*32, row*32);
					self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
				}
			}
		}

		//load the goal
		self.goal = new Goal(levels[0].goalRow, levels[0].goalCol);
		self.stage.addChild(self.goal.sprite);
		
		self.stage.addChild(self.player.sprite);
		console.log('init end');
	}


	this.run = function() {
		self.timeSinceAnimate = 0.0;
		self.logTime = 0;
		requestAnimationFrame( this.animate );
	}

	this.animate = function(){

		//calc delta
		var now = Date.now();
		var dt = now - lastUpdate;
		lastUpdate = now;

		//fixed update step (30FPS)
		self.timeSinceAnimate += dt;
		self.logTime += dt;

		//console.log(self.timeSinceAnimate);
		if ( gameState === 'playing' && self.timeSinceAnimate > AH_GLOBALS.FPS) {
			self.timeSinceAnimate -= AH_GLOBALS.FPS;

			//if program is not keeping up report it
			if (self.timeSinceAnimate > AH_GLOBALS.FPS )
			{
				//console.log('PROGRAM IS NOT KEEPING UP WITH TIMESTEP (IGNORE ON STARTUP)!');
			}

			//enemy movement
			for (i in self.enemyArray)
			{
				self.enemyArray[i].update();
			}
			
			//player movement
    		self.player.update();

    		//check collisions with platform
    		self.player.setOnGround(false);

    		//handle player bottom and top collision
			for (i in self.platformArray)
			{	    		
				if ( collisionManager( self.player.bCol, self.platformArray[i].sprite) ) {
	    			//console.log('bottom collider triggered');
	    			self.player.setOnGround(true, self.platformArray[i].sprite);
	    		}
				if ( collisionManager( self.player.tCol, self.platformArray[i].sprite) ) {
	    			//console.log('top collider triggered');
	    			self.player.bumpHead(self.platformArray[i].sprite);
	    		}
			}

			//handle player and enemy side collision
			for (i in self.platformArray)
			{	    
	    		if ( collisionManager( self.player.lCol, self.platformArray[i].sprite) ) {
	    			//console.log('left collider triggered');
	    			self.player.pushAgainstTerrain('left', self.platformArray[i].sprite);
	    		}
				if ( collisionManager( self.player.rCol, self.platformArray[i].sprite) ) {
	    			//console.log('right collider triggered');
	    			self.player.pushAgainstTerrain('right', self.platformArray[i].sprite);
	    		}	

	    		//check for enemy collisions
	    		for ( e in self.enemyArray )
	    		{
	    			//enemy collision with platforms
	    			if ( collisionManager( self.enemyArray[e].sprite, self.platformArray[i].sprite, 0.75) )
	    			{
	    				self.enemyArray[e].changeDirection();
	    			}

	    			//collision with player
	    			if ( collisionManager( self.enemyArray[e].sprite, self.player.sprite, 0.75) )
	    			{
	    				console.log('Game Over');
	    				gameState = 'gameOver';
	    			}
	    		}
	    	}

	    	//handle player goal collision 
	    	if ( collisionManager( self.goal.sprite, self.player.sprite) )
	    	{
	    		console.log('Reached Goal');
	    		gameState = 'loadNewLevel';
	    	}
    	}
    	if  ( gameState === 'gameOver') {
    		self.promptText = new PIXI.Text('GAME OVER', fontStyle);
			self.promptText.position.set(self.player.sprite.position.x, self.player.sprite.position.y);
    		self.stage.addChild(self.promptText);
    		gameState = 'mainMenu';
    	}

    	//update the bg position
    	self.bgSprite.position.x = self.player.sprite.position.x - self.player.sprite.position.x * 0.1;
    	self.bgSprite.position.y = self.player.sprite.position.y - self.player.sprite.position.y * 0.1;

    	//set the stage position to the player position
    	self.stage.position.x = -self.player.sprite.position.x + AH_GLOBALS.SCREEN_W / 2;
    	self.stage.position.y = -self.player.sprite.position.y + AH_GLOBALS.SCREEN_H / 2;
    	
    	//render
    	self.renderer.render(self.stage);	

		//loop again
		requestAnimationFrame( self.animate );

	}
}