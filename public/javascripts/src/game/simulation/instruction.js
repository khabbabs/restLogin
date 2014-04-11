App.SimulationInstruction = function(level,x,y,color,type){
	// this assumes valid input from the planning level

	level.instructions.push(this);
	level.getCell(x,y).instructions[color] = this;

	this.gfx = App.Game.instructionGfx;
	this.level = level;
	this.cell = level.getCell(x,y);
	this.x = x;
	this.y = y;
	this.color = color;
	this.type = type;

	this.staticRender = function(){
		this.gfx.save();

		var rx,ry,size = App.Game.cellSize;
		switch(this.color){
			case App.COLORS.RED:    rx=x*size;        ry=y*size;        break;
			case App.COLORS.GREEN:  rx=x*size+size/2; ry=y*size;        break;
			case App.COLORS.BLUE:   rx=x*size;        ry=y*size+size/2; break;
			case App.COLORS.YELLOW: rx=x*size+size/2; ry=y*size+size/2; break;
		}

		App.InstCatalog.render(this.gfx,this.type,rx,ry,this.color,size/2);
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
				a.tokenHeld = new App.SimulationToken(this.level,this.x,this.y,Math.floor(Math.random()*9+1));
			};break;

		case App.InstCatalog.TYPES['OUT']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				a.tokenHeld = undefined;
			};break;

		case App.InstCatalog.TYPES['GRAB']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined && this.cell.tokens.length !== 0){
					a.tokenHeld = this.cell.tokens.pop();
					App.Game.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['DROP']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined){
					this.cell.tokens.push(a.tokenHeld);
					a.tokenHeld = undefined;
					App.Game.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['GRAB/DROP']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined){
					if(this.cell.tokens.length !== 0){
						a.tokenHeld = this.cell.tokens.pop();
						App.Game.requestStaticRenderUpdate = true; // XXX: move this to token...?
					}
				}else{
					this.cell.tokens.push(a.tokenHeld);
					a.tokenHeld = undefined;
					App.Game.requestStaticRenderUpdate = true; // XXX: move this to token...?
				}
			};break;

		case App.InstCatalog.TYPES['INC']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined)a.tokenHeld.increment();
			};break;

		case App.InstCatalog.TYPES['DEC']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld !== undefined)a.tokenHeld.decrement();
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

		case App.InstCatalog.TYPES['COND 0 U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number === 0)
					a.direction = App.DIRECTIONS.UP;
					
			};break;

		case App.InstCatalog.TYPES['COND 0 D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number === 0)
					a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND 0 L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number === 0)
					a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND 0 R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number === 0)
					a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND TOKEN R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				a.direction = App.DIRECTIONS.RIGHT;
			};break;

		case App.InstCatalog.TYPES['COND + U']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number > 0)
					a.direction = App.DIRECTIONS.UP;
			};break;

		case App.InstCatalog.TYPES['COND + D']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number > 0)
					a.direction = App.DIRECTIONS.DOWN;
			};break;

		case App.InstCatalog.TYPES['COND + L']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number > 0)
					a.direction = App.DIRECTIONS.LEFT;
			};break;

		case App.InstCatalog.TYPES['COND + R']:

			this.execute = function(a){
				if(!a.colorFlags[this.color])return;
				if(a.tokenHeld === undefined)return;
				if(a.tokenHeld.number > 0)
					a.direction = App.DIRECTIONS.RIGHT;
			};break;
	}
}
