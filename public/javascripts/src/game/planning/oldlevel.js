App.PlanningLevel = function(){
	var that = this;

	this.name; // name of the level
	this.width;	this.height; // grid size
	this.numColors = 4; // number of different colors in the game
	this.grid = []; // grid[x][y][color] = instruction
	this.undoStack = []; // stores operation objects that can be undone later
	this.redoStack = []; // stores operation objects that can be redone later
	this.opObj = new App.Operation();
	this.redLocked = false;
	this.greenLocked = false;
	this.blueLocked = false;
	this.yellowLocked = false;
	this.currentSelection = [];
	this.input = new App.PlanningControls();
	this.graphics = new App.PlanningGraphics();
	this.copied = false;
	this.moving = false;

	// flag that lets the operation functions know how to handle conflicts.
	this.userOverlapSetting = 0; // 0 - reject operation, 1 - overwrite

	this.setUp = function(mX, mY, mC){ that.input.setUp(mX, mY, mC) }
	this.setDown = function(mX, mY, mC, scrnX, scrnY){ that.input.setDown(mX, mY, mC, scrnX, scrnY); }

	this.mkey = function(){
		if(that.currentSelection.length !== 0 && that.currentSelection[0] !== null){
			if(that.moving){ that.moving = false; }else{ that.moving = true; }
			App.Game.requestStaticRenderUpdate = true;
		}
	}

	this.ckey = function(){
		if(that.currentSelection.length !== 0 && that.currentSelection[0] !== null){
			if(that.copied){ that.copied = false; }else{ that.copied = true; }
			App.Game.requestStaticRenderUpdate = true;
		}
	}

	this.doMove = function(newX, newY){
		if(that.currentSelection.length === 1){ // move 1 instruction
			that.move(that.currentSelection[0].x,that.currentSelection[0].y,that.currentSelection[0].color,newX,newY,1);
		}else{ // group move
			var tempList = [];
			for(var i = 0; i < that.currentSelection.length; ++i){
				tempList[i] = [];
				tempList[i][0] = that.currentSelection[i].x;
				tempList[i][1] = that.currentSelection[i].y;
				tempList[i][2] = that.currentSelection[i].color;
			}
			that.groupMove(tempList,newX-that.currentSelection[0].x,newY-that.currentSelection[0].y);
		}
	}

	this.doCopy = function(newX, newY){
		if(that.currentSelection.length === 1){ // copy 1 instruction
			that.copy(that.currentSelection[0].x,that.currentSelection[0].y,that.currentSelection[0].color,newX,newY,1);
		}else{ // group copy
			var tempList = [];
			for(var i = 0; i < that.currentSelection.length; ++i){
				tempList[i] = [];
				tempList[i][0] = that.currentSelection[i].x;
				tempList[i][1] = that.currentSelection[i].y;
				tempList[i][2] = that.currentSelection[i].color;
			}
			that.groupCopy(tempList,newX-that.currentSelection[0].x,newY-that.currentSelection[0].y);
		}
	}

	this.dkey = function(){
		if(that.currentSelection.length !== 0 && that.currentSelection[0] !== null){
			if(that.currentSelection.length === 1){ // delete 1 instruction
				var tempInst = that.currentSelection[0];
				that.delete(tempInst.x,tempInst.y,tempInst.color,1);
			}else{ // group delete
				var tempList = [];
				for(var i = 0; i < that.currentSelection.length; ++i){
					tempList[i] = [];
					tempList[i][0] = that.currentSelection[i].x;
					tempList[i][1] = that.currentSelection[i].y;
					tempList[i][2] = that.currentSelection[i].color;
				}
				that.groupDelete(tempList);
			}
		}
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

	/*this.selectCells = function(x1, y1, c1, x2, y2, c2){
		that.currentSelection = [];

		var instructions = [];
		var numSelected = 0;

		var left = false;

		var tlX = 0, tlY = 0, tlC = 0;
		var brX = 0, brY = 0, brC = 0;

		if(x1 < x2){ tlX = x1; brX = x2; } else { tlX = x2; brX = x1; left = true; }
		if(y1 < y2){ tlY = y1; brY = y2; } else { tlY = y2; brY = y1; }

		if(left){ tlC = c2; brC = c1; }else{ tlC = c1; brC = c2; }

		for(var i = 0; i < (brY - tlY); ++i){
			instructions = instructions.concat(that.selectRow(tlX, tlY+i, tlC, brC, brX - tlX));			
		}

		var numInstr = 0;
		for(i = 0; i < instructions.length; ++i){
			if(instructions[i] !== null && instructions[i] !== undefined){
				that.currentSelection[numInstr] = instructions[i];
				++numInstr;
			}
		}
	}*/

	this.selectRow = function(x, y, c1, c2, dist){
		var instructions = [];
		for(var i = 0; i < dist; i++){
			if(c1 === App.COLORS.RED || c1 === App.COLORS.GREEN){
				for(var c = 0; c <= 1; c++){
					if(i === 0 && c1 === App.COLORS.GREEN){ c++; }
					if(i === dist-1 && c2 === App.COLORS.RED){ console.log('b'); break; }
					if(that.getInstruction(x+i,y,c)){ instructions[i*2+c] = that.getInstruction(x+i,y,c); }
				}
			}
			else{
				for(var c = 2; c <= 3; c++){
					if(i === 0 && c1 === App.COLORS.YELLOW){ c++; }
					if(i === dist-1 && c2 === App.COLORS.BLUE){ console.log('b'); break; }
					if(that.getInstruction(x+i,y,c)){ instructions[i*2+c] = that.getInstruction(x+i,y,c); }
				}	
			}
		}
		return instructions; 
	}

	// fills currentSelection list of all unlocked instructions in cells between the specified coordinates
	this.selectCells = function(x1, y1, c1, x2, y2, c2){
		instructions = [];
		that.currentSelection = [];
		numSelected = 0;

		if(x1 > x2){ var temp = x1; x1 = x2; x2 = temp; }
		if(y1 > y2){ var temp = y1; y1 = y2; y2 = temp; }

		for(y = y1; y <= y2; ++y){
			for(x = x1; x <= x2; ++x){
				for(c = 0; c <= 3; ++c){
					temp = that.getInstruction(x,y,c);
					if(temp !== null && !that.isLocked(temp.color)){ instructions[numSelected] = temp; ++numSelected; }
				}
			}
		}
		that.currentSelection = instructions;
	}

	// selects a single instruction
	this.selectInstruction = function(x,y,c){
		that.currentSelection = [];
		that.currentSelection[0] = that.getInstruction(x,y,c);
	}

	// toggles the state of the specified layer lock
	this.toggleLock = function(col){
		if(col === App.COLORS.RED){
			if(that.redLocked){ that.redLocked = false; } else { that.redLocked = true; }
		}

		if(col === App.COLORS.GREEN){
			if(that.greenLocked){ that.greenLocked = false; } else { that.greenLocked = true; }
		}

		if(col === App.COLORS.BLUE){
			if(that.blueLocked){ that.blueLocked = false; } else { that.blueLocked = true; }
		}

		if(col === App.COLORS.YELLOW){
			if(that.yellowLocked){ that.yellowLocked = false; } else { that.yellowLocked = true; }
		}
	}

	// returns the states of the specified layer lock
	this.isLocked = function(color){
		if(color === App.COLORS.RED){ return that.redLocked; }
		if(color === App.COLORS.GREEN){ return that.greenLocked; }
		if(color === App.COLORS.BLUE){ return that.blueLocked; }
		if(color === App.COLORS.YELLOW){ return that.yellowLocked; }
	}

	// this function takes a list of PlanningInstructions and inserts them into the grid
	this.groupInsert = function(instructions){
		for(var x = 0; x < instructions.length; x++){
			that.insert(instructions[x]);
		}
		that.undoStack.push(new that.opObj.groupOp(instructions.length));
	};

	// this function takes a list of coordinate triplets and deletes the corresponding instructions from the grid
	// TODO change to take list of instructions
	this.groupDelete = function(coords){
		for(var x = 0; x < coords.length; x++){
			that.delete(coords[x][0],coords[x][1],coords[x][2],1);
		}
		that.undoStack.push(new that.opObj.groupOp(coords.length));
	};

	// this function takes a list of coordinate triplets and shifts the instructions they point to by shiftX and shiftY
	// TODO change to take list of instructions
	this.groupMove = function(coords,shiftX,shiftY){
		for(var x = 0; x < coords.length; x++){
			that.move(coords[x][0],coords[x][1],coords[x][2],coords[x][0]+shiftX,coords[x][1]+shiftY);
		}
		that.undoStack.push(new that.opObj.groupOp(coords.length));
	}

	// this function takes a list of coordinate triplets and copies the instructions they point to to a new cell shiftX and shiftY away from the first
	// TODO change to take list of instructions
	this.groupCopy = function(coords,shiftX,shiftY){
		for(var x = 0; x < coords.length; x++){
			that.copy(coords[x][0],coords[x][1],coords[x][2],coords[x][0]+shiftX,coords[x][1]+shiftY);
		}
		that.undoStack.push(new that.opObj.groupOp(coords.length));
	}

	// not sure we will actually need this one
	// this function takes a list of coordinate triplets and changes the specified parameter of all of them to value
	// TODO change to take list of instructions
	this.groupModify = function(coords, parameter, value){
		for(var x = 0; x < coords.length; x++){
			that.modify(this.getInstruction(coords[x][0],coords[x][1],coords[x][2]),parameter,value);
		}
		that.undoStack.push(new that.opObj.groupOp(coords.length));
	}

	// this function performs a modify operation on an instruction,
	// and creates and pushes a modifyOp object onto the undo stack.
	// if the parameter is 'color', then this will try to move the instruction
	// to the appropriate spot in the array.
	this.modify = function(instruction, parameter, value, killRedo){
		if(that.isLocked(instruction.color)){ return; } // check layer lock
		if(!that.contains(instruction.x,instruction.y,instruction.color)){ return; } // check that the instruction to be moved exists

		if(parameter === 'color'){
			var oldColor = instruction.color;
			if(that.getInstruction(instruction.x, instruction.y, value)){ // if there is something where the modified instruction would move to
				that.undoStack.push(new that.opObj.modifyOp(instruction, parameter, value, instruction[parameter])); //update undo stack

				// check overwrite
				if(that.userOverlapSetting === 1){ // if necessary store overwrite information for undo / redo
					if(that.getInstruction(newX,newY,color)){
						that.undoStack[that.undoStack.length-1].overWritten = that.getInstruction(newX,newY,color);
					}
				}else{ // prevent overwrite
					if(that.getInstruction(newX,newY,color)){ return; }
				}
				
				// update cell
				that.grid[instruction.x][instruction.y][value] = that.grid[instruction.x][instruction.y][oldColor];
				that.grid[instruction.x][instruction.y][oldColor] = null;
				return;
			} else{
				// update cell
				that.grid[instruction.x][instruction.y][value] = that.grid[instruction.x][instruction.y][oldColor];
				that.grid[instruction.x][instruction.y][oldColor] = null;
			}
		}else{
			that.grid[instruction.x][instruction.y][instruction.color][parameter] = value; // update instruction
		}

		that.undoStack.push(new that.opObj.modifyOp(instruction, parameter, value, instruction[parameter])); // update undo stack
		App.Game.requestStaticRenderUpdate = true;
		if(killRedo !== 1){ that.killRedo('mod'); }
	}

	// this function performs a copy operation on an instruction,
	// and creates and pushes a copyOp object onto the undo stack.
	this.copy = function(x, y, color, newX, newY, killRedo){
		if(that.isLocked(color)){ return; } // check layer lock
		if(!that.contains(x,y,color)){ return; } // check that the instruction to be moved exists

		if(that.userOverlapSetting === 1){ // if necessary store overwrite information for undo / redo
			if(that.getInstruction(newX,newY,color)){
				that.undoStack[that.undoStack.length-1].overWritten = that.getInstruction(newX,newY,color);
			}
		}
		else{ // prevent overwrite
			if(that.getInstruction(newX,newY,color)){ return; }
		}

		// update undo stack
		that.undoStack.push(new that.opObj.copyOp(that.getInstruction(x,y,color), newX, newY));

		// update grid and instruction
		if(!that.grid[newX]){ that.grid[newX] = []; }
		if(!that.grid[newX][newY]){ that.grid[newX][newY] = []; }
		that.grid[newX][newY][color] = new App.PlanningInstruction(newX, newY, color, that.grid[x][y][color].type);

		App.Game.requestStaticRenderUpdate = true; // ask for static render

		if(killRedo !== 1){ that.killRedo('cpy'); }
	}

	// this function, performs a move operation on an instruction,
	// and creates and pushes a moveOp object onto the undo stack.
	this.move = function(x, y, color, newX, newY, killRedo){
		if(that.isLocked(color)){ return; } // check layer lock
		if(!that.contains(x,y,color)){ return; } // check that the instruction to be moved exists

		// update instruction x, y 
		that.grid[x][y][color].x = newX;
		that.grid[x][y][color].y = newY;

		that.undoStack.push(new that.opObj.moveOp(that.getInstruction(x,y,color), x, y, newX, newY)); // update undo stack

		if(that.userOverlapSetting === 1){ // if necessary store overwrite information for undo / redo
			if(that.getInstruction(newX,newY,color)){
				that.undoStack[that.undoStack.length-1].overWritten = that.getInstruction(newX,newY,color);
			}
		}
		else{ // prevent overwrite
			if(that.getInstruction(newX,newY,color)){ return; }
		}

		// update grid
		if(!that.grid[newX]){ that.grid[newX] = []; }
		if(!that.grid[newX][newY]){ that.grid[newX][newY] = []; }
		that.grid[newX][newY][color] = that.grid[x][y][color];
		that.grid[x][y][color] = null;

		App.Game.requestStaticRenderUpdate = true; // ask for static render

		if(killRedo !== 1){ that.killRedo('mov'); }	
	}

	// this function performs an insert operation on the grid,
	// and creates and pushes an insertOp object onto the undo stack.
	this.insert = function(instruction,killRedo){
		if(that.isLocked(instruction.color)){ return; } // check if color is locked
		
		if(that.userOverlapSetting === 1){ // if necessary store overwrite information for undo / redo
			if(that.getInstruction(instruction.x,instruction.y,instruction.color)){
				that.undoStack[that.undoStack.length-1].overWritten = that.getInstruction(instruction.x,instruction.y,instruction.color);
			}
		}
		else{ // prevent overwrite
			if(that.getInstruction(instruction.x,instruction.y,instruction.color)){ return; }
		}

		that.undoStack.push(new that.opObj.insertOp(instruction)); // update undo stack

		// update grid
		if(!that.grid[instruction.x]){ that.grid[instruction.x] = []; }
		if(!that.grid[instruction.x][instruction.y]){ that.grid[instruction.x][instruction.y] = []; }
		that.grid[instruction.x][instruction.y][instruction.color] = instruction;

		App.Game.requestStaticRenderUpdate = true; // ask for static render

		if(killRedo !== 1){ that.killRedo('ins'); }		
	}

	// this function performs a delete operation on an instruction,
	// it also creates and pushes a deleteOp object onto the stack
	this.delete = function(x,y,color,killRedo){

		if(that.isLocked(color)){ return; }
		if(that.getInstruction(x,y,color)){

			// update undo stack
			if(killRedo !== 1){ that.killRedo('del'); }
			that.undoStack.push(new that.opObj.deleteOp(that.getInstruction(x,y,color)));

			// update grid
			that.grid[x][y][color] = null;
			App.Game.requestStaticRenderUpdate = true;
		}
	};

	// TODO figure out how undo / redo will work with locked layers.
	// each call to this function pops the undo stack, and undoes whatever operation it finds
	this.undo = function(killRedo){
		if(that.undoStack.length === 0) return;

		// update stacks
		var op = that.undoStack.pop();
		if(op.opId !== 'group'){ that.redoStack.push(op); }

		console.warn('undo op: ' + op.opId);

		// update grid
		if(op.opId === 'insert'){

			that.delete(op.instruction.x, op.instruction.y, op.instruction.color,1);
			that.undoStack.pop();

			if(op.overWritten !== null){
				that.insert(op.overWritten,1);
				that.undoStack.pop();
			}
		}
		else if(op.opId === 'delete'){
			that.insert(op.instruction,1);
			that.undoStack.pop();
		}
		else if(op.opId === 'move'){
			that.move(op.instruction.x, op.instruction.y, op.instruction.color, op.oldX, op.oldY, 1)
			that.undoStack.pop();

			if(op.overWritten !== null){
				that.insert(op.overWritten,1);
				that.undoStack.pop();
			}
		}
		else if(op.opId === 'copy'){
			that.delete(op.newX, op.newY, op.instruction.color, 1);
			that.undoStack.pop();

			if(op.overWritten !== null){
				that.insert(op.overWritten, 1);
				that.undoStack.pop();
			}
		}
		else if(op.opId === 'modify'){
			that.modify(op.instruction, op.parameter, op.oldValue, 1);
			that.undoStack.pop();

			if(op.overWritten !== null){
				that.insert(op.overWritten, 1);
				that.undoStack.pop();
			}
		}
		else if(op.opId === 'group'){
			for(var x = 0; x < op.numInstructions; x++){
				that.undo(1);
			}
			that.redoStack.push(op);
		}
		App.Game.requestStaticRenderUpdate = true;
	};

	this.killRedo = function(str){ that.redoStack = []; console.warn('killRedo: ' + str); };
	this.killUndo = function(str){ that.undoStack = []; console.warn('killUndo: ' + str); };

	// each call to this function pops the redo stack, and undoes whatever operation it finds
	this.redo = function(){

		if(that.redoStack.length === 0) return;

		// update stacks
		var op = that.redoStack.pop();
		if(op.opId !== 'group'){ that.undoStack.push(op); }

		console.warn('redo op: ' + op.opId);

		// update grid
		if(op.opId === 'insert'){
			that.insert(op.instruction,1);
			that.undoStack.pop();
		}
		else if(op.opId === 'delete'){
			that.delete(op.instruction.x, op.instruction.y, op.instruction.color,1);
			that.undoStack.pop();
		}
		else if(op.opId === 'move'){
			that.move(op.oldX, op.oldY, op.instruction.color, op.newX, op.newY, 1);
			that.undoStack.pop();
		}
		else if(op.opId === 'copy'){
			that.insert(new App.PlanningInstruction(op.newX, op.newY, op.instruction.color, op.instruction.type),1);
			that.undoStack.pop();
		}
		else if(op.opId === 'modify'){
			that.modify(op.instruction, op.parameter, op.newValue,1);
			that.undoStack.pop();
		}
		else if(op.opId === 'group'){ // TODO make it so that group ends up on the front of the stack
			for(var x = 0; x < op.numInstructions; x++){
				that.redo();
			}
			that.undoStack.push(op);
		}
		App.Game.requestStaticRenderUpdate = true;
	};

	// TODO it sounds like we may want to include the level title in the string?
	this.generateParseString = function(){
		var strings = [];
		strings.push(this.name + ',' + this.width + ',' + this.height);

		for(var i in this.grid){
			for(var j in this.grid[i]){
				for(var c in this.grid[i][j]){
					var inst = this.grid[i][j][c];
					if(inst !== null){
						strings.push(inst.x + ',' + inst.y + ',' + inst.color + ',' + inst.type); // should there be a semicolon? the next x will be appended to the the type of the preceding instruction
					}
				}
			}
		}

		return strings.join(';');
	};

	// return a simulation level with instructions from the grid
	this.generateSimulationLevel = function(){
		var newLevel = new App.SimulationLevel(that.width, that.height);
		for(var i in that.grid){
			for(var j in that.grid[i]){
				for(var c in that.grid[i][j]){
					var ins = that.getInstruction(i,j,c);
					if(ins){
						new App.SimulationInstruction(newLevel,ins.x,ins.y,ins.color,ins.type);
					}
				}
			}
		}
		return newLevel;
	};

	this.staticRender = function(){
		var selected;
		var cs = App.Game.cellSize;
		App.Game.translateCanvas(App.Game.instructionGfx);
		App.Game.instructionGfx.lineWidth = 2;
		for(var c=0;c<4;++c){
			App.Game.instructionGfx.save();
			switch(c){
				case 0:
					App.Game.instructionGfx.fillStyle = '#ff0000';
					App.Game.instructionGfx.translate(0,0);
					break;
				case 1:
					App.Game.instructionGfx.fillStyle = '#00ff00';
					App.Game.instructionGfx.translate(cs/2,0);
					break;
				case 2:
					App.Game.instructionGfx.fillStyle = '#0000ff';
					App.Game.instructionGfx.translate(0,cs/2);
					break;
				case 3:
					App.Game.instructionGfx.fillStyle = '#ffff00';
					App.Game.instructionGfx.translate(cs/2,cs/2);
					break;
			}

			for(var i in that.grid)
				for(var j in that.grid[i])
					if(that.grid[i][j][c]){
						selected = false;
						if(that.currentSelection.indexOf(that.getInstruction(i,j,c)) != -1){
							selected = true;
						}

						App.InstCatalog.render(
							App.Game.instructionGfx,
							that.grid[i][j][c].type,
							i*cs,j*cs,c,cs/2);
					}

			App.Game.instructionGfx.restore();
		}
		App.Game.instructionGfx.restore();
	}

	this.dynamicRender = function(){}
}
