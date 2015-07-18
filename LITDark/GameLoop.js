function GameLoop(){

	var self = this;

	//create the renderer
	this.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();

	this.init = function(level_){

		//remove all the menu stuff
		self.stage.removeChild(self.promptText);
		self.stage.removeChild(self.promptText1);
		self.stage.removeChild(self.promptText2);
		self.stage.removeChild(self.promptText3);
		self.stage.removeChild(self.menuSprite);

		//setup game objects
		self.level = level_;
		self.player = new Player(level_.playerPos.row, level_.playerPos.col);
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
	}

	this.run = function() {
		requestAnimationFrame( this.animate );
	}

	this.resetGame = function() {
		while(self.stage.children[0]) { self.stage.removeChild(self.stage.children[0]); }

		// //reset all buttons
		// self.buttons = [];
		// self.terrain = {};
	}

	this.setGameOverState = function() {
		gameState = 'gameOver';
		self.player.turnOffInput();
	}

	this.animate = function(){

		//calc delta
		var now = Date.now();
		var dt = now - lastUpdate;
		lastUpdate = now;

		if ( gameState === 'playing') {
			
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

    		//check if rats collide with player
			if (self.topTerrain.causesDeathTo(self.player.sprite) )
			{
				soundPlayerDeath.play();
				self.setGameOverState();
	    		self.promptText = new PIXI.Text('Game Menu', fontStyle);
	    		self.promptText1 = new PIXI.Text('Try Again', fontStyle);
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

			//rats move
			//dummy var for delta time
			self.topTerrain.update(1, self.terrain);
			
			if (self.player.reachedGoal === false && self.topTerrain.reachedGoal(self.player.sprite) )
			{
				soundLevelSuccess.play();
				self.setGameOverState();
				self.player.reachedGoal = true;
				self.promptText = new PIXI.Text('Level Complete! Click For Next Level', fontStyle);
				self.promptText.interactive = true;
				//var setLoadMenuGameState = function(){gameState='loadMenu';};
				++window.currentLevel;
				self.promptText.on('mousedown', startLevel);	
				self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
				self.promptText.anchor.x = 0.5;
				self.promptText.anchor.y = 0.5;
				self.stage.addChild(self.promptText);
			}
    	}
    	if  ( gameState === 'loadMenu') {
    		self.resetGame();

    		self.promptText = new PIXI.Text('LIT Dark', fontStyle);
    		self.promptText1 = new PIXI.Text('Start Game', fontStyle);
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
    	self.renderer.render(self.stage);		
		requestAnimationFrame( self.animate );
	}
}