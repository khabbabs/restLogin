App.SimulationLevel = function(width,height){
	this.width  = width;
	this.height = height;
	this.grid         = [];
	this.tokens       = [];
	this.automatons   = [];
	this.instructions = [];

	// ========================================================== //

	this.getCell = function(x,y){
		var i = this.grid[x];
		if(i === undefined)i = this.grid[x] = [];
		var j = i[y];
		if(j === undefined)j = i[y] = new App.SimulationCell(this,x,y);
		return j;
	}

	this.removeCell = function(x,y){
		var i = this.grid[x];
		if(i === undefined)return;
		i[y] = undefined;
	}

	// ========================================================== //

	this.update = function(){
		// cell verification
		for(var i in this.grid)for(var j in this.grid[i]){
			var cell = this.grid[i][j];
			if(cell === undefined)continue;
			this.grid[i][j].clean();
		}

		// level-wide color-prioritized instruction execution
		for(var c in App.COLORS)for(var i in this.grid)for(var j in this.grid[i]){
			var cell = this.grid[i][j];
			if(cell === undefined)continue;
			this.grid[i][j].process(App.COLORS[c]);
		}

		// ALL automatons MUST be processed before theyre moved
		for(var i in this.automatons)this.automatons[i].move();
	}

	this.staticRender = function(){
		// TODO: OPTIMIZE RENDERING: ONLY RENDER STUFF INSIDE WINDOW
		for(var i in this.grid)/* TODO: if i intersects with window */
		for(var j in this.grid[i])/* TODO: if j intersects with window */{
			var cell = this.grid[i][j];
			if(cell === undefined)continue;
			this.grid[i][j].staticRender();
		}
	}

	this.dynamicRender = function(){
		// TODO: OPTIMIZE RENDERING: ONLY RENDER STUFF INSIDE WINDOW
		for(var i in this.automatons)this.automatons[i].dynamicRender();
		// TODO: render sfx animation layers
	}
}
