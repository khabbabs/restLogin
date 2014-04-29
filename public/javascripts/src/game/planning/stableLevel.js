App.PlanningInstruction = function(x,y,color,type,data){
	this.x        = x;
	this.y        = y;
	this.color    = color;
	this.type     = type;
	this.data     = data;
	this.selected = false;
}

//============================================================================//

App.PlanningLevel = function(){
	this.name;
	this.dateCreated;
	this.width;
	this.height;
	this.grid = [];
	this.undoStack = [];

/*
	this.undoStack[0] = [] of old state
	this.undoStack[1] = [] of new state
*/

		// ---------------------------------------------

	this.insert = function(x,y,color,type,data){
		var i = this.grid[x];
		if(i === undefined)i = this.grid[x] = [];
		var j = i[y];
		if(j === undefined)j = i[y] = [];
		var c = j[color];
		if(c !== undefined)return false;
		j[color] = new App.PlanningInstruction(x,y,color,type,data);
		return true;
	}

	this.delete = function(x,y,color){

	}

		// ---------------------------------------------

	this.undo = function(){}
	this.redo = function(){}

		// ---------------------------------------------

	this.userInsert = function(x,y,color,type,data){}
	this.userCopy = function(x0,y0,x1,x1){}
	this.userMove = function(x0,y0,x1,x1){}
	this.userDelete = function(){}

		// ---------------------------------------------

	this.generateSimulationLevel = function(){
		var level = new App.SimulationLevel(this.width,this.height);
		for(var i in this.grid)
		for(var j in this.grid[i])
		for(var c in this.grid[i][j]){
			var ins = this.grid[i][j][c];
			if(ins)new App.SimulationInstruction(level,ins.x,ins.y,ins.color,ins.type,ins.data);
		}return level;
	};

	this.generateParseString = function(){
		var str = [];
		str.push(this.name+'`'+this.dateCreated+'`'+this.width+'`'+this.height);
		for(var i in this.grid)
		for(var j in this.grid[i])
		for(var c in this.grid[i][j])
		if(this.grid[i][j][c])
			str.push(i+'`'+j+'`'+c+'`'+this.grid[i][j][c]);
		return str.join('~');
	};

		// ---------------------------------------------

	this.staticRender = function(){
		var cs = App.GameRenderer.cellSize;
		for(var c=0;c<4;++c){
			App.GameRenderer.instructionGfx.save();
			switch(c){
				case 0:App.GameRenderer.instructionGfx.translate(0,0);break;
				case 1:App.GameRenderer.instructionGfx.translate(cs/2,0);break;
				case 2:App.GameRenderer.instructionGfx.translate(0,cs/2);break;
				case 3:App.GameRenderer.instructionGfx.translate(cs/2,cs/2);break;
			}

			for(var i in this.grid)
			for(var j in this.grid[i]){
				var ins = this.grid[i][j][c];
				if(ins){
					var streamBkg = false;
					if(ins.type === App.InstCatalog.TYPES['IN'] || ins.type === App.InstCatalog.TYPES['OUT'])streamBkg = true;
					App.InstCatalog.render(App.GameRenderer.instructionGfx,ins.type,ins.x*cs,ins.y*cs,ins.color,cs/2,ins.data,streamBkg);
				}
			}

			App.GameRenderer.instructionGfx.restore();
		}
	}

	this.dynamicRender = function(){}
}
