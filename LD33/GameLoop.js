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

	this.init = function(){
		console.log("init");
		console.log(AH_GLOBALS.FPS);

		self.player = new Player();

		self.platformArray = [];

		//some test platforms
		for (var i = 0; i < 27; ++i)
		{
			self.platformArray.push(new Platform());
			self.platformArray[self.platformArray.length - 1].SetPos(i*32, 460);
			self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
		}

		for (var i = 0; i < 7; ++i)
		{
			self.platformArray.push(new Platform());
			self.platformArray[self.platformArray.length - 1].SetPos(500, 480 - (i*32));
			self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
		}

		self.platformArray.push(new Platform());
		self.platformArray[self.platformArray.length - 1].SetPos(200, 200);
		self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);

		self.platformArray.push(new Platform());
		self.platformArray[self.platformArray.length - 1].SetPos(300, 300);
		self.stage.addChild(self.platformArray[self.platformArray.length - 1].sprite);
		//end test platforms

		self.stage.addChild(self.player.sprite);
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

			// if ( self.logTime > 1000)
			// {
			// 	self.logTime = 0;
			// 	console.log("x: " + self.player.bCol.position.x);
			// 	console.log("y: " + self.player.bCol.position.y);
			// }
			
    		self.player.update();

    		//check player collision with platform
    		self.player.setOnGround(false);
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
	    	}
    	}
    	if  ( gameState === 'gameOver') {
    		self.stage.addChild(self.promptText);
    		gameState = 'mainMenu';
    	}
    	
    	self.renderer.render(self.stage);
		
		requestAnimationFrame( self.animate );
	}
}