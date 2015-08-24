//GameLoop.js

function GameLoop(){

	var self = this;
	
	//create the renderer
	self.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);
	self.renderer.backgroundColor = 0xE0F0FF;

	self.currentLevel = 0;
	self.kSpace = keyboard(32);
	self.kR = keyboard(82);
	self.kEsc = keyboard(27);
	self.kTee = keyboard(84);

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
		if ( self.deactivateSpace === false )
		{
			if (gameState === 'waitingToAdvance')
			{
				gameState = 'loadNewLevel';
				soundMainMenu.stop();
				soundGameBG.stop();
			}
		}
	}

	this.kR.press = function() {
		if (gameState === 'waitingToAdvance')
		{
			gameState = 'loadNewLevel';
			soundMainMenu.stop();
			soundGameBG.stop();
			self.currentLevel--;
		}
	}

	this.kEsc.press = function() {
		if (gameState === 'waitingToAdvance' || gameState === 'gameComplete')
		{
			self.cleanStage();			
			gameState = 'showMainMenu';
		}
	}

	this.kTee.press = function(){
		console.log('self.player pos x: ' + self.player.sprite.position.x + ' y: ' + self.player.sprite.position.y);
		console.log('self.stage pos x: ' + -self.stage.position.x + ' y: ' + -self.stage.position.y);
		console.log('self.stage bound x: ' + (-self.stage.position.x  + AH_GLOBALS.SCREEN_W) + ' y: ' + (-self.stage.position.y + AH_GLOBALS.SCREEN_H));
		console.log('enemy pos x: ' + self.enemyArray[0].sprite.position.x + ' y: ' + self.enemyArray[0].sprite.position.y);

	}

	this.init = function(){

		//load the background and add it to the scene
		self.bgSprite = PIXI.Sprite.fromImage("./img/bg1.jpg");
		self.bgSprite.anchor.x = 0.5;
		self.bgSprite.anchor.y = 0.5;
		self.bgSprite.scale = {x: 2, y: 2};
		self.stage.addChild(self.bgSprite);
		
		self.deactivateSpace = true;


		//the list of enemies
		self.enemyArray = [];

		//create the player
		self.player = new Player();
		self.player.setPos(levels[self.currentLevel].playerRow, levels[self.currentLevel].playerCol);

		//create the platform array
		self.platformArray = [];

		//create the projectile array
		self.projectileArray = [];

		//create the flame array
		self.flameArray = [];

		//set the world height
		self.worldHeight = levels[self.currentLevel].platforms.length * 32;
		self.worldWidth = levels[self.currentLevel].platforms[0].length * 32;

		//load platforms from level0.platforms
		for (row in levels[self.currentLevel].platforms)
		{
			for (col in levels[self.currentLevel].platforms[row])
			{
				if (levels[self.currentLevel].platforms[row][col] !== '.'
					&& levels[self.currentLevel].platforms[row][col] !== 'e'
					)
				{
					self.platformArray.push(new Platform(levels[self.currentLevel].platforms[row][col]));
					self.platformArray[self.platformArray.length - 1].SetPos(col*32, row*32);
					self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
				}
				else if (levels[self.currentLevel].platforms[row][col] == 'e')
				{
					self.enemyArray.push(new Enemy(row, col, self.player.sprite.position));
					self.stage.addChild(self.enemyArray[self.enemyArray.length - 1].sprite);
				}
			}
		}

		//load the goal
		self.goal = new Goal(levels[self.currentLevel].goalRow, levels[self.currentLevel].goalCol);
		self.stage.addChild(self.goal.sprite);
		
		self.stage.addChild(self.player.sprite);

		//current time variable and text
		self.currentTime = 0.0;
		self.timeText = new PIXI.Text('time: ' + self.currentTime, timeFont);
		self.stage.addChild(self.timeText);

		//par time variable and text
		self.parTime = levels[self.currentLevel].parTime;
		self.parText = new PIXI.Text('PAR: ' + (self.parTime / 1000).toFixed(2), timeParFont);
		self.stage.addChild(self.parText);

		self.timeText.text = 'TIME: ' + (self.currentTime / 1000).toFixed(2);
	}


	this.run = function() {
		self.timeSinceAnimate = 0.0;
		self.logTime = 0;
		requestAnimationFrame( this.animate );
	}

	this.gameOver = function() {
	    gameState = 'gameOver';
	}

	this.isOnScreen = function(position_)
	{
		//work out screen boundaries
		if (position_.x < -self.stage.position.x
			|| position_.x > -self.stage.position.x + AH_GLOBALS.SCREEN_W
			|| position_.y < -self.stage.position.y 
			|| position_.y > -self.stage.position.y + AH_GLOBALS.SCREEN_H)
		{
			return false;
		}
		return true;
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
			self.promptText.position.set(340, 320);
    		self.stage.addChild(self.promptText);

			self.currentLevel = 0;
    		gameState = 'waitingToAdvance';
    		self.deactivateSpace = false;
    		soundMainMenu.play();
		}

		if (gameState === 'levelComplete')
		{

			self.textArray = [];

			self.textArray.push(new PIXI.Text('PRESS SPACEBAR TO ADVANCE', fontStyle));
			self.textArray.push(new PIXI.Text('PRESS R TO RETRY LEVEL', fontStyle));
			self.textArray[0].position.set(self.player.sprite.position.x - 300, self.player.sprite.position.y - 70);
			self.textArray[1].position.set(self.player.sprite.position.x - 260, self.player.sprite.position.y - 110);

			if ( self.currentTime <= self.parTime ) 
			{
				self.textArray.push(new PIXI.Text('GREAT TIME!', fontStyle));
				self.textArray[2].position.set(self.player.sprite.position.x - 160, self.player.sprite.position.y - 150);
			}

			for (i in self.textArray)
			{
				self.stage.addChild(self.textArray[i]);
			}

			self.deactivateSpace = false;
			gameState = 'waitingToAdvance';
		}

		if ( gameState === 'loadNewLevel' && self.timeSinceAnimate > AH_GLOBALS.FPS) {
			gameState = 'playing';
			self.cleanStage();

			//If Game Complete		
			if ( self.currentLevel === levels.length )
			{
				gameState = 'gameComplete';

				self.stage.position.x = 0;
				self.stage.position.y = 0;
				//load the game_complete sprite and display
				self.gameCompleteSprite = PIXI.Sprite.fromImage("./img/game_complete.png");
				self.gameCompleteSprite.position.x = 0;
				self.gameCompleteSprite.position.y = 0;
				self.stage.addChild(self.gameCompleteSprite);

				self.pixiText = [];

				var yOffset = 35;
				var xOffset = -60;

				

				self.pixiText.push(new PIXI.Text('PROGRAMMING ', creditFont));
				self.pixiText.push(new PIXI.Text('ADAM HULBERT', creditFont));
				self.pixiText.push(new PIXI.Text('adamhportfolio.com', creditFont));
				self.pixiText.push(new PIXI.Text('ART', creditFont));
				self.pixiText.push(new PIXI.Text('JAVIER MUNOZ', creditFont));
				self.pixiText.push(new PIXI.Text('javier.munoz@students.aie.edu.au', creditFont));
				self.pixiText.push(new PIXI.Text('SOUND DESIGN', creditFont));
				self.pixiText.push(new PIXI.Text('GERANT KENNETH', creditFont));
				self.pixiText.push(new PIXI.Text('gerantgerant.com', creditFont));
				self.pixiText.push(new PIXI.Text(AH_GLOBALS.GAME_TITLE, fontStyle));
				self.pixiText.push(new PIXI.Text('ESC - MAIN MENU', fontStyle));
				
				self.pixiText[0].position.set(423 + xOffset, 60 + yOffset);				
				self.pixiText[1].position.set(420 + xOffset, 80 + yOffset);				
				self.pixiText[2].position.set(418 + xOffset, 100 + yOffset);
				self.pixiText[3].position.set(464 + xOffset, 140  + yOffset );				
				self.pixiText[4].position.set(425 + xOffset, 160 + yOffset );				
				self.pixiText[5].position.set(380 + xOffset, 180 + yOffset );
				self.pixiText[6].position.set(425 + xOffset, 220 + yOffset );				
				self.pixiText[7].position.set(410 + xOffset, 240 + yOffset );				
				self.pixiText[8].position.set(429 + xOffset, 260 + yOffset );
				self.pixiText[9].position.set(360 + xOffset, 40 );
				self.pixiText[10].position.set(325 + xOffset, 330 );
				
				for ( i in self.pixiText )
				{					
					self.stage.addChild(self.pixiText[i]);
				}
			}
			else
			{	
				self.init();
				self.currentLevel++;
				soundGameBG.play();			
			}
		}

		if ( gameState === 'playing' && self.timeSinceAnimate > AH_GLOBALS.FPS) {
			self.timeSinceAnimate -= AH_GLOBALS.FPS;
			self.currentTime += AH_GLOBALS.FPS;

			//show current time
			self.timeText.text = 'TIME: ' + (self.currentTime / 1000).toFixed(2);

			//set colour if par has lapsed
			if ( self.currentTime > self.parTime)
			{
				self.timeText.style = timeLateFont;
			}
			

			//if program is not keeping up report it
			if (self.timeSinceAnimate > AH_GLOBALS.FPS )
			{
				//console.log('PROGRAM IS NOT KEEPING UP WITH TIMESTEP (IGNORE ON STARTUP)!');
			}

			//enemy movement
			for (i in self.enemyArray)
			{
				if ( self.isOnScreen(self.enemyArray[i].sprite.position) )
				{
					self.enemyArray[i].update();

					//do we need to throw a projectile at the player?
					if ( self.enemyArray[i].readyToThrowProjectile === true )
					{
						//throw the projectile
						self.projectileArray.push(new Projectile(self.enemyArray[i].sprite.position, self.player.sprite.position));
						self.stage.addChild(self.projectileArray[self.projectileArray.length - 1].sprite);
						soundThrowTorch.play();
						//turn off the enemy readyness var
						self.enemyArray[i].readyToThrowProjectile = false;
					}
				}
			}
			
			//player movement
    		self.player.update();

    		//update flames
    		for (i in self.flameArray)
    		{
    			self.flameArray[i].update();
    		}

    		//remove flames flagged for deletion
    		for(var i = self.flameArray.length - 1; i >= 0; i--) 
    		{
    			if(self.flameArray[i].flaggedForRemoval === true) 
    			{
    				self.stage.removeChild(self.flameArray[i].sprite);
       				self.flameArray.splice(i, 1);
    			}
			}

    		//projectile movement
    		for (i in self.projectileArray)
    		{
    			self.projectileArray[i].update();

    			for (t in self.platformArray)
    			{
    				//if projectile collides with platform 
    				if ( collisionManager(self.platformArray[t].sprite, self.projectileArray[i].sprite, 0.5)  )
    				{
    					//create a flame in its place
    					self.flameArray.push(new Flame(self.projectileArray[i].sprite.position, self.projectileArray[i].sprite.rotation));
    					self.stage.addChild(self.flameArray[self.flameArray.length - 1].sprite);

    					soundTerrainFlame.play();

    					//flag it for removal
    					self.projectileArray[i].flagForRemoval = true;
    					self.stage.removeChild(self.projectileArray[i].sprite);

    				}
    			}
    		}

    		//remove projectiles flagged for removal
    		for(var i = self.projectileArray.length - 1; i >= 0; i--) 
    		{
    			if(self.projectileArray[i].flagForRemoval === true) 
    			{
       				self.projectileArray.splice(i, 1);
    			}
			}

    		
    		//check if projectile collided with player
    		for (i in self.projectileArray)
    		{
    			if ( collisionManager(self.player.sprite, self.projectileArray[i].sprite, 0.75))
    			{
    				self.gameOver();
					soundSpikeFire.play();
    			}
    		}

    		//check if flame collided with player
    		for (i in self.flameArray)
    		{
    			if ( collisionManager(self.player.sprite, self.flameArray[i].sprite, 0.75))
    			{
    				self.gameOver();
					soundSpikeFire.play();
    			}
    		}

    		//check collisions with platform
    		self.player.setOnGround(false);

    		//handle player bottom and top collision
			for (i in self.platformArray)
			{	    
				if (self.platformArray[i].spike === false ) 		
				{
					if ( collisionManager( self.player.bCol, self.platformArray[i].sprite) ) {

		    			//console.log('bottom collider triggered');
		    			self.player.setOnGround(true, self.platformArray[i].sprite);
		    		}
					if ( collisionManager( self.player.tCol, self.platformArray[i].sprite) ) {
		    			//console.log('top collider triggered');
		    			self.player.bumpHead(self.platformArray[i].sprite);
		    			soundHeadBump.play();
		    		}
		    	}
			}

			//handle player and enemy collision with platforms
			for (i in self.platformArray)
			{	    
				//handle player left/right collision with platforms
				if (self.platformArray[i].spike === false ) 	
				{
		    		if ( collisionManager( self.player.lCol, self.platformArray[i].sprite) ) {
		    			//console.log('left collider triggered');
		    			self.player.pushAgainstTerrain('left', self.platformArray[i].sprite);
		    		}
					if ( collisionManager( self.player.rCol, self.platformArray[i].sprite) ) {
		    			//console.log('right collider triggered');
		    			self.player.pushAgainstTerrain('right', self.platformArray[i].sprite);
		    		}	
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
	    		//is it a spike?
	    		if (self.platformArray[i].spike === true ) 
	    		{
	    			if (collisionManager( self.player.sprite, self.platformArray[i].sprite, 0.75))
	    			{
	    				self.gameOver();
	    				soundSpikeDeath.play();
	    			}
	    		}
	    	}

	    	
	    	//check if enemy needs to turn around due to an edge
	    	for (e in self.enemyArray)
	    	{
	    		var enemyLColOnGround = false;
	    		var enemyRColOnGround = false;


	    		for ( i in self.platformArray )
	    		{
		    		if (collisionManager( self.enemyArray[e].blCol, self.platformArray[i].sprite) )
	    			{
	    				enemyLColOnGround = true;
	    			}
	    			if (collisionManager( self.enemyArray[e].brCol, self.platformArray[i].sprite) )
	    			{
	    				enemyRColOnGround = true;
	    			}
	    		}

	    		if (enemyLColOnGround === false || enemyRColOnGround === false)
	    		{
	    			self.enemyArray[e].changeDirection();
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
	    		//gameState = 'loadNewLevel';
	    		gameState = 'levelComplete';
	    		soundMainMenu.stop();
	    		soundGameBG.stop();
	    		soundGoal.play();

	    	}
    	}
    	if  ( gameState === 'gameOver') {
    		self.promptText = new PIXI.Text('GAME OVER', fontStyle);
			self.promptText2 = new PIXI.Text('R - RESTART LEVEL', fontStyle);
			self.promptText3 = new PIXI.Text('ESC - EXIT TO MENU ', fontStyle);
			
			self.promptText.position.set(self.player.sprite.position.x - 120, self.player.sprite.position.y - 70);
			self.promptText2.position.set(self.player.sprite.position.x - 180, self.player.sprite.position.y + 30);
			self.promptText3.position.set(self.player.sprite.position.x - 185, self.player.sprite.position.y + 80);

    		self.stage.addChild(self.promptText);
    		self.stage.addChild(self.promptText2);
    		self.stage.addChild(self.promptText3);
    		
    		//self.currentLevel--;
    		gameState = 'waitingToAdvance';
    		self.deactivateSpace = true;
    		soundGameBG.stop();
    	}

    	//update the bg position


    	//set the stage position to the player position
    	if ( gameState === 'playing')
    	{
	    	self.bgSprite.position.x = self.player.sprite.position.x - self.player.sprite.position.x * 0.1;
    		self.bgSprite.position.y = (self.player.sprite.position.y - self.player.sprite.position.y * 0.1);	    	

	    	self.stage.position.x = -self.player.sprite.position.x + AH_GLOBALS.SCREEN_W / 2;
	    	self.stage.position.y = -self.player.sprite.position.y + AH_GLOBALS.SCREEN_H / 2;

	    	self.timeText.position.set(-self.stage.position.x + 10, -self.stage.position.y + 10);
	    	self.parText.position.set(-self.stage.position.x + 20, -self.stage.position.y + 40);
	    }

    	
    	//render
    	self.renderer.render(self.stage);	

		//loop again
		requestAnimationFrame( self.animate );

	}
}