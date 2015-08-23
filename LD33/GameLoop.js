//GameLoop.js

function GameLoop(){

	var self = this;
	
	//create the renderer
	self.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);
	self.renderer.backgroundColor = 0xE0F0FF;

	self.currentLevel = 0;
	self.kSpace = keyboard(32);
	self.kEsc = keyboard(27);

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();
	//self.bgStage = new PIXI.Container();

	this.cleanStage = function() {
		while(self.stage.children.length > 0)
		{ 
  			var child = self.stage.getChildAt(0);
  			self.stage.removeChild(child);
		}
		self.player = {};		
	}

	this.kSpace.press = function() {
		console.log('space pressed');
		console.log(gameState);
		if (gameState === 'waitingToAdvance')
		{
			console.log('space pressed');
			gameState = 'loadNewLevel';
		}
	}

	this.kEsc.press = function() {
		console.log('esc pressed');
		if (gameState === 'waitingToAdvance')
		{
			self.cleanStage();			
			gameState = 'showMainMenu';
		}
	}

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

		// //create a test Enemy
		// self.enemyArray.push(new Enemy(12,15));
		// self.stage.addChild(self.enemyArray[self.enemyArray.length - 1].sprite);

		//create the player
		self.player = new Player();
		self.player.setPos(levels[self.currentLevel].playerRow, levels[self.currentLevel].playerCol);

		self.platformArray = [];

		//set the world height
		self.worldHeight = levels[self.currentLevel].platforms.length * 32;
		console.log('worldHeight: ' + self.worldHeight);

		//load platforms from level0.platforms
		for (row in levels[self.currentLevel].platforms)
		{
			for (col in levels[self.currentLevel].platforms[row])
			{
				if (levels[self.currentLevel].platforms[row][col] !== '.'
					&& levels[self.currentLevel].platforms[row][col] !== 'e'
					)
				{
					//console.log(levels[self.currentLevel].platforms[row][col]);
					self.platformArray.push(new Platform(levels[self.currentLevel].platforms[row][col]));
					self.platformArray[self.platformArray.length - 1].SetPos(col*32, row*32);
					self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
				}
				else if (levels[self.currentLevel].platforms[row][col] == 'e')
				{
					self.enemyArray.push(new Enemy(row, col));
					self.stage.addChild(self.enemyArray[self.enemyArray.length - 1].sprite);
				}
			}
		}

		//load the goal
		self.goal = new Goal(levels[self.currentLevel].goalRow, levels[self.currentLevel].goalCol);
		self.stage.addChild(self.goal.sprite);
		
		self.stage.addChild(self.player.sprite);
		console.log('init end');
	}


	this.run = function() {
		self.timeSinceAnimate = 0.0;
		self.logTime = 0;
		requestAnimationFrame( this.animate );
	}

	this.gameOver = function() {
		console.log('Game Over');
	    gameState = 'gameOver';
	}

	this.animate = function(){

		//calc delta
		var now = Date.now();
		var dt = now - lastUpdate;
		lastUpdate = now;

		//fixed update step (30FPS)
		self.timeSinceAnimate += dt;
		self.logTime += dt;

		if ( gameState === 'showMainMenu')
		{
			self.stage.position.x = 0;
			self.stage.position.y = 0;
			//show main menu bg image
			self.mainMenuSprite = PIXI.Sprite.fromImage("./img/mainMenu.png");
			self.mainMenuSprite.position.x = 0;
			self.mainMenuSprite.position.y = 0;
			//self.mainMenuSprite.anchor.x = 0.5;
			//self.mainMenuSprite.anchor.y = 0.5;
			self.stage.addChild(self.mainMenuSprite);


			//add main menu text
			self.promptText = new PIXI.Text('PRESS SPACE TO START', fontStyle);
			self.promptText.position.set(220, 100);
    		self.stage.addChild(self.promptText);

			self.currentLevel = 0;
    		gameState = 'waitingToAdvance';
		}

		if (gameState === 'levelComplete')
		{
			self.promptText = new PIXI.Text('PRESS SPACEBAR TO ADVANCE', fontStyle);
			self.promptText.position.set(self.player.sprite.position.x, self.player.sprite.position.y);
			self.stage.addChild(self.promptText);
			gameState = 'waitingToAdvance';
		}

		if ( gameState === 'loadNewLevel' && self.timeSinceAnimate > AH_GLOBALS.FPS) {
			gameState = 'playing';
			self.cleanStage();

			//TODO: check for self.currentLevel === window.levels.length			
			self.init();
			self.currentLevel++;
		}

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

			//handle player and enemy collision with platforms
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

	    		//check for enemy collisions with platforms
	    		for ( e in self.enemyArray )
	    		{
	    			//enemy collision with platforms
	    			if ( collisionManager( self.enemyArray[e].sprite, self.platformArray[i].sprite, 0.75) )
	    			{
	    				self.enemyArray[e].changeDirection();
	    			}
	    		}
	    	}

	    	//check for player collision with spike
	    	for (i in self.platformArray)
	    	{
	    		if (self.platformArray[i].spike === true ) 
	    		{
	    			if (collisionManager( self.player.sprite, self.platformArray[i].sprite))
	    			{
	    				self.gameOver();
	    				soundSpikeDeath.play();
	    			}
	    		}
	    	}

	    	//check if player has fallen through the world
			if ( self.player.sprite.position.y > self.worldHeight + 300 )
			{
				soundFallThrough.play();
				self.gameOver();
			}

	    	//enemy collision with player
	    	for ( e in self.enemyArray )
	    	{
    			//enemy collision with player
    			if ( collisionManager( self.enemyArray[e].sprite, self.player.sprite, 0.75) )
    			{
    				self.gameOver();
    				soundHitByEnemy.play();
    			}
	    	}

	    	//handle player goal collision 
	    	if ( collisionManager( self.goal.sprite, self.player.sprite) )
	    	{
	    		console.log('Reached Goal');
	    		//gameState = 'loadNewLevel';
	    		gameState = 'levelComplete';
	    		soundGoal.play();
	    	}
    	}
    	if  ( gameState === 'gameOver') {
    		self.promptText = new PIXI.Text('GAME OVER', fontStyle);
			self.promptText2 = new PIXI.Text('SPACE - RESTART LEVEL', fontStyle);
			self.promptText3 = new PIXI.Text('ESC - EXIT TO MENU ', fontStyle);
			
			self.promptText.position.set(self.player.sprite.position.x - 200, self.player.sprite.position.y);
			self.promptText2.position.set(self.player.sprite.position.x - 200, self.player.sprite.position.y + 40);
			self.promptText3.position.set(self.player.sprite.position.x - 200, self.player.sprite.position.y + 80);

    		self.stage.addChild(self.promptText);
    		self.stage.addChild(self.promptText2);
    		self.stage.addChild(self.promptText3);
    		
    		self.currentLevel--;
    		gameState = 'waitingToAdvance';
    	}

    	//update the bg position


    	//set the stage position to the player position
    	if ( gameState === 'playing')
    	{
	    	self.bgSprite.position.x = self.player.sprite.position.x - self.player.sprite.position.x * 0.1;
    		self.bgSprite.position.y = self.player.sprite.position.y - self.player.sprite.position.y * 0.1;	    	

	    	self.stage.position.x = -self.player.sprite.position.x + AH_GLOBALS.SCREEN_W / 2;
	    	self.stage.position.y = -self.player.sprite.position.y + AH_GLOBALS.SCREEN_H / 2;
	    }

    	
    	//render
    	self.renderer.render(self.stage);	

		//loop again
		requestAnimationFrame( self.animate );

	}
}