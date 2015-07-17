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
		self.terrain = new Terrain(window.levelBottom);
		self.topTerrain = new TopLevelTerrain(window.levelTop);
		

		self.stage.removeChild(self.promptText);
		self.terrain.addToStage(self.stage);
		self.stage.addChild(this.player.sprite);
		self.topTerrain.addToStage(self.stage);
	}

	this.run = function() {
		requestAnimationFrame( this.animate );
	}

	this.animate = function(){

		//calc delta
		var now = Date.now();
		var dt = now - lastUpdate;
		lastUpdate = now;

		if ( gameState === 'playing') {
    		self.player.update();

    		//iterate over terrain. only check collision on the non walkable stuff
			if (self.terrain.collidesWith(self.player.sprite) )
			{
				self.player.undoX();
				self.player.undoY();
			}

			if (self.topTerrain.collidesWith(self.player.sprite) )
			{
				gameState = 'gameOver';
	    		self.promptText = new PIXI.Text('Game Over', fontStyle);
				self.promptText.interactive = true;
				//self.promptText.on('mousedown', mainMenu);	
				self.promptText.position.set(AH_GLOBALS.SCREEN_W/2, AH_GLOBALS.SCREEN_H/2);
				self.promptText.anchor.x = 0.5;
				self.promptText.anchor.y = 0.5;
				self.stage.addChild(self.promptText);
			}				

			self.topTerrain.update();
    	}
    	if  ( gameState === 'loadMenu') {
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