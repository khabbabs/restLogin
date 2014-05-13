App.PlanningLevel = function(){
	var that = this;

	this.name;
	this.dateCreated;
	this.id = 1; //used for leaderboards
	this.width;
	this.height;
	this.grid = [];
	this.currentSelection = [];
	this.undoStack = [];
	this.redoStack = [];
	this.pristine = true; //set to false as soon as first insertion occurs!
	this.locks = [false, false, false, false]; // R,G,B,Y
	this.instructionLock = false;
	this.graphics = new App.PlanningGraphics();

	// ---------------------------------------------

	this.operation = function(opId, instructions, shiftX, shiftY, param, newVal, oldVal){
		this.opId = opId;
		this.instructions = instructions;
		this.shiftX = shiftX; this.shiftY = shiftY;
		this.param = param;
		this.newVal = newVal;
		this.oldVal = oldVal;
	}

	// returns an array that can have up to four instruction for the tile at x,y
	this.getCell = function(x,y){
		//Note: I edited this to prevent a potential crash and/or undefined being passed around.
		if(!that.grid[x] || !that.grid[x][y])
			return null;

		return that.grid[x][y];
	};

	// returns the instruction at x,y, color
	this.getInstruction = function(x,y,color){
		if(!that.grid[x] || !that.grid[x][y] || !that.grid[x][y][color])
			return null;

			return that.grid[x][y][color];
	};

	// checks whether or not an instruction in a grid cell has been defined or not
	this.contains = function(x, y, c){
		return (!!that.grid[x] && !!that.grid[x][y] && !!that.grid[x][y][c]); // added !!
	};

	// clears an entire cell
	this.removeCell = function(x,y){
		for(var c = 0; c < that.numColors; c++){
			if(that.grid[x]){
				if(that.grid[x][y]){
					that.grid[x][y][c] = null;
				}
			}
		}
	};

	// applies function f() to each cell in the grid
	this.forEachCell = function(f){
		for(var y = 0; y < that.height; y++){
			for(var x = 0; x < that.width; x++){
				for(var c = 0; c < that.numColors; c++){
					if(that.contains(x, y, c)){
						f(that.grid[x][y][c]);
					}
				}
			}
		}
	};

	this.toggleLock = function(color){
		if(that.locks[color] === true){that.locks[color] = false; }
		else{
			that.locks[color] = true;
			for(var i = 0; i < that.currentSelection.length; ++i){
				if(that.isLocked(that.currentSelection[i].color)){ that.currentSelection.splice(i,1); i--; }
			}
		}
	}

	this.lockInstructions = function(){ that.instructionLock = true; }
	this.unlockInstructions = function(){ that.instructionLock = false; }

	this.setLock = function(color, state){ that.locks[color] = state; }

	// returns the states of the specified layer lock
	this.isLocked = function(color){ return that.locks[color]; }

	// fills currentSelection list of all unlocked instructions in cells between the specified coordinates
	this.selectInstructions = function(x1, y1, c1, x2, y2, c2){
		var that = App.Game.currentPlanningLevel; // TODO wierd bug with 'that'. not sure why this was needed
		that.currentSelection = [];
		if(x1 === x2 && y1 === y2 && c1 === c2){ // click select
			if(that.getInstruction(x1,y1,c1) && !that.isLocked(that.getInstruction(x1,y1,c1).color)){
				if( (that.instructionLock && !that.getInstruction(x1,y1,c1).locked) || !that.instructionLock ){
					that.currentSelection[0] = that.getInstruction(x1,y1,c1);
				}
			}
			else{ // click in empty space - clear selection
				that.currentSelection = [];
			}
		}
		else{ //drag select
			var p1 = that.xycToij(x1, y1, c1);
			var p2 = that.xycToij(x2, y2, c2);

			var upperLeft = [-1,-1];
			var lowerRight = [-1,-1];

			if(p1[0] < p2[0]){ upperLeft[0] = p1[0]; lowerRight[0] = p2[0]; }else{ upperLeft[0] = p2[0]; lowerRight[0] = p1[0]; }
			if(p1[1] < p2[1]){ upperLeft[1] = p1[1]; lowerRight[1] = p2[1]; }else{ upperLeft[1] = p2[1]; lowerRight[1] = p1[1]; }

			var numInstr = 0;
			var temp;
			for(var j = upperLeft[1]; j <= lowerRight[1]; j += .5){
				for(var i = upperLeft[0]; i <= lowerRight[0]; i += .5){
					temp = that.getInstruction(that.ijToxyc(i,j)[0], that.ijToxyc(i,j)[1], that.ijToxyc(i,j)[2]);
					if(temp && !that.isLocked(temp.color)){
						if(that.lockInstructions && !temp.locked){
							that.currentSelection[numInstr] = temp;
							++numInstr;
						}
					}
				}
			}
		}
	}

	this.validateGrid = function(){
		for(var x in that.grid){
			if(that.grid[x]) for(var y in that.grid[x]){
				if(that.grid[x][y]) for(var c in that.grid[x][y]){
					if(that.grid[x][y][c] && (('' + that.grid[x][y][c].x !== x) || ('' + that.grid[x][y][c].y !== y))){
						/* console.log(x + ' ' + y + ' ' + c + ' : ' + that.grid[x][y][c].x + ' ' + that.grid[x][y][c].y); */
					}
				}
			}
		}
	}

	this.xycToij = function(x,y,c){
		var coords = [x, y];
		if(c === 1 || c === 3){ coords[0] += .5; }
		if(c === 2 || c === 3){ coords[1] += .5; }
		return coords;
	}

	this.ijToxyc = function(i,j){
		var coords = [i,j];
		if(i%1 === 0 && j%1 === 0){ coords[2] = 0; }
		if(i%1 === .5 && j%1 === 0){ coords[2] = 1; coords[0] -= .5; }
		if(i%1 === 0 && j%1 === .5){ coords[2] = 2; coords[1] -= .5; }
		if(i%1 === .5 && j%1 === .5){ coords[2] = 3; coords[0] -= .5; coords[1] -= .5;}
		return coords;
	}

	this.toList = function(x){

		if(!x){ return [null]; }

		if(x[0] === undefined){
			var temp = x;
			x = [];
			x[0] = temp;
		}
		return x;
	}

	this.hasStream = function(x,y){
		if(that.grid[x] && that.grid[x][y]){
			for(var instr in that.grid[x][y]){
				if(that.grid[x][y][instr] && (that.grid[x][y][instr].type === 9 || that.grid[x][y][instr].type === 8)){ return true; }
			}
		}
		return false;
	}

	// this function takes a list of PlanningInstructions and inserts them into the grid
	this.insert = function(instructions){
		that.pristine = false; //to prevent level dimension changes
		instructions = that.toList(instructions);
		overwriteList = [];

		for(var i in instructions){ // check that the insert can complete succesfully

			if(that.width !== 0 && (instructions[i].x < 0 || instructions[i].x >= that.width)){ /* console.log('insert out of bounds'); */ return false; }
			if(that.height !== 0 && (instructions[i].y < 0 || instructions[i].y >= that.height)){ /* console.log('insert out of bounds'); */ return false; }
			if(that.isLocked(instructions[i].color)){ /* console.log('layer locked'); */ return; }
			if(that.instructionLock === true && instructions[i].locked){ return; }
			if( (instructions[i].type === 8 || instructions[i].type === 9) && that.hasStream(instructions[i].x,instructions[i].y) ){ return; }
			if( instructions[i].type === 8){ inStreamDat = true; }
			if( instructions[i].type === 9){ outStreamDat = true; }
			if(that.getInstruction(instructions[i].x, instructions[i].y, instructions[i].color)){ return; }
		}

		for(var i in instructions){
			if(instructions[i].type === 8){ instructions[i].streamData = App.Game.inStreams[instructions[i].data]; }
			if(instructions[i].type === 9){ instructions[i].streamData = App.Game.outStreams[instructions[i].data]; }

			if(!that.grid[instructions[i].x]){ that.grid[instructions[i].x] = []; }
			if(!that.grid[instructions[i].x][instructions[i].y]){ that.grid[instructions[i].x][instructions[i].y] = []; }
			that.grid[instructions[i].x][instructions[i].y][instructions[i].color] = instructions[i];
		}

		that.undoStack.push(new that.operation('ins', instructions, null, null, null, null, null));

		that.killRedo('kill redo: insert');
		that.validateGrid();
		App.GameRenderer.requestStaticRenderUpdate = true;
		return true;
	}

	// this function takes a list of coordinate triplets and deletes the corresponding instructions from the grid
	this.delete = function(instructions){
		if(that.currentSelection === []){ return; }
		instructions = that.toList(instructions);
		for(i in instructions){
			if(that.isLocked(instructions[i].color)){ /* console.log('layer locked'); */ return; }
			if(that.instructionLock === true && instructions[i].locked){ return; }
			if(instructions[i].isProtected) { continue; }
			that.grid[instructions[i].x][instructions[i].y][instructions[i].color] = null;
			if(instructions[i].data) App.Game.removeStream(instructions[i].data);
		}
		that.undoStack.push(new that.operation('del', instructions, null, null, null, null));
		that.killRedo('kill redo: delete');
		that.currentSelection = [];
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	}

	// this function takes a list of coordinate triplets and shifts the instructions they point to by shiftX and shiftY
	this.move = function(instructions,shiftX,shiftY){

		instructions = that.toList(instructions);

		for(i in instructions){ // check for multiple streams in same cell
			if(instructions[i].type === 8 || instructions[i].type === 9){
				if(that.hasStream(instructions[i].x+shiftX, instructions[i].y+shiftY)){ return; }
			}
		}

		for(i in instructions){ // remove all from grid to prevent groups from overlapping themselves also update coordinates and bounds check
			var instr = instructions[i];
			if(that.width !== 0 && (instructions[i].x + shiftX < 0 || instructions[i].x + shiftX >= that.width)){ /* console.log('move out of bounds'); */ return; }
			if(that.height !== 0 && (instructions[i].y + shiftY < 0 || instructions[i].y + shiftY >= that.height)){ /* console.log('move out of bounds'); */ return; }
			if(that.instructionLock === true && instructions[i].locked){ return; }
			that.grid[instr.x][instr.y][instr.color] = null;
			instructions[i].x += shiftX;
			instructions[i].y += shiftY;
		}

		// check that no overlap
		for(i in instructions){
			var instr = instructions[i];

			if(that.getInstruction(instr.x, instr.y, instr.color)){
				for(z in instructions){
					instructions[z].x -= shiftX;
					instructions[z].y -= shiftY;
					that.grid[instructions[z].x][instructions[z].y][instructions[z].color] = instructions[z];
				}
				return;
			}
		}

		for(i in instructions){ // place instructions
			var instr = instructions[i];

			if(!that.grid[instr.x]){ that.grid[instr.x] = []; }
			if(!that.grid[instr.x][instr.y]){ that.grid[instr.x][instr.y] = []; }
			that.grid[instr.x][instr.y][instr.color] = instr;
		}

		that.undoStack.push(new that.operation('mov', instructions, shiftX, shiftY, null, null));
		that.killRedo('kill redo: move');
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	}

	// this function takes a list of coordinate triplets and copies the instructions they point to to a new cell shiftX and shiftY away from the first
	this.copy = function(instructions,shiftX,shiftY){

		instructions = that.toList(instructions);

		// create new instructions
		var newInstr = [];
		for(i in instructions){
			var instr = instructions[i];
			if(that.instructionLock === true && instructions[i].locked){ return; }
			newInstr[i] = new App.PlanningInstruction(instr.x+shiftX, instr.y+shiftY, instr.color, instr.type);
		}

		// check that no overlap
		for(i in newInstr){
			var instr = newInstr[i];
			if(that.getInstruction(instr.x, instr.y, instr.color)){ return; }
		}

		for(i in newInstr){ // place instructions
			var instr = newInstr[i];
			if(instr.type === 8 || instr.type === 9){ continue; }
			if(!that.grid[instr.x]){ that.grid[instr.x] = []; }
			if(!that.grid[instr.x][instr.y]){ that.grid[instr.x][instr.y] = []; }
			if(that.width !== 0 && (instr[i].x + shiftX < 0 || instr[i].x + shiftX >= that.width)){ /* console.log('move out of bounds'); */ return; }
			if(that.height !== 0 && (instr[i].y + shiftY < 0 || instr[i].y + shiftY >= that.height)){ /* console.log('move out of bounds'); */ return; }
			that.grid[instr.x][instr.y][instr.color] = instr;
		}

		that.undoStack.push(new that.operation('cpy', instructions, shiftX, shiftY, null, null));
		that.killRedo('kill redo: cpy');
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	}

	// this function takes a list of instructions and changes the specified parameter of all of them to value
	this.modify = function(instructions, parameter, value){
		instructions = that.toList(instructions);
		// check locks and store old colors
		// TODO if more than one instruction is in the same cell and a color change happens it will cause problems
		oldVal = [];
		for(i in instructions){
			if(that.instructionLock === true && instructions[i].locked){ return; }
			oldVal[i] = instructions[i][parameter];
			if(oldVal[i] === value){ return; }
		}

		if(parameter === 'color'){ // color change
			// check that spaces are free for the new colors
			for(i in instructions){
				if(that.getInstruction(instructions[i].x,instructions[i].y, value)){ return; }
			}
			// change value and move
			for(i in instructions){
				instructions[i].color = value;
				that.grid[instructions[i].x][instructions[i].y][instructions[i].color] = instructions[i];
				that.grid[instructions[i].x][instructions[i].y][oldVal[i]] = null;
			}
		}else{ // changes other than color
			for(i in instructions){
				oldVal[i] = instructions[i][parameter];
				instructions[i][parameter] = value;
			}
		}

		for(i in instructions){
			if(instructions[i].type === 8){ instructions[i].streamData = App.Game.inStreams[instructions[i].data]; }
			if(instructions[i].type === 9){ instructions[i].streamData = App.Game.outStreams[instructions[i].data]; }
		}

		// undo stuff
		that.undoStack.push(new that.operation('mod', instructions, 0, 0, parameter, value, oldVal));
		that.killRedo('kill redo: mod');
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	}

	// each call to this function pops the undo stack, and undoes whatever operation it finds
	this.undo = function(){
		var op = that.undoStack.pop();
		if(op === undefined){ return; }
		if(op.opId === 'ins'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				if(op.instructions[i].type === 8 || op.instructions[i].type === 9){
					App.Game.streams[op.instructions[i].data] = false;
				}

				that.grid[x][y][c] = null;
			}
			that.redoStack.push(op);
		}
		else if(op.opId === 'del'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				if(op.instructions[i].type === 8){
					App.Game.streams[op.instructions[i].data] = true;
					App.Game.inStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

				if(op.instructions[i].type === 9){
					App.Game.streams[op.instructions[i].data] = true;
					App.Game.outStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

				that.grid[x][y][c] = op.instructions[i];
			}
			that.redoStack.push(op);
		}
		else if(op.opId === 'mov'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				that.grid[x-op.shiftX][y-op.shiftY][c] = op.instructions[i];
				that.grid[x-op.shiftX][y-op.shiftY][c].x -= op.shiftX;
				that.grid[x-op.shiftX][y-op.shiftY][c].y -= op.shiftY;
				that.grid[x][y][c] = null;
			}
			that.redoStack.push(op);
		}
		else if(op.opId === 'cpy'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				that.grid[x+op.shiftX][y+op.shiftY][c] = null;
			}
			that.redoStack.push(op);
		}
		else if(op.opId === 'mod'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				if(op.param === 'color'){
					for(i in op.instructions){
						op.instructions[i][op.param] = op.oldVal[i];
						that.grid[x][y][op.newVal] = null;
						that.grid[x][y][op.oldVal[i]] = op.instructions[i];
					}
				}else{
					for(i in op.instructions){
						op.instructions[i][op.param] = op.oldVal[i];
					}
				}

				if(op.instructions[i].type === 8){
					App.Game.inStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

				if(op.instructions[i].type === 9){
					App.Game.outStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

			}
			that.redoStack.push(op);
		}
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	};

	// each call to this function pops the redo stack, and undoes whatever operation it finds
	this.redo = function(){
		var op = that.redoStack.pop();
		if(op === undefined){ return; }
		if(op.opId === 'ins'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				that.grid[x][y][c] = op.instructions[i];

				if(op.instructions[i].type === 8){
					App.Game.streams[op.instructions[i].data] = true;
					App.Game.inStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

				if(op.instructions[i].type === 9){
					App.Game.streams[op.instructions[i].data] = true;
					App.Game.outStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}
			}
			that.undoStack.push(op);
		}
		else if(op.opId === 'del'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				if(op.instructions[i].type === 8 || op.instructions[i].type === 9){
					App.Game.streams[op.instructions[i].data] = false;
				}

				that.grid[x][y][c] = null;
			}
			that.undoStack.push(op);
		}
		else if(op.opId === 'mov'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				that.grid[x+op.shiftX][y+op.shiftY][c] = op.instructions[i];
				that.grid[x+op.shiftX][y+op.shiftY][c].x += op.shiftX;
				that.grid[x+op.shiftX][y+op.shiftY][c].y += op.shiftY;
				that.grid[x][y][c] = null;
			}
			that.undoStack.push(op);
		}
		else if(op.opId === 'cpy'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				that.grid[x+op.shiftX][y+op.shiftY][c] = new App.PlanningInstruction(x+op.shiftX, y+op.shiftY, c, op.instructions[i].type);
			}
			that.undoStack.push(op);
		}
		else if(op.opId === 'mod'){
			for(i in op.instructions){
				var x = op.instructions[i].x;
				var y = op.instructions[i].y;
				var c = op.instructions[i].color;

				if(op.param === 'color'){
					for(i in op.instructions){
						op.instructions[i][op.param] = op.newVal;
						that.grid[x][y][op.newVal] = op.instructions[i];
						that.grid[x][y][op.oldVal[i]] = null;
					}
				}else{
					for(i in op.instructions){
						op.instructions[i][op.param] = op.newVal;
					}
				}

				if(op.instructions[i].type === 8){
					App.Game.inStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}

				if(op.instructions[i].type === 9){
					App.Game.outStreams[op.instructions[i].data] = op.instructions[i].streamData;
				}
			}
			that.undoStack.push(op);
		}
		App.GameRenderer.requestStaticRenderUpdate = true;
		that.validateGrid();
	}

	this.killUndo = function(str){ that.undoStack = []; /* console.log(str); */ }
	this.killRedo = function(str){ that.redoStack = []; /* console.log(str); */ }



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
		for(var c in this.grid[i][j]){
			var s = "";
			var inst = this.grid[i][j][c];
			if(inst){
				s = i+'`'+j+'`'+c+'`'+ inst.type;

				if(inst.type === App.InstCatalog.TYPES['IN'] || inst.type === App.InstCatalog.TYPES['OUT']){
					var e = "";
					e = App.Game.inStreams[inst.data] || App.Game.outStreams[inst.data];
					s += ('`'+inst.data + '`' + e[0]);
					if(inst.type === App.InstCatalog.TYPES['OUT'])
						s += ('`'+App.Game.outStreams[inst.data][4]);
				}
				str.push(s);
			}
		}
		return str.join('~');
	};

		// ---------------------------------------------

	this.staticRender = function(){
		var cs = App.GameRenderer.cellSize;
		for(var c=0;c<4;++c){
			if(!App.Game.visibilities[c])
				continue;
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

	this.dynamicRender = function(){ that.graphics.dynamicRender(App.GameRenderer.tempGfx); }
}
