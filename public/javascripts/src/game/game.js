App.makeGame = function(){
	var game = {};

	// ========================================================== //
	// ====================== LEVEL-SPECIFIC ==================== //
	// ========================================================== //

	game.currentPlanningLevel;
	game.currentSimulationLevel;

	game.streams    = [];
	game.inStreams  = []; // inStreams[variable] = [raw,parsed,[gives],stackPtr,color]
	game.outStreams = []; // outStreams[variable] = [raw,parsed,[wants],stackPtr,quota,description,color]
	game.flipFlop   = [true,true,true,true];
	game.visibilities=[true,true,true,true];

	game.toggleVisible = function(c){game.visibilities[c] = !game.visibilities[c]; App.GameRenderer.requestStaticRenderUpdate = true;}

	game.createNewLevel = function(name,width,height){
		var lvl = new App.PlanningLevel();
		lvl.name        = name;
		lvl.dateCreated = new Date.getTime();
		lvl.width       = width;
		lvl.height      = height;
		return lvl;
	}

	// returns undefined if the level string is invalid
	game.parseLevel = function(str){
		var lvl = new App.PlanningLevel();
		if(!str)return undefined;
		var data = str.split('~');
		for(var i=0;i<data.length;++i)data[i] = data[i].split('`');
		if(data.length<1)return undefined;
		if(data[0].length!==4)return undefined;
		lvl.name        = data[0][0];
		lvl.dateCreated = parseInt(data[0][1]);
		lvl.width       = parseInt(data[0][2]);
		lvl.height      = parseInt(data[0][3]);
		game.streams    = [];
		game.inStreams  = [];
		game.outStreams = [];
		if(isNaN(lvl.dateCreated) || isNaN(lvl.width) || isNaN(lvl.height))return undefined;
		if(lvl.width < 0 || lvl.height < 0)return undefined;
		for(var i=1;i<data.length;++i){
			if(data[i].length<4)return undefined;
			var x = parseInt(data[i][0]);
			var y = parseInt(data[i][1]);
			var c = parseInt(data[i][2]);
			var t = parseInt(data[i][3]);
			var d = data[i][4];
			if(isNaN(x) || isNaN(y) || isNaN(c) || isNaN(t))return undefined;
			if(lvl.width  !== 0 && (x < 0 || x >= lvl.width ))return undefined;
			if(lvl.height !== 0 && (y < 0 || y >= lvl.height))return undefined;
			if(c < 0 || c >= 4)return undefined;
			if(d !== undefined && game.streams[d])return undefined;
		//	if(!lvl.insert(x,y,c,t,d))return undefined;
			var ins = new App.PlanningInstruction(x,y,c,t,d);
			ins.isProtected = true;
			if(!lvl.insert(ins))return undefined;
			switch(t){ // TODO: MOVE THIS TO PLANNING LEVEL INSERT | ADD APPROPRIATE STUFF TO PLANNING LEVEL DELETE
				case App.InstCatalog.TYPES['IN']:
					if(data[i].length <= 4)
						return undefined;
					var p = Parser.parse(data[i][5]);
					if(p === undefined)return undefined;
					game.inStreams[d]=[data[i][5],p,[],0,c];
					ins.data2 = data[i][5];
					break;
				case App.InstCatalog.TYPES['OUT']:
					if(data[i].length <= 4)
							return undefined;
					var p = Parser.parse(data[i][5]);
					if(p === undefined)return undefined;
					game.outStreams[d]=[data[i][5],p,[],0,data[i][6],data[i][7],c];
					ins.data2 = data[i][5];
					break;
			}game.streams[d] = true;
		}

		lvl.killUndo();
		return lvl;
	}

	game.addStream = function(letter, isInStream, func, funcString, total, color){
		game.streams[letter] = true;
		if(!isInStream)
			game.outStreams[letter] = [funcString, func, [], 0, total, undefined, color];
		else
			game.inStreams[letter] =  [funcString, func, [], 0, color];
	}
	game.removeStream = function(letter){
		delete(App.Game.outStreams[letter]);
		delete(App.Game.inStreams[letter]);
		App.Game.streams[letter] = false;
	}

		/*--------------------------------------------*/

	game.loadLevel = function(levelString,mode){
		// TODO: setup render vars (center level, default zoom)
	}

	game.loadNewLevel = function(str){
		var level = parseLevel(str);
		if(!level)return false;
		this.currentPlanningLevel = level;
		return true;
	}

	// ========================================================== //
	// ====================== MODE-SPECIFIC ===================== //
	// ========================================================== //

		/*+------------------------------------------+*/

	game.modes = {PLANNING:0,SIMULATION:1};
	game.mode = game.modes.PLANNING; // XXX: shouldnt this be setup by the initializing context

	game.setMode = function(mode){
		if(mode === game.mode)return;
		game.toggleMode();
	}


	game.toggleMode = function(){
		if(game.mode === game.modes.PLANNING){
			game.mode = game.modes.SIMULATION;
			game.currentSimulationLevel = game.currentPlanningLevel.generateSimulationLevel();
			game.paused = false;
			game.nextCycleTick = App.Engine.tick;
			game.cycle = 0;
			App.GameRenderer.requestStaticRenderUpdate = true;
			game.tokenSeed = game.currentPlanningLevel.dateCreated;
			for(var i in game.inStreams){
				game.inStreams[i][2] = [];
				game.inStreams[i][3] = 0;
			}for(var i in game.outStreams){
				game.outStreams[i][2] = [];
				game.outStreams[i][3] = 0;
			}game.generateTokenWave();
			game.flipFlop = [true,true,true,true];

			App.Game.currentPlanningLevel.currentSelection = [];
			App.GameRenderer.tempGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
		}else{
			game.mode = game.modes.PLANNING;
			game.currentSimulationLevel = undefined;
			game.paused = true;
			App.GameRenderer.automGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			App.GameRenderer.tokenSGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			App.GameRenderer.tokenDGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			App.GameRenderer.requestStaticRenderUpdate = true;
		}
	}

	// ========================================================== //
	// =================== SIMULATION-SPECIFIC ================== //
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

	game.tokenSeed;

	game.randToken = function(a,b){
		return Math.floor((Math.abs(9876413*Math.tan(++game.tokenSeed))%(b-a))+a);
	}

	game.generateTokenWave = function(){
		var vals = [];
		for(var i in game.inStreams){
			var val = vals[i] = game.inStreams[i][1].evaluate();
			if(val === undefined){
				game.simulationError("Invalid stream input"); // XXX: CAN WE DETERMINE THIS AT LEVEL PARSE TIME
				return;
			}game.inStreams[i][2].push(val);
		}for(var i in game.outStreams){
			var val = game.outStreams[i][1].evaluate(vals);
			if(val === undefined){
				game.simulationError("Invalid stream output"); // XXX: CAN WE DETERMINE THIS AT LEVEL PARSE TIME
				return;
			}game.outStreams[i][2].push(val);
		}
	}

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

				if(Object.keys(game.outStreams).length > 0){
					var success = false;
					for(var i in game.outStreams){
						if(game.outStreams[i][4] == 0)break;
						if(game.outStreams[i][4] <= game.outStreams[i][3])
							success = true;
					}
					if(success)game.simulationSuccess();
				}

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
	}

	game.pause = function(){
		game.paused = !game.paused;
		if(!game.paused && game.mode === game.modes.PLANNING)game.setMode(game.modes.SIMULATION);
		game.pauseTick = App.Engine.tick;
		game.pauseLastCycleTick = game.lastCycleTick;
		game.pauseNextCycleTick = game.nextCycleTick;
	}

	game.setSimulationSpeed = function(speed){
		if(game.paused)game.pause();
		if(game.mode === game.modes.PLANNING)game.setMode(game.modes.SIMULATION);
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


	game.simulationError = function(errorMsg){
		App.ModeHandler.pushMode('error');
	}

	game.simulationSuccess = function(){
		App.ModeHandler.pushMode('success');
	}

	// ========================================================== //

	return game;
}
