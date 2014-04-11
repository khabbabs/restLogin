App.Operation = function(){

	// contains information needed to undo or redo any of the group operations
	this.groupOp = function(numInstructions){
		this.numInstructions = numInstructions;
		this.opId = 'group';
	};

	// contains the information needed to undo or redo an insert operation
	this.insertOp = function(instruction){
		this.instruction = instruction;
		this.overWritten = null;
		this.opId = 'insert';
	};

	// contains the information needed to undo or redo a delete operation
	this.deleteOp = function(instruction){
		this.instruction = instruction;
		this.opId = 'delete';
	};

	// contains the information needed to undo or redo a move operation
	this.moveOp = function(instruction, oldX, oldY, newX, newY){
		this.instruction = instruction;
		this.oldX = oldX; this.oldY = oldY;
		this.newX = newX; this.newY = newY;
		this.overWritten = null;
		this.opId = 'move';
	};

	// contains the information needed to undo or redo a copy operation
	this.copyOp = function(instruction, newX, newY){
		this.instruction = instruction;
		this.newX = newX; this.newY = newY;
		this.overWritten = null;
		this.opId = 'copy';
	};

	// contains the information needed to undo or redo a modify operation
	this.modifyOp = function(instruction, parameter, newValue, oldValue){
		this.instruction = instruction;
		this.parameter = parameter;
		this.newValue = newValue;
		this.oldValue = oldValue;
		this.overWritten = null;
		this.opId = 'modify';
	};

}