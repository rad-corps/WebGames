function GameLoop(){

	var self = this;

	//create the renderer
	this.renderer = new PIXI.WebGLRenderer(AH_GLOBALS.SCREEN_W, AH_GLOBALS.SCREEN_H);//autoDetectRenderer(400, 300);

	//add it to the DOM body
	document.body.appendChild(this.renderer.view);

	//create a stage (all sprites added to this)
	self.stage = new PIXI.Container();

	this.init = function(){
		console.log("init");

		self.player = new Player();
		self.terrain = new Terrain(levelBottom);
		self.topTerrain = new TopLevelTerrain(levelTop);
		

		//if ( self.stage.has)
		self.stage.removeChild(self.promptText);
		self.terrain.addToStage(self.stage);
		self.stage.addChild(this.player.sprite);
		self.topTerrain.addToStage(self.stage);
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
    		if (self.terrain.collidesWith(self.player.sprite) )
    		{
    			self.player.undoX();
    		}

    		//check Y collision
    		self.player.updateY();
    		if (self.terrain.collidesWith(self.player.sprite) )
    		{
    			self.player.undoY();
    		}

    		//check if rats collide with player
			if (self.topTerrain.collidesWith(self.player.sprite) )
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
			self.topTerrain.update();
    	}
    	if  ( gameState === 'loadMenu') {
    		self.resetGame();

    		self.promptText = new PIXI.Text('Start LIT Dark', fontStyle);
			self.promptText.interactive = true;
			self.promptText.on('mousedown', startGame);	
			self.promptText.on('touchstart', startGame);	
			self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
			self.promptText.anchor.x = 0.5;
			self.promptText.anchor.y = 0.5;

    		self.stage.addChild(self.promptText);
    		gameState = 'mainMenu';
    	}    	
    	self.renderer.render(self.stage);		
		requestAnimationFrame( self.animate );
	}
}