App.makeGame = function(){
	var game = {};

	// ========================================================== //
	// ====================== MODE-SPECIFIC ===================== //
	// ========================================================== //

		/*+------------------------------------------+*/

	game.modes = {SIMULATION:App.setup.modes.SIMULATION,PLANNING:App.setup.modes.PLANNING};
	game.mode = game.modes.PLANNING;

	game.currentPlanningLevel;
	game.currentSimulationLevel;
	game.debug = false;

		/*+------------------------------------------+*/

	game.loadLevel = function(levelString){
		// TODO: clear old undo-redo cache
		// TODO: setup render vars (center level, default zoom)
	}

	game.setMode = function(mode){
		if(! (mode === this.modes.SIMULATION || mode === this.modes.PLANNING)){
			console.error("invalid gamemode: " + mode);
			return;
		}

		game.mode = mode;
		if(game.mode === game.modes.SIMULATION){
			game.currentSimulationLevel = game.currentPlanningLevel.generateSimulationLevel();
			game.requestStaticRenderUpdate = true;
			game.paused = false;
			game.nextCycleTick = App.Engine.tick;
			game.cycle = 0;
		}else{
			game.mode = game.modes.PLANNING;
			game.currentSimulationLevel = undefined;
			game.automGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			game.tokenSGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			game.requestStaticRenderUpdate = true;
			game.paused = true;
		}
	}

		/*+------------------------------------------+*/

	game.simulationError = function(errorCode){
		// TODO: stop simulation
		// TODO: display error
		// TODO: go back to planning mode
	}

	game.simulationSuccess = function(){
		// TODO: stop simulation
		// TODO: display scores
		//       instruction count
		//       ticks elapsed
		//       automaton count (fork?) (min max total)
		//       cell usage
		// TODO: exit/next level...
	}

		/*+------------------------------------------+*/

	game.createNewLevel = function(){} // TODO: implement?

	// returns a planning level object, given an input string.
	// Just a little string parser, really. If changes to
	// Level format are made, they have to be updated here.
	// This could be considered fragile code in need of refactoring!
	game.loadNewLevel = function(inputString){
		var errors = [];
		if(!inputString || !inputString.split)
			errors.push('   No Level!');
		else{
			var split = inputString.split(';');
			var lev = new App.PlanningLevel();


			if(split.length <= 0)
				errors.push('  No Level!');

			var levDat = split[0].split(',');
			if(levDat.length !== 3)
				errors.push('  Missing header information!');

			lev.name = levDat[0];
			lev.width = parseInt(levDat[1]);
			lev.height = parseInt(levDat[2]);
			if(isNaN(lev.width) || isNaN(lev.height))
				errors.push('  Non-numeric width or height!');

			for(var i = 1; i < split.length; i++){
				var instDat = split[i].split(',');
				if(instDat.length !== 4)
					errors.push('  Missing instruction information for instruction #' + i + '!');

				var x = parseInt(instDat[0]);
				var y = parseInt(instDat[1]);
				var col = parseInt(instDat[2]);
				var typ = parseInt(instDat[3]);

				if(isNaN(x) || isNaN(y) || isNaN(col) || isNaN(typ))
					errors.push('  Non-numeric instruction information for instruction #' +  i +  '!');

				if((x < 0 || x > lev.width) && lev.width !== 0)
					errors.push('  Instruction x out of range for instruction #' + i + ': ' + x);

				if((y < 0 || y > lev.height) && lev.height !== 0)
					errors.push('  Instruction y out of range for instruction #' + i + ': ' + y);

				if(typ >= 25)
					errors.push('  Instruction type out of range for instruction #' + i + ': ' + typ);

				if(col >= 4)
					errors.push('  Instruction color out of range for instruction #' + i + ': ' + col);

				if(errors.length === 0){
					var inst = new App.PlanningInstruction(x, y, col, typ);
					lev.insert(inst);
				}
			}
		}
		if(errors.length !== 0){
			console.error('Could not load level: ' + inputString);
			for(var e in errors){
				console.error(errors[e]);
			}
			return false;//a success/failure flag
		}

		this.currentPlanningLevel = lev;
		return true;
	}

	// ========================================================== //
	// ===================== UPDATE-SPECIFIC ==================== //
	// ========================================================== //

	game.lastCycleTick;
	game.nextCycleTick;
	game.cycle;
	game.simulationSpeed = 512;

	game.requestPause = false;
	game.paused = true;
	game.pauseTick;
	game.pauseLastCycleTick;
	game.pauseNextCycleTick;

		/*+------------------------------------------+*/

	game.update = function(){
		if(game.mode === game.modes.PLANNING &&
		   game.currentPlanningLevel !== undefined &&
		   game.currentPlanningLevel.update)
			game.currentPlanningLevel.update();
		else if(game.currentSimulationLevel !== undefined){
			if(!game.paused)while(App.Engine.tick > game.nextCycleTick){
				if(game.simulationSpeed <= 0)break;
				game.lastCycleTick = game.nextCycleTick;
				game.nextCycleTick += game.simulationSpeed;
				++game.cycle;
				game.currentSimulationLevel.update();
				if(game.requestPause){
					game.requestPause = false;
					game.lastCycleTick = App.Engine.tick;
					game.nextCycleTick = App.Engine.tick+game.simulationSpeed;
					game.pause();
					return;
				}
			}else{
				var diff = App.Engine.tick-game.pauseTick;
				game.lastCycleTick = game.pauseLastCycleTick+diff;
				game.nextCycleTick = game.pauseNextCycleTick+diff;
			}
		}

		if(game.followTarget){
			// behavior considerations when automaton wraps around level???
			game.goalRenderX = game.followTarget.drawX + game.currentSimulationLevel.width*game.cellSize/2;
			game.goalRenderY = game.followTarget.drawY + game.currentSimulationLevel.height*game.cellSize/2;
			game.requestStaticRenderUpdate = true;
		}
	}

	game.pause = function(){
		game.paused = !game.paused;
		if(!game.paused && game.mode === game.modes.PLANNING)game.toggleMode();
		game.pauseTick = App.Engine.tick;
		game.pauseLastCycleTick = game.lastCycleTick;
		game.pauseNextCycleTick = game.nextCycleTick;
	}

	// ========================================================== //
	// ===================== RENDER-SPECIFIC ==================== //
	// ========================================================== //

	game.tempGfx        = App.Canvases.addNewLayer('gameTemp'       ,0);
	game.debugGfx       = App.Canvases.addNewLayer('debug info'     ,0);
	game.bkgndGfx       = App.Canvases.addNewLayer('background'    ,-1);
	game.automGfx       = App.Canvases.addNewLayer('autom'         ,-2);
	game.tokenDGfx      = App.Canvases.addNewLayer('token dynamic' ,-3);
	game.tokenSGfx      = App.Canvases.addNewLayer('token static'  ,-4);
	game.instructionGfx = App.Canvases.addNewLayer('instruction'   ,-5);
	game.gridGfx        = App.Canvases.addNewLayer('grid static'   ,-6);
	// remember to add to clearRects

	game.requestStaticRenderUpdate = true;

		/*+------------------------------------------+*/

	game.renderX = 100;
	game.renderY = 100;
	game.cellSizeFactor = 4;
	game.cellSize = 3*Math.pow(2,3);
	game.interpolation;

	game.goalRenderX = 16;
	game.goalRenderY = 93;
	game.goalCellSize = 3*Math.pow(2,game.cellSizeFactor);

	game.panRenderX;
	game.panRenderY;
	game.panMouseX;
	game.panMouseY;

	game.mouseX;
	game.mouseY;
	game.mouseC;
	game.renderMX = 0;
	game.renderMY = 0;
	game.goalMX = 0;
	game.goalMY = 0;

	game.followTarget = null;

		/*+------------------------------------------+*/

	game.followAutomaton = function(automaton){
		this.followTarget = automaton;
	}

	game.constrain = function(){
		var offset = 64;

		if(game.currentPlanningLevel.width !== 0){
			if(game.goalRenderX > App.Canvases.width-offset)
				game.goalRenderX = App.Canvases.width-offset;
			if(game.goalRenderX < offset-game.currentPlanningLevel.width*game.cellSize)
				game.goalRenderX = offset-game.currentPlanningLevel.width*game.cellSize;
		}

		if(game.currentPlanningLevel.height !== 0){
			if(game.goalRenderY > App.Canvases.height-offset)
				game.goalRenderY = App.Canvases.height-offset;
			if(game.goalRenderY < offset-game.currentPlanningLevel.height*game.cellSize)
				game.goalRenderY = offset-game.currentPlanningLevel.height*game.cellSize;
		}
	}

	game.beginPan = function(x,y){
		game.followTarget = null;
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
		if(game.cellSizeFactor<2)game.cellSizeFactor=2;
		if(game.cellSizeFactor>7)game.cellSizeFactor=7;

		var oldCellSize = game.goalCellSize;
		game.goalCellSize = Math.round(3*Math.pow(2,game.cellSizeFactor));
		var factor = game.goalCellSize/oldCellSize;

		game.goalRenderX = Math.round(x+(game.goalRenderX-x)*factor);
		game.goalRenderY = Math.round(y+(game.goalRenderY-y)*factor);
		game.constrain();
		game.requestStaticRenderUpdate = true;
	}

	game.setSimulationSpeed = function(speed){
		if(game.paused)game.pause();
		if(game.mode === game.modes.PLANNING)game.toggleMode();
		if(speed<1)return;

		var tick = App.Engine.tick;
		var last = game.lastCycleTick;
		var next = game.nextCycleTick;
		var interp = (tick-last)/(next-last);
		var factor = speed/game.simulationSpeed;

		game.lastCycleTick = tick-(tick-last)*factor;
		game.nextCycleTick = tick+(next-tick)*factor;
		game.simulationSpeed = speed;
	}

	game.translateCanvas = function(gfx){
		gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
		gfx.save();
		gfx.translate(App.Game.renderX,App.Game.renderY);
	}

	game.screenToGridCoords = function(x,y){
		var gx = (x-game.renderX)/game.cellSize;
		var gy = (y-game.renderY)/game.cellSize;
		var gc = fmod(gx,1)<0.5?fmod(gy,1)<0.5?App.COLORS.RED:App.COLORS.BLUE:fmod(gy,1)<0.5?App.COLORS.GREEN:App.COLORS.YELLOW;

		game.mouseX = Math.floor(gx);
		game.mouseY = Math.floor(gy);
		game.mouseC = gc;

		game.goalMX = game.mouseX*game.cellSize;
		game.goalMY = game.mouseY*game.cellSize;
		switch(game.mouseC){
			case App.COLORS.RED:break;
			case App.COLORS.GREEN:game.goalMX += game.cellSize/2;break;
			case App.COLORS.BLUE:game.goalMY += game.cellSize/2;break;
			case App.COLORS.YELLOW:
				game.goalMX += game.cellSize/2;
				game.goalMY += game.cellSize/2;
				break;
		}

	}

		/*+------------------------------------------+*/

	game.expInterp = function(val,goal,speed,threshold){
		var factor = App.Engine.elapsed*speed;
		if(factor>1)factor=1;
		var retVal = (goal-val)*factor;
		if(Math.abs(val+retVal-goal)<threshold)retVal=goal-val;
		return retVal;
	}

	game.staticRender = function(){
		// return if no need to re-render
		if(!game.requestStaticRenderUpdate)return;
		game.requestStaticRenderUpdate = false;

		// update interpolated view variables
		game.renderX  += game.expInterp(game.renderX,game.goalRenderX  ,0.01,0.5);
		game.renderY  += game.expInterp(game.renderY,game.goalRenderY  ,0.01,0.5);
		game.cellSize += game.expInterp(game.cellSize,game.goalCellSize,0.01,0.01);
		if(game.renderX != game.goalRenderX)game.requestStaticRenderUpdate=true;
		if(game.renderY != game.goalRenderY)game.requestStaticRenderUpdate=true;
		if(game.cellSize != game.goalCellSize)game.requestStaticRenderUpdate=true;

		// setup grid canvas
		game.gridGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height); // TODO: OPTIMIZE THIS
		game.gridGfx.lineWidth = 2;

		// game.gridGfx.fillRect(0,0,App.Canvases.width, App.Canvases.height);
		// ^^^ this isnt anymore optimal than clearRect and breaks anything
		// rendered behind the grid because canvas is no longer transparent

		// setup grid vars
		var gw = game.currentPlanningLevel.width;
		var gh = game.currentPlanningLevel.height;
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

		// draw grid lines
		game.gridGfx.strokeStyle = '#111111';
		game.gridGfx.beginPath();
		for(var i=l;i<=r+1;i+=cs){
			game.gridGfx.moveTo(i,t);game.gridGfx.lineTo(i,b);
		}for(var j=t;j<=b+1;j+=cs){
			game.gridGfx.moveTo(l,j);game.gridGfx.lineTo(r,j);
		}game.gridGfx.stroke();

		// draw cell corners
		game.gridGfx.strokeStyle = '#444444';
		game.gridGfx.beginPath();
		for(var i=l;i<=r+1;i+=cs)
		for(var j=t;j<=b+1;j+=cs){
			game.gridGfx.moveTo(i-4,j);game.gridGfx.lineTo(i+4,j);
			game.gridGfx.moveTo(i,j-4);game.gridGfx.lineTo(i,j+4);
		}game.gridGfx.stroke();

		// draw cell centers
		game.gridGfx.strokeStyle = '#222222';
		game.gridGfx.beginPath();
		for(var i=l+cs/2;i<r;i+=cs)
		for(var j=t+cs/2;j<b;j+=cs){
			game.gridGfx.moveTo(i-4,j);game.gridGfx.lineTo(i+4,j);
			game.gridGfx.moveTo(i,j-4);game.gridGfx.lineTo(i,j+4);
			if(game.cellSize < 30)continue;
			game.gridGfx.moveTo(i-7,j);game.gridGfx.arc(i,j,7,-Math.PI,Math.PI);
		}game.gridGfx.stroke();

		// draw level borders
		game.gridGfx.strokeStyle = '#888888';
		game.gridGfx.beginPath();
		game.gridGfx.rect(l-4,t-4,r-l+8,b-t+8);
		game.gridGfx.stroke();

		// draw background and occlude level at borders
		// TODO: OPTIMIZE THIS
		game.bkgndGfx.fillStyle = '#000000';
		game.bkgndGfx.rect(0,0,App.Canvases.width,App.Canvases.height);
		game.bkgndGfx.fill();
		game.bkgndGfx.strokeStyle = '#090909';
		game.bkgndGfx.beginPath();
		for(var i=1;i<App.Canvases.width+App.Canvases.height;i+=6){
			game.bkgndGfx.moveTo(i,0);
			game.bkgndGfx.lineTo(0,i);
		}game.bkgndGfx.stroke();
		game.bkgndGfx.globalCompositeOperation = 'destination-out';
		game.bkgndGfx.rect(l-6,t-6,r-l+12,b-t+12);
		game.bkgndGfx.fill();
		game.bkgndGfx.globalCompositeOperation = 'source-over';

		if(game.mode === game.modes.PLANNING &&
		   game.currentPlanningLevel !== undefined)
			game.currentPlanningLevel.staticRender();
		else if(game.currentSimulationLevel !== undefined)
			game.currentSimulationLevel.staticRender();
	}

	game.dynamicRender = function(){
		if(game.mode === game.modes.PLANNING &&
		   game.currentPlanningLevel !== undefined)
			game.currentPlanningLevel.dynamicRender();
		else if(game.currentSimulationLevel !== undefined){
			game.interpolation = (App.Engine.tick-game.lastCycleTick)
				           / (game.nextCycleTick-game.lastCycleTick); // this is a division, NOT A COMMENT
			game.currentSimulationLevel.dynamicRender();
		}

		game.renderDebug();
	}

	// This is a highly useful tool but not something we want while we show Nikan/Dave
	game.renderDebug = function(){
		if(!game.debug)return;
		game.debugGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		game.debugGfx.fillStyle = 'rgba(0,0,0,0.7)'
		game.debugGfx.fillRect(5,5,300,81);

		game.debugGfx.font = 'bold 11px arial';
		game.debugGfx.fillStyle = '#ffffff';
		game.debugGfx.fillText('FPS: '+Math.round(App.Engine.fps) ,11,22);
		game.debugGfx.fillText('Cycle: '+game.cycle               ,11,33);
		if(game.paused){
			game.debugGfx.fillStyle = '#ff0000';
			game.debugGfx.fillText('Speed: PAUSED',11,44);
			game.debugGfx.fillStyle = '#ffffff';
		}else game.debugGfx.fillText('Speed: '+game.simulationSpeed+' ms/tick',11,44);
		game.debugGfx.fillText('Tick: '+App.Engine.tick           ,11,55);
		game.debugGfx.fillText('Zoom: '+game.cellSizeFactor       ,11,66);
		game.debugGfx.fillText('Mode: '+game.mode       ,11,77);

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
