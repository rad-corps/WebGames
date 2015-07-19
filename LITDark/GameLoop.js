function GameLoop(){

	var self = this;
	
	//create the renderer
	this.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();

	//add a keyboard listener for escape key
	self.kEsc = keyboard(27);
	self.kSpace = keyboard(32);

	//key listeners
	this.kEsc.press = function() {
		soundPlayerDeath.play();
		self.setGameOverState();
		startLevel();
	}
	this.kEsc.release = function() {				
	}

	this.kSpace.press = function() {
		if  (gameState === 'gameOver' )
			startLevel();
	}

	this.clean = function()
	{
		self.level = null;
		self.player = null;
		self.terrain = null;
		self.topTerrain = null;
		self.buttons = [];		
	}



	this.resetGame = function() {
		while(self.stage.children[0]) { self.stage.removeChild(self.stage.children[0]); }

		// //reset all buttons
		// self.buttons = [];
		// self.terrain = {};
	}

	this.init = function(level_){

		self.resetGame();

		self.timeElapsed = 0.0;
		self.speachRemoved = false;

		//remove all the menu stuff
		self.stage.removeChild(self.promptText);
		self.stage.removeChild(self.promptText1);
		self.stage.removeChild(self.promptText2);
		self.stage.removeChild(self.promptText3);
		self.stage.removeChild(self.menuSprite);


		//setup game objects
		self.level = level_;
		self.player = new Player(level_.playerPos.row, level_.playerPos.col, level_.playerText, level_.textAnchor);
		self.terrain = new Terrain(self.level.levelBottom);
		self.topTerrain = new TopLevelTerrain(self.level.levelTop);
		self.buttons = [];
		//iterate over all buttons in level_
		for ( var i = 0; i < level_.buttons.length; ++i)
		{
			self.buttons.push(new Button(level_.buttons[i]));
		}
		
		//add sprites to stage
		self.terrain.addToStage(self.stage);

		//add buttons
		for ( var i = 0; i < self.buttons.length; ++i)
		{
			self.stage.addChild(self.buttons[i].sprite);
		}

		//add top terrain (spikes, crates)
		self.topTerrain.addToStage(self.stage);		
		//add player to stage
		self.stage.addChild(this.player.sprite);
		self.stage.addChild(this.player.speachText);
	}

	this.run = function() {
		requestAnimationFrame( this.animate );
	}

	this.setGameOverState = function() {
		gameState = 'gameOver';
		self.player.turnOffInput();
	}

	this.animate = function(){

		//calc delta
		var now = Date.now();
		var dt = now - lastUpdate;
		self.timeElapsed += dt;
		lastUpdate = now;

		if ( gameState === 'playing') {

			if ( self.timeElapsed > 6000 && self.speachRemoved === false ) {
				self.stage.removeChild(self.player.speachText);
				self.speachRemoved = true;
			}
			
			//check X collision
    		self.player.updateX();
    		if (self.terrain.collidesWith(self.player.sprite) || self.topTerrain.collisionWithCrate(self.player.sprite) )
    		{
    			self.player.undoX();
    		}

    		//check Y collision
    		self.player.updateY();
    		if (self.terrain.collidesWith(self.player.sprite) || self.topTerrain.collisionWithCrate(self.player.sprite) )
    		{
    			self.player.undoY();
    		}

    		//check if player or crate is colliding with button
    		for (var i = 0; i < self.buttons.length; ++i)
    		{
    			if (self.buttons[i].buttonDown === false )
    			{
    				if ( self.buttons[i].collidesWith(self.player.sprite) === true ||
    					self.topTerrain.collisionWithCrate(self.buttons[i].sprite) === true) 
    				{
	    				self.buttons[i].buttonDown = true;
	    				soundButtonDown.play();

	    				//get terrain switching info and pass it to terrain
	    				var swapRow = self.buttons[i].buttonDefinition.swapRow;
	    				var swapCol = self.buttons[i].buttonDefinition.swapCol;
	    				self.terrain.switchTerrainTile(swapRow, swapCol, 0, self.stage);
	    			}
	    		}
    			else if (self.buttons[i].buttonDown === true)
    			{
	    			if (self.buttons[i].collidesWith(self.player.sprite) === false &&
	    				self.topTerrain.collisionWithCrate(self.buttons[i].sprite) === false)
	    			{
	    				self.buttons[i].buttonDown = false;
	    				soundButtonUp.play();

	    				//get terrain switching info and pass it to terrain
	    				var swapRow = self.buttons[i].buttonDefinition.swapRow;
	    				var swapCol = self.buttons[i].buttonDefinition.swapCol;
	    				self.terrain.switchTerrainTile(swapRow, swapCol, 2, self.stage);
	    			}
	    		}
    		}


    		self.topTerrain.moveCrates(self.player.sprite);

    		//check if spikes collide with player
			if (self.topTerrain.causesDeathTo(self.player.sprite) )
			{
				self.stage.removeChild(self.player.sprite);
				self.stage.addChild(self.player.deathSprite);

				soundPlayerDeath.play();
				self.setGameOverState();
	    		self.promptText = new PIXI.Text('CLICK FOR GAME MENU', fontStyle);
	    		self.promptText1 = new PIXI.Text('SPACE TO TRY AGAIN', fontStyle);
				self.promptText.interactive = true;
				self.promptText1.interactive = true;
				var setLoadMenuGameState = function(){soundSelect.play(); currentLevel = 0; gameState='loadMenu';};
				self.promptText.on('mousedown', setLoadMenuGameState);	
				self.promptText1.on('mousedown', startLevel);	
				self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 50);
				self.promptText1.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 - 50);
				self.promptText.anchor.x = 0.5;
				self.promptText.anchor.y = 0.5;
				self.promptText1.anchor.x = 0.5;
				self.promptText1.anchor.y = 0.5;
				self.stage.addChild(self.promptText);
				self.stage.addChild(self.promptText1);
			}	

			//spike move
			//dummy var for delta time
			self.topTerrain.update(1, self.terrain);
			
			if (self.player.reachedGoal === false && self.topTerrain.reachedGoal(self.player.sprite) )
			{
				soundLevelSuccess.play();
				self.setGameOverState();
				self.player.reachedGoal = true;
				self.promptText = new PIXI.Text('PRESS SPACE FOR MORE', fontStyle);
				self.promptText.interactive = true;
				//var setLoadMenuGameState = function(){gameState='loadMenu';};
				++window.currentLevel;

				if (window.currentLevel < levels.length ){
					self.promptText.on('mousedown', startLevel);	
					self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
					self.promptText.anchor.x = 0.5;
					self.promptText.anchor.y = 0.5;
					self.stage.addChild(self.promptText);
				}
				else { 
					gameState = 'loadEndScreen';
				}
			}
    	}
    	if  ( gameState === 'loadMenu') {
    		self.resetGame();

    		self.promptText = new PIXI.Text('LIT DARK', fontStyle);
    		self.promptText1 = new PIXI.Text('START GAME', fontStyle);
    		// self.promptText2 = new PIXI.Text('Level 2', fontStyle);
    		// self.promptText3 = new PIXI.Text('Level 3', fontStyle);
			
			self.promptText1.interactive = true;
			// self.promptText2.interactive = true;
			// self.promptText3.interactive = true;

			self.promptText1.on('mousedown', startLevel);	
			// self.promptText2.on('mousedown', startLevel2);	
			// self.promptText3.on('mousedown', startLevel3);	

			self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 - 50);
			self.promptText1.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 50);
			// self.promptText2.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 40);
			// self.promptText3.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 80);
			

			self.promptText.anchor.x = 0.5;
			self.promptText.anchor.y = 0.5;
			self.promptText1.anchor.x = 0.5;
			self.promptText1.anchor.y = 0.5;
			// self.promptText2.anchor.x = 0.5;
			// self.promptText2.anchor.y = 0.5;
			// self.promptText3.anchor.x = 0.5;
			// self.promptText3.anchor.y = 0.5;

			self.menuSprite = PIXI.Sprite.fromImage("./img/LitDarkTitle.png");
			self.menuSprite.position.set(0, 0);

			self.stage.addChild(self.menuSprite);
    		self.stage.addChild(self.promptText);
    		self.stage.addChild(self.promptText1);
    		// self.stage.addChild(self.promptText2);
    		// self.stage.addChild(self.promptText3);
    		gameState = 'mainMenu';
    	}    	

		if  ( gameState === 'loadEndScreen') {
    		self.resetGame();

    		var yPos = -180;

    		self.promptText = new PIXI.Text('LIT DARK', creditsFontStyle);
			self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText.anchor.x = 0.5;
			self.promptText.anchor.y = 0.5;
			yPos += 50;

			self.promptText1 = new PIXI.Text('BY', creditsFontStyle);
			self.promptText1.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText1.anchor.x = 0.5;
			self.promptText1.anchor.y = 0.5;
			yPos += 50;

			self.promptText2 = new PIXI.Text('JAVIER MUNOZ - ART / GAME DESIGN', creditsFontStyle);
			self.promptText2.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText2.anchor.x = 0.5;
			self.promptText2.anchor.y = 0.5;
			yPos += 50;


			self.promptText4 = new PIXI.Text('ADAM HULBERT - PROGRAMMING / GAME DESIGN', creditsFontStyle);
			self.promptText4.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText4.anchor.x = 0.5;
			self.promptText4.anchor.y = 0.5;
			yPos += 50;


			self.promptText6 = new PIXI.Text('FOR AIE 48HR GAME JAM', creditsFontStyle);
			self.promptText6.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText6.anchor.x = 0.5;
			self.promptText6.anchor.y = 0.5;
			yPos += 50;

			self.promptText7 = new PIXI.Text('JULY 19TH, 2015', creditsFontStyle);
			self.promptText7.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText7.anchor.x = 0.5;
			self.promptText7.anchor.y = 0.5;
			yPos += 50;

			self.promptText8 = new PIXI.Text('www.adamhportfolio.com', creditsFontStyle);
			self.promptText8.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText8.anchor.x = 0.5;
			self.promptText8.anchor.y = 0.5;			
			yPos += 50;

			self.promptText9 = new PIXI.Text('THANKS FOR PLAYING', creditsFontStyle);
			self.promptText9.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + yPos);
			self.promptText9.anchor.x = 0.5;
			self.promptText9.anchor.y = 0.5;						

			self.menuSprite = PIXI.Sprite.fromImage("./img/LitDarkEndScreen.png");
			self.menuSprite.position.set(0, 0);

			self.stage.addChild(self.menuSprite);
    		self.stage.addChild(self.promptText);
    		self.stage.addChild(self.promptText1);
    		self.stage.addChild(self.promptText2);
    		//self.stage.addChild(self.promptText3);
    		self.stage.addChild(self.promptText4);
    		//self.stage.addChild(self.promptText5);
    		self.stage.addChild(self.promptText6);
    		self.stage.addChild(self.promptText7);
    		self.stage.addChild(self.promptText8);
    		self.stage.addChild(self.promptText9);


    		gameState = 'end';
    	}    	

    	self.renderer.render(self.stage);		
		requestAnimationFrame( self.animate );
	}
}