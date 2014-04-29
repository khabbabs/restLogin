App.SimulationCell = function(level,x,y){
	this.level = level;
	this.x = x;
	this.y = y;
	this.tokens       = [];
	this.automatons   = [];
	this.instructions = [];

	this.clean = function(){
		// remove this cell if its empty
		if(this.tokens.length       === 0 && this.automatons.length === 0 &&
		   this.instructions.length === 0){
			level.removeCell(this.x,this.y);
			return;
		}
	}

	this.process = function(c){
		// execute instructions
		for(var a in this.automatons){
			var instruction = this.instructions[c];
			if(instruction)instruction.execute(this.automatons[a]);
		}
	}

	this.topToken = function(){
		return this.tokens.length !== 0?this.tokens[this.tokens.length-1].number:undefined;
	}

	this.staticRender = function(){
		for(var i in this.instructions)this.instructions[i].staticRender();
		// TODO: stack graphic for overlapping tokens
		for(var t in this.tokens)this.tokens[t].staticRender(x*App.GameRenderer.cellSize,y*App.GameRenderer.cellSize);
	}

	this.lastSyncCycle = -1;
	this.sync = function(){
		// ensure this only gets executed once per cycle per cell
		if(App.Game.cycle === this.lastSyncCycle)return;
		this.lastSyncCycle = App.Game.cycle;

		// identify sync colors
		var color = [false,false,false,false];
		for(var c in App.COLORS){
			var i = this.instructions[App.COLORS[c]];
			if(i !== undefined && i.type === App.InstCatalog.TYPES['SYNC'])
				color[App.COLORS[c]] = true;
		}

		// lock color-matched automaton
		for(var a in this.automatons){
			var autom = this.automatons[a];
			for(var c in color)
			if(color[c] && autom.colorFlags[c])
				autom.wait = true;
		}

		// identify fulfilled syncs
		for(var c in App.COLORS)for(var a in this.automatons){
			if(this.automatons[a].colorFlags[App.COLORS[c]])
				color[App.COLORS[c]] = false;
		}

		// if all syncs are fulfilled, release automaton
		for(var c in color)if(color[c])return;
		for(var a in this.automatons)this.automatons[a].wait = false;
	}
}
