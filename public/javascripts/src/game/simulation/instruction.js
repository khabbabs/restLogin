App.SimulationInstruction = function(level,x,y,color,type,data){
	level.instructions.push(this);
	level.getCell(x,y).instructions[color] = this;

	this.gfx = App.GameRenderer.instructionGfx;
	this.level = level;
	this.cell = level.getCell(x,y);
	this.x = x;
	this.y = y;
	this.color = color;
	this.type = type;
	this.data = data;

	this.staticRender = function(){
		if(!App.Game.visibilities[this.color])
			return;
		this.gfx.save();

		var rx,ry,cs = App.GameRenderer.cellSize;
		switch(this.color){
			case App.COLORS.RED:    rx=this.x*cs;      ry=this.y*cs;      break;
			case App.COLORS.GREEN:  rx=this.x*cs+cs/2; ry=this.y*cs;      break;
			case App.COLORS.BLUE:   rx=this.x*cs;      ry=this.y*cs+cs/2; break;
			case App.COLORS.YELLOW: rx=this.x*cs+cs/2; ry=this.y*cs+cs/2; break;
		}

		var data = this.data;
		var streamBkg = false;
		if(this.type === App.InstCatalog.TYPES['IN'] || this.type === App.InstCatalog.TYPES['OUT'])streamBkg = true;
		if(this.type === App.InstCatalog.TYPES['FLIP FLOP U']
		|| this.type === App.InstCatalog.TYPES['FLIP FLOP D']
		|| this.type === App.InstCatalog.TYPES['FLIP FLOP L']
		|| this.type === App.InstCatalog.TYPES['FLIP FLOP R'])
			data = App.Game.flipFlop[this.color];
		App.InstCatalog.render(this.gfx,this.type,rx,ry,this.color,cs/2,data,streamBkg);
		this.gfx.restore();
	}

	// ========================================================== //
	// ================= I N S T R U C T I O N S ================ //
	// ========================================================== //

	switch(type){

		case App.InstCatalog.TYPES['SPAWN UP']:

			new App.SimulationAutomaton(level,x,y,App.DIRECTIONS.UP,color);
			this.execute = function(a){};break; // do nothing

		case App.InstCatalog.TYPES['SPAWN DOWN']:

			new App.SimulationAutomaton(level,x,y,App.DIRECTIONS.DOWN,color);
			this.execute = function(a){};break; // do nothing

		case App.InstCatalog.TYPES['SPAWN LEFT']:

			new App.SimulationAutomaton(level,x,y,App.DIRECTIONS.LEFT,color);
			this.execute = function(a){};break; // do nothing

		case App.InstCatalog.TYPES['SPAWN RIGHT']:

			new App.SimulationAutomaton(level,x,y,App.DIRECTIONS.RIGHT,color);
			this.execute = function(a){};break; // do nothing

		case App.InstCatalog.TYPES['UP']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['DOWN']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['LEFT']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['RIGHT']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['IN']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined)return;

				if(this.data){
					var stackNum = App.Game.inStreams[this.data][3];
					while(stackNum >= App.Game.inStreams[this.data][2].length-1)
						App.Game.generateTokenWave();
					var tokenNum = App.Game.inStreams[this.data][2][stackNum];
					a.tokenHeld = new App.SimulationToken(this.level,this.x,this.y,tokenNum);
					++App.Game.inStreams[this.data][3];
				}else{
					a.tokenHeld = new App.SimulationToken(this.level,this.x,this.y,Math.floor(Math.random()*10));
				}
			};break;

		case App.InstCatalog.TYPES['OUT']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;

				if(this.data){
					var stackNum = App.Game.outStreams[this.data][3];
					while(stackNum >= App.Game.outStreams[this.data][2].length-1)
						App.Game.generateTokenWave();
					var tokenNum = App.Game.outStreams[this.data][2][stackNum];
					if(a.tokenHeld.number !== tokenNum){
						App.Game.simulationError(a.tokenHeld.number+" !== "+tokenNum);
						return;
					}a.tokenHeld = undefined;
					++App.Game.outStreams[this.data][3];
				}else{
					a.tokenHeld = undefined;
				}
			};break;

		case App.InstCatalog.TYPES['GRAB']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined && this.cell.tokens.length !== 0){
					a.tokenHeld = this.cell.tokens.pop();
					App.GameRenderer.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['DROP']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined){
					this.cell.tokens.push(a.tokenHeld);
					a.tokenHeld = undefined;
					App.GameRenderer.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['GRAB/DROP']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined){
					if(this.cell.tokens.length !== 0){
						a.tokenHeld = this.cell.tokens.pop();
						App.GameRenderer.requestStaticRenderUpdate = true; // XXX: move this to token...?
					}
				}else{
					this.cell.tokens.push(a.tokenHeld);
					a.tokenHeld = undefined;
					App.GameRenderer.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['INC']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined){
					if(this.cell.topToken() !== undefined)
						a.tokenHeld.add(this.cell.topToken());
					else a.tokenHeld.add(1);
				}
			};break;

		case App.InstCatalog.TYPES['DEC']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined){
					if(this.cell.topToken() !== undefined)
						a.tokenHeld.sub(this.cell.topToken());
					else a.tokenHeld.sub(1);
				}
			};break;

		case App.InstCatalog.TYPES['SET']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined && this.cell.topToken() !== undefined)
					a.tokenHeld.number = this.cell.topToken();
			};break;

		case App.InstCatalog.TYPES['SYNC']:

			this.execute = function(a){
				this.cell.sync();
			};break;

		case App.InstCatalog.TYPES['COLOR TOGGLE']:

			this.execute = function(a){
				a.colorFlags[this.color] = !a.colorFlags[this.color];
			};break;

		case App.InstCatalog.TYPES['PAUSE']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				App.Game.requestPause = true;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(this.cell.tokens.length === 0)return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(this.cell.tokens.length === 0)return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(this.cell.tokens.length === 0)return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(this.cell.tokens.length === 0)return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['COND EQUAL U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(this.cell.topToken() !== undefined){
					if(this.cell.topToken() !== a.tokenHeld.number)return;
				}else if(a.tokenHeld.number !== 0)return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['COND EQUAL D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(this.cell.topToken() !== undefined){
					if(this.cell.topToken() !== a.tokenHeld.number)return;
				}else if(a.tokenHeld.number !== 0)return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND EQUAL L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(this.cell.topToken() !== undefined){
					if(this.cell.topToken() !== a.tokenHeld.number)return;
				}else if(a.tokenHeld.number !== 0)return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND EQUAL R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(this.cell.topToken() !== undefined){
					if(this.cell.topToken() !== a.tokenHeld.number)return;
				}else if(a.tokenHeld.number !== 0)return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['COND + U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number <= 0)return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['COND + D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number <= 0)return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND + L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number <= 0)return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND + R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number <= 0)return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['FLIP FLOP U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				App.Game.flipFlop[this.color] = !App.Game.flipFlop[this.color];
				App.GameRenderer.requestStaticRenderUpdate = true;
				if(App.Game.flipFlop[this.color] === true)return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['FLIP FLOP D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				App.Game.flipFlop[this.color] = !App.Game.flipFlop[this.color];
				App.GameRenderer.requestStaticRenderUpdate = true;
				if(App.Game.flipFlop[this.color] === true)return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['FLIP FLOP L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				App.Game.flipFlop[this.color] = !App.Game.flipFlop[this.color];
				App.GameRenderer.requestStaticRenderUpdate = true;
				if(App.Game.flipFlop[this.color] === true)return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['FLIP FLOP R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				App.Game.flipFlop[this.color] = !App.Game.flipFlop[this.color];
				App.GameRenderer.requestStaticRenderUpdate = true;
				if(App.Game.flipFlop[this.color] === true)return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;
	}
}
