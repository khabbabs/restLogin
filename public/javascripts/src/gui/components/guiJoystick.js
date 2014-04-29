/*
	Moves the 'camera' around.
*/
App.GuiJoystick = function(x, y, enterDelay, exitDelay, panel){
	App.GuiTools.Drag.call(this, x, y, 50, 50, enterDelay, exitDelay, panel);

	this.moveRate = 0.1;
	this.curPanX = 0;
	this.curPanY = 0;

	this.subClickStart = function(){
		App.GameRenderer.beginPan(this.getx(), this.gety());
		this.curPanX = this.getx();
		this.curPanY = this.gety();
	}

	this.subUpdate = function(){
		this.curPanX -= (this.getx() - this.px) * this.moveRate;
		this.curPanY -= (this.gety() - this.py) * this.moveRate;

		App.GameRenderer.pan(this.curPanX, this.curPanY);
	}

	this.subClickEnd = function(){}
}
App.GuiJoystick.prototype = Object.create(App.GuiTools.Drag);
App.GuiJoystick.prototype.constructor = App.GuiJoystick;
