App.PlanningInstruction = function(x,y,color,type,data,locked){
	this.x        = x;
	this.y        = y;
	this.color    = color;
	this.type     = type;
	this.data     = data;
	this.data2    = null;
	this.locked = locked;
	this.isProtected = false;
}
