App.makeGameRenderer = function(){
	var game = {};

	game.debugGfx       = App.Canvases.addNewLayer(99).getContext('2d');
	game.ghostGfx       = App.Canvases.addNewLayer( 0).getContext('2d');
	game.tempGfx        = App.Canvases.addNewLayer(-1).getContext('2d'); 
	game.automGfx       = App.Canvases.addNewLayer(-2).getContext('2d'); // need to set App.Game.ghostGfx.globalAlpha
	game.tokenDGfx      = App.Canvases.addNewLayer(-3).getContext('2d');
	game.tokenSGfx      = App.Canvases.addNewLayer(-4).getContext('2d');
	game.instructionGfx = App.Canvases.addNewLayer(-5).getContext('2d');
	game.gridGfx        = App.Canvases.addNewLayer(-6).getContext('2d');
	game.bkgndGfx       = App.Canvases.addNewLayer(-7).getContext('2d');

	game.translateCanvas = function(gfx){ // TODO: OPTIMIZE THIS, THIS IS A BOTTLENECK
		gfx.save();
		gfx.translate(game.renderX,game.renderY);
	}

	game.requestStaticRenderUpdate = true;
	game.requestUltraStaticRenderUpdate = true;

	// ========================================================== //

	game.renderX = 100;
	game.renderY = 100;
	game.cellSizeFactor = 4;
	game.cellSize = 3*Math.pow(2,3);
	game.interpolation;

	game.goalRenderX  = 0;
	game.goalRenderY  = 0;
	game.goalCellSize = 3*Math.pow(2,game.cellSizeFactor);

	game.panRenderX,game.panRenderY;
	game.panMouseX,game.panMouseY;

	game.mouseX;
	game.mouseY;
	game.mouseC;
	game.renderMX = 0;
	game.renderMY = 0;
	game.goalMX = 0;
	game.goalMY = 0;

	// ========================================================== //

	game.screenToGridCoords = function(x,y){
		var gx = (x-game.renderX)/game.cellSize;
		var gy = (y-game.renderY)/game.cellSize;
		var gc = fmod(gx,1)<0.5?fmod(gy,1)<0.5?App.COLORS.RED   : App.COLORS.BLUE
		                       :fmod(gy,1)<0.5?App.COLORS.GREEN : App.COLORS.YELLOW;

		game.mouseX = Math.floor(gx);
		game.mouseY = Math.floor(gy);
		game.mouseC = gc;

		game.goalMX = game.mouseX*game.cellSize;
		game.goalMY = game.mouseY*game.cellSize;

		switch(game.mouseC){
			case App.COLORS.RED:break;
			case App.COLORS.GREEN: game.goalMX += game.cellSize/2;break;
			case App.COLORS.BLUE:  game.goalMY += game.cellSize/2;break;
			case App.COLORS.YELLOW:
				game.goalMX += game.cellSize/2;
				game.goalMY += game.cellSize/2;
				break;
		}
	}

	// ========================================================== //

	game.constrain = function(){
		var offset = 64;

		if(App.Game.currentPlanningLevel.width !== 0){
			if(game.goalRenderX > App.Canvases.width-offset)
				game.goalRenderX = App.Canvases.width-offset;
			if(game.goalRenderX < offset-App.Game.currentPlanningLevel.width*game.cellSize)
				game.goalRenderX = offset-App.Game.currentPlanningLevel.width*game.cellSize;
		}

		if(App.Game.currentPlanningLevel.height !== 0){
			if(game.goalRenderY > App.Canvases.height-offset)
				game.goalRenderY = App.Canvases.height-offset;
			if(game.goalRenderY < offset-App.Game.currentPlanningLevel.height*game.cellSize)
				game.goalRenderY = offset-App.Game.currentPlanningLevel.height*game.cellSize;
		}
	}

	game.beginPan = function(x,y){
		game.panMouseX = x;
		game.panMouseY = y;
		game.panRenderX = game.goalRenderX;
		game.panRenderY = game.goalRenderY;
	}

	game.pan = function(x,y){
		game.goalRenderX = Math.round(game.panRenderX+(x-game.panMouseX));
		game.goalRenderY = Math.round(game.panRenderY+(y-game.panMouseY));
		game.constrain();
		game.requestStaticRenderUpdate = true;
	}

	game.zoom = function(x,y,f){
		game.cellSizeFactor += f;
		if(game.cellSizeFactor<3)game.cellSizeFactor=3;
		if(game.cellSizeFactor>7)game.cellSizeFactor=7;

		var oldCellSize = game.goalCellSize;
		game.goalCellSize = Math.round(3*Math.pow(2,game.cellSizeFactor));
		var factor = game.goalCellSize/oldCellSize;

		game.goalRenderX = Math.round(x+(game.goalRenderX-x)*factor);
		game.goalRenderY = Math.round(y+(game.goalRenderY-y)*factor);
		game.constrain();
		game.requestStaticRenderUpdate = true;
	}

	game.bestFit = function(){
		var level = App.Game.currentPlanningLevel;
		if(!level)return;
		App.Game.setSimulationSpeed(512);
		game.cellSizeFactor = 4; // TODO: MAKE THIS BETTER
		game.goalCellSize = 3*Math.pow(2,game.cellSizeFactor);
		game.goalRenderX = Math.round((App.Canvases.width-level.width*game.goalCellSize)/2);
		game.goalRenderY = Math.round((App.Canvases.height-level.height*game.goalCellSize)/2);
		game.requestStaticRenderUpdate = true;
	}

	game.centerOn = function(x,y,zoom){
		var level = App.Game.currentPlanningLevel;
		if(!level)return;
		// TODO: IMPLEMENT THIS
		game.requestStaticRenderUpdate = true;
	}

	// ========================================================== //

	game.render = function(){
		// ultrastatic rendering
		if(game.requestUltraStaticRenderUpdate){
			game.requestUltraStaticRenderUpdate = false;

			game.renderBackground();
		}

		// static rendering
		if(game.requestStaticRenderUpdate){
			game.requestStaticRenderUpdate = false;

			// update interpolated view variables
			game.renderX  += expInterp(game.renderX,game.goalRenderX  ,0.01,0.5);
			game.renderY  += expInterp(game.renderY,game.goalRenderY  ,0.01,0.5);
			game.cellSize += expInterp(game.cellSize,game.goalCellSize,0.01,0.01);
			if(game.renderX  != game.goalRenderX)  game.requestStaticRenderUpdate=true;
			if(game.renderY  != game.goalRenderY)  game.requestStaticRenderUpdate=true;
			if(game.cellSize != game.goalCellSize) game.requestStaticRenderUpdate=true;

			game.renderGrid();

			// render static level stuff
			if(App.Game.mode === App.Game.modes.PLANNING && App.Game.currentPlanningLevel !== undefined){
				game.instructionGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
				game.translateCanvas(game.instructionGfx);
				App.Game.currentPlanningLevel.staticRender();
				game.instructionGfx.restore();
			}else if(App.Game.currentSimulationLevel !== undefined){
				game.instructionGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
				game.translateCanvas(game.instructionGfx);
				game.tokenSGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
				game.translateCanvas(game.tokenSGfx);

				App.Game.currentSimulationLevel.staticRender();

				game.instructionGfx.restore();
				game.tokenSGfx.restore();
			}
		}

		// dynamic rendering
		if(App.Game.mode === App.Game.modes.PLANNING && App.Game.currentPlanningLevel !== undefined){
			App.Game.currentPlanningLevel.dynamicRender();
		}else if(App.Game.currentSimulationLevel !== undefined){
			game.interpolation = (App.Engine.tick-App.Game.lastCycleTick)/(App.Game.nextCycleTick-App.Game.lastCycleTick);

			game.automGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			game.translateCanvas(game.automGfx);
			game.tokenDGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			game.translateCanvas(game.tokenDGfx);

			App.Game.currentSimulationLevel.dynamicRender();

			game.automGfx.globalCompositeOperation = 'destination-in';
			game.automGfx.fillRect(-2,-2,App.Game.currentPlanningLevel.width*game.cellSize+4,App.Game.currentPlanningLevel.height*game.cellSize+4);
			game.automGfx.globalCompositeOperation = 'source-over';
			game.tokenDGfx.globalCompositeOperation = 'destination-in';
			game.tokenDGfx.fillRect(-2,-2,App.Game.currentPlanningLevel.width*game.cellSize+4,App.Game.currentPlanningLevel.height*game.cellSize+4);
			game.tokenDGfx.globalCompositeOperation = 'source-over';

			game.automGfx.restore();
			game.tokenDGfx.restore();
		}
	}

	// ========================================================== //

	game.renderGrid = function(){
		// setup grid canvas
		game.gridGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height); // TODO: OPTIMIZE THIS

		// setup grid vars
		var gw = App.Game.currentPlanningLevel.width;
		var gh = App.Game.currentPlanningLevel.height;
		var cs = game.cellSize;
		var l = fmod(game.renderX,cs)-cs;
		var r = App.Canvases.width+cs;
		var t = fmod(game.renderY,cs)-cs;
		var b = App.Canvases.height+cs;

		if(gw !== 0){
			l = Math.max(l,game.renderX);
			r = Math.min(r,game.renderX+cs*gw);
		}if(gh !== 0){
			t = Math.max(t,game.renderY);
			b = Math.min(b,game.renderY+cs*gh);
		}

		// lighter overlay
		game.gridGfx.fillStyle = 'rgba(0,0,0,0.55)';
		if(gw === 0)
			if(gh === 0)game.gridGfx.fillRect(0,0,App.Canvases.width,App.Canvases.height);
			else game.gridGfx.fillRect(0,game.renderY,App.Canvases.width,gh*cs);
		else
			if(gh === 0)game.gridGfx.fillRect(game.renderX,0,gw*cs,App.Canvases.height);
			else game.gridGfx.fillRect(game.renderX,game.renderY,gw*cs,gh*cs);

		// grid outline | if block below is modified, reflect changes here
		game.gridGfx.lineWidth = 6;
		game.gridGfx.strokeStyle = '#000000';
		game.gridGfx.beginPath();
		for(var i=l; i<=r+1; i+=cs){
			game.gridGfx.moveTo(i,t);
			game.gridGfx.lineTo(i,b);
		}for(var j=t; j<=b+1; j+=cs){
			game.gridGfx.moveTo(l,j);
			game.gridGfx.lineTo(r,j);
		}for(var i=l; i<=r+1; i+=cs){
			for(var j=t; j<=b+1; j+=cs){
				game.gridGfx.moveTo(i-4, j);
				game.gridGfx.lineTo(i+4, j);
				game.gridGfx.moveTo(i, j-4);
				game.gridGfx.lineTo(i, j+4);
			}
		}for(var i=l+cs/2; i<r; i+=cs){
			for(var j=t+cs/2; j<b; j+=cs){
				game.gridGfx.moveTo(i-4, j);
				game.gridGfx.lineTo(i+4, j);
				game.gridGfx.moveTo(i, j-4);
				game.gridGfx.lineTo(i, j+4);
				if(game.cellSize < 30) continue;

				game.gridGfx.moveTo(i-7, j);
				game.gridGfx.arc(i, j, 7, -Math.PI, Math.PI);
			}
		}game.gridGfx.rect(l-4, t-4, r-l+8, b-t+8);
		game.gridGfx.stroke();

		game.gridGfx.lineWidth = 2;

		// draw grid lines
		game.gridGfx.strokeStyle = '#111111';
		game.gridGfx.beginPath();
		for(var i=l; i<=r+1; i+=cs){
			game.gridGfx.moveTo(i,t);
			game.gridGfx.lineTo(i,b);
		}for(var j=t; j<=b+1; j+=cs){
			game.gridGfx.moveTo(l,j);
			game.gridGfx.lineTo(r,j);
		}game.gridGfx.stroke();

		// draw cell corners
		game.gridGfx.strokeStyle = '#444444';
		game.gridGfx.beginPath();
		for(var i=l; i<=r+1; i+=cs){
			for(var j=t; j<=b+1; j+=cs){
				game.gridGfx.moveTo(i-4, j);
				game.gridGfx.lineTo(i+4, j);
				game.gridGfx.moveTo(i, j-4);
				game.gridGfx.lineTo(i, j+4);
			}
		}game.gridGfx.stroke();

		// draw cell centers
		game.gridGfx.strokeStyle = '#222222';
		game.gridGfx.beginPath();
		for(var i=l+cs/2; i<r; i+=cs){
			for(var j=t+cs/2; j<b; j+=cs){
				game.gridGfx.moveTo(i-4, j);
				game.gridGfx.lineTo(i+4, j);
				game.gridGfx.moveTo(i, j-4);
				game.gridGfx.lineTo(i, j+4);
				if(game.cellSize < 30) continue;

				game.gridGfx.moveTo(i-7, j);
				game.gridGfx.arc(i, j, 7, -Math.PI, Math.PI);
			}
		}game.gridGfx.stroke();

		// draw level borders
		game.gridGfx.strokeStyle = '#888888';
		game.gridGfx.beginPath();
		game.gridGfx.rect(l-4, t-4, r-l+8, b-t+8);
		game.gridGfx.stroke();
	}

	game.renderBackground = function(){
		game.bkgndGfx.fillStyle = '#000000';
		game.bkgndGfx.fillRect(0,0,App.Canvases.width, App.Canvases.height)
		game.bkgndGfx.strokeStyle = '#151515';
		game.bkgndGfx.lineWidth = 5;
		game.bkgndGfx.beginPath();
		for(var i=1;i<App.Canvases.width+App.Canvases.height+5;i+=9){
			game.bkgndGfx.moveTo(i,-5);
			game.bkgndGfx.lineTo(-5,i);
		}game.bkgndGfx.stroke();
	}

	// ========================================================== //

	game.renderDebug = function(){
		game.debugGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		game.debugGfx.fillStyle = 'rgba(0,0,0,0.7)'
		game.debugGfx.fillRect(5,5,300,81);

		game.debugGfx.font = 'bold 11px arial';
		game.debugGfx.fillStyle = '#ffffff';
		game.debugGfx.fillText('FPS: '+Math.round(App.Engine.fps) ,11,22);
		game.debugGfx.fillText('Cycle: '+App.Game.cycle               ,11,33);
		if(game.paused){
			game.debugGfx.fillStyle = '#ff0000';
			game.debugGfx.fillText('Speed: PAUSED',11,44);
			game.debugGfx.fillStyle = '#ffffff';
		}else game.debugGfx.fillText('Speed: '+App.Game.simulationSpeed+' ms/tick',11,44);
		game.debugGfx.fillText('Tick: '+App.Engine.tick           ,11,55);
		game.debugGfx.fillText('Zoom: '+game.cellSizeFactor       ,11,66);
		game.debugGfx.fillText('Mode: '+(App.Game.mode===0?"PLANNING":"SIMULATION"),11,77);

		game.debugGfx.fillText('Pan X: '+game.renderX             ,132,22);
		game.debugGfx.fillText('Pan Y: '+game.renderY             ,132,33);
		game.debugGfx.fillText('Cell Size: '+game.cellSize        ,132,44);
		if(game.requestStaticRenderUpdate)game.debugGfx.fillStyle = '#ff0000';
		game.debugGfx.fillText('Static Render: '+game.requestStaticRenderUpdate,132,55);
		game.debugGfx.fillStyle = '#ffffff';
		var bar = 'Interpolation ';
		for(var i=0;i<game.interpolation;i+=0.05)bar+='|';
		game.debugGfx.fillText(bar,132,66);
		game.debugGfx.fillText('Mouse: '+game.mouseX+','+game.mouseY+','+game.mouseC,132,77);
	}

	// ========================================================== //

	return game;
}
