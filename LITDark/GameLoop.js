function GameLoop(){

	var self = this;

	//create the renderer
	this.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();

	this.init = function(level_){

		self.level = level_;
		self.player = new Player();
		self.terrain = new Terrain(self.level.levelBottom);
		self.topTerrain = new TopLevelTerrain(self.level.levelTop);
		

		//if ( self.stage.has)
		self.stage.removeChild(self.promptText);
		self.stage.removeChild(self.promptText1);
		self.stage.removeChild(self.promptText2);
		self.stage.removeChild(self.promptText3);
		self.stage.removeChild(self.menuSprite);
		self.terrain.addToStage(self.stage);
		self.topTerrain.addToStage(self.stage);
		self.stage.addChild(this.player.sprite);
		
	}

	this.run = function() {
		requestAnimationFrame( this.animate );
	}

	this.resetGame = function() {
		while(self.stage.children[0]) { self.stage.removeChild(self.stage.children[0]); }
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

    		self.topTerrain.moveCrates(self.player.sprite);

    		//check if rats collide with player
			if (self.topTerrain.causesDeathTo(self.player.sprite) )
			{
				gameState = 'gameOver';
	    		self.promptText = new PIXI.Text('Game Over', fontStyle);
				self.promptText.interactive = true;
				var setLoadMenuGameState = function(){gameState='loadMenu';};
				self.promptText.on('mousedown', setLoadMenuGameState);	
				self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
				self.promptText.anchor.x = 0.5;
				self.promptText.anchor.y = 0.5;
				self.stage.addChild(self.promptText);
			}	

			//rats move
			//dummy var for delta time
			self.topTerrain.update(1, self.terrain);

			// //slow player down if moving a crate
			// if (self.topTerrain.canMove(self.player.sprite) )
			// {
			// 	self.player.setSpeedMulti(0.3);
			// }
			// else
			// {
			// 	self.player.setSpeedMulti(1);	
			// }
			
			if (self.player.reachedGoal === false && self.topTerrain.reachedGoal(self.player.sprite) )
			{
				self.player.reachedGoal = true;
				self.promptText = new PIXI.Text('You Win!', fontStyle);
				self.promptText.interactive = true;
				var setLoadMenuGameState = function(){gameState='loadMenu';};
				self.promptText.on('mousedown', setLoadMenuGameState);	
				self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
				self.promptText.anchor.x = 0.5;
				self.promptText.anchor.y = 0.5;
				self.stage.addChild(self.promptText);
			}


    	}
    	if  ( gameState === 'loadMenu') {
    		self.resetGame();

    		self.promptText = new PIXI.Text('LIT Dark', fontStyle);
    		self.promptText1 = new PIXI.Text('Level 1', fontStyle);
    		self.promptText2 = new PIXI.Text('Level 2', fontStyle);
    		self.promptText3 = new PIXI.Text('Level 3', fontStyle);
			
			self.promptText1.interactive = true;
			self.promptText2.interactive = true;
			self.promptText3.interactive = true;

			self.promptText1.on('mousedown', startLevel1);	
			self.promptText2.on('mousedown', startLevel2);	
			self.promptText3.on('mousedown', startLevel3);	

			self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 - 100);
			self.promptText1.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 );
			self.promptText2.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 40);
			self.promptText3.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2 + 80);
			

			self.promptText.anchor.x = 0.5;
			self.promptText.anchor.y = 0.5;
			self.promptText1.anchor.x = 0.5;
			self.promptText1.anchor.y = 0.5;
			self.promptText2.anchor.x = 0.5;
			self.promptText2.anchor.y = 0.5;
			self.promptText3.anchor.x = 0.5;
			self.promptText3.anchor.y = 0.5;

			self.menuSprite = PIXI.Sprite.fromImage("./img/LitDarkTitle.png");
			self.menuSprite.position.set(0, 0);

			self.stage.addChild(self.menuSprite);
    		self.stage.addChild(self.promptText);
    		self.stage.addChild(self.promptText1);
    		self.stage.addChild(self.promptText2);
    		self.stage.addChild(self.promptText3);
    		gameState = 'mainMenu';
    	}    	
    	self.renderer.render(self.stage);		
		requestAnimationFrame( self.animate );
	}
}