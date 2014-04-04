/*
	Moves the 'camera' around.
*/
App.GuiJoystick = function(x, y, panel){
	this.guiCollider = new App.GuiCollisionCircle(x, y, 35);
	if(panel) panel.addChild(this);
	this.guiCollider.functional = true;

	this.currentX = this.guiCollider.getx();
	this.currentY = this.guiCollider.gety();
	this.curPanX = 0;
	this.curPanY = 0;
	this.moveRate = 0.2;

	this.activeColor = App.GuiColors.gray[4];
	this.inactiveColor = App.GuiColors.gray[5];
	this.color = this.inactiveColor;

	this.dragged = false;

	this.render = function(gfx){
		//Draw outside/bounds
		gfx.fillStyle = this.color;
		gfx.strokeStyle = App.GuiColors.gray[2];
		gfx.lineWidth = 2;
		gfx.beginPath();
		gfx.arc(this.guiCollider.getx(), this.guiCollider.gety(), this.guiCollider.r, 0, Math.PI*2, true);
		gfx.closePath();
		gfx.stroke();

		//Draw inside/current joystick location
		gfx.lineWidth = 1;
		gfx.strokeStyle = App.GuiColors.gray[3];
		gfx.beginPath();
		gfx.arc(this.currentX, this.currentY, 15, 0, Math.PI*2, true);
		gfx.closePath();
		gfx.fill();
		gfx.stroke();

	}

	this.clickStart = function(){
		this.dragged = true;
		this.curPanX = this.guiCollider.getx();
		this.curPanY = this.guiCollider.gety();
		App.Game.beginPan(this.guiCollider.getx(), this.guiCollider.gety());
	}

	this.update = function(){
		if(!this.dragged)
			return;

		var mx = this.guiCollider.getx();
		var my = this.guiCollider.gety();

		var x = App.InputHandler.mouseData.x - mx;
		var y = App.InputHandler.mouseData.y - my;

		var a = Math.atan2(x, y);
		var d = Math.sqrt(x * x + y * y);

		d = (d > this.guiCollider.r)? this.guiCollider.r : d;
		y = (d * Math.cos(a));
		x = (d * Math.sin(a));

		this.curPanX -= x * this.moveRate;
		this.curPanY -= y * this.moveRate;

		this.currentX = x + mx;
		this.currentY = y + my;

		App.Game.pan(this.curPanX, this.curPanY);
	}

	this.clickEnd = function(x, y){
		this.dragged = false;
		this.currentX = this.guiCollider.getx();
		this.currentY = this.guiCollider.gety();
	}


}

//TODO requires some special logic
//note that the instruction dragging is the only drag and drop, so let's cut
//out the middleman and just hardcode that part
App.GuiDragButton = function(x, y, draw, instruction, panel){
	this.guiCollider = new App.GuiCollisionRect(x, y, 24, 24);
	if(panel) panel.addChild(this);
	this.guiCollider.functional = true;

	this.currentX = this.guiCollider.getx();
	this.currentY = this.guiCollider.gety();
	this.activeColor = App.GuiDragButton.active;
	this.inactiveColor = App.GuiDragButton.inactive;
	this.dragged = false;
	this.draw = draw;
	this.instruction = instruction;

	//Draws a simple box for now - once we have some vector draw functions,
	//we'll be able to draw them on it!
	this.render = function(gfx){
		// gfx.fillStyle = (this.dragged)? this.activeColor : this.inactiveColor;
		// gfx.fillRect(this.currentX, this.currentY, this.guiCollider.w, this.guiCollider.h);

		gfx.lineWidth = 2;
		App.InstCatalog.render(
			gfx,
			this.instruction,
			this.currentX, this.currentY,
			App.GuiDragButton.globalColor,
			this.guiCollider.w);

	}

	//Initiating the dragging
	this.clickStart = function(){
		this.dragged = true;
	}

	this.windowupdate = function(){
		this.currentX = this.guiCollider.getx();
		this.currentY = this.guiCollider.gety();
	}

	//The drag part of 'drag and drop'
	this.update = function(){
		if(!this.dragged)
			return;
		this.currentX = App.InputHandler.mouseData.x - this.guiCollider.w/2;
		this.currentY = App.InputHandler.mouseData.y - this.guiCollider.h/2;
	}

	//The button has been 'dropped'!
	this.clickEnd = function(x, y){
		this.dragged = false;
		this.currentX = this.guiCollider.getx();
		this.currentY = this.guiCollider.gety();

		//prevent dropping instructions behind gui elements
		if(App.Gui.testCoordinates(x,y) !== null)
			return;

		//place the instruction
		var level =	App.Game.currentPlanningLevel;
		App.Game.screenToGridCoords(x, y);
		var nx = App.Game.mouseX;
		var ny = App.Game.mouseY;
		var c = App.GuiDragButton.globalColor;
		var t = this.instruction;
		console.log('dragged to ' + nx + ',' + ny);
		level.insert(new App.PlanningInstruction(nx,ny,c,t));
	}

	App.GuiDragButton.registry.push(this);
}

App.GuiDragButton.registry = [];
App.GuiDragButton.globalColor = 0;
App.GuiDragButton.inactive = App.GuiColors.inactive[App.GuiDragButton.globalColor];
App.GuiDragButton.active = App.GuiColors.active[App.GuiDragButton.globalColor];
App.GuiDragButton.changeGlobalColor = function(color){
	this.globalColor = color;
	this.inactive = App.GuiColors.inactive[color];
	this.active = App.GuiColors.active[color];
	for(var i = 0; i < this.registry.length; i++){
		this.registry[i].activeColor = this.active;
		this.registry[i].inactiveColor = this.inactive;
	}
	App.Gui.drawStatic = true;

}



/* BIG NOTE
	This and the sliderLine below it are currently twinned - each requires the other.
	However, I haven't made a nice function for just making a slider, button and line included, just yet.
	This is because each has to be stored separately inside the gui frame
	in order for collisions with the guiCollider to be dealt with properly. The probable solution
	will be to just make a function that makes both, adds both to the frame,
	and updates their references to each other.
*/
App.GuiSliderButton = function(guiCollider, panel){
	this.guiCollider = guiCollider;
	if(panel) panel.addChild(this);
	this.guiCollider.functional = true;
	this.activeColor = App.GuiColors.gray[4];
	this.inactiveColor = App.GuiColors.gray[6];
	this.color = this.inactiveColor;
	this.sliderLine;
	this.dragged = false;

	//Renders just the button portion of the slider (the box)
	this.render = function(gfx){
		if(!this.sliderLine)
			console.error('Improperly initialized gui slider');
		gfx.fillStyle = this.color;
		gfx.fillRect(this.guiCollider.getx(), this.guiCollider.gety(), this.guiCollider.w, this.guiCollider.h);

		gfx.fillStyle = App.GuiColors.gray[0];
		gfx.fillText (Math.floor(this.sliderLine.value), this.guiCollider.getx(), this.guiCollider.gety() + this.guiCollider.h/2);
	}

	//Begins the dragging of the slider
	this.clickStart = function(){
		this.dragged = true;
	}

	//Ugly code in here, needs cleanup.
	//What this does is move relative to the mouse, while snapping to the
	//axis of the slider line (IE only moving on X or Y)
	//and also ensures that it doesn't move outside of the bounds of the line
	//(IE past the max and min)
	//It also calls the sliderLine.evaluate function, which in turn calls any
	//change listener callback.
	this.update = function(){
		if(!this.dragged)
			return;
		if(this.sliderLine.direction === 1){
			this.guiCollider.x = App.InputHandler.mouseData.getx() - this.guiCollider.w/2;
			if(this.guiCollider.getx() > this.sliderLine.guiCollider.getx() + this.sliderLine.guiCollider.w)
				this.guiCollider.x = this.sliderLine.guiCollider.getx() + this.sliderLine.guiCollider.w;
			else if (this.guiCollider.getx() < this.sliderLine.guiCollider.x)
				this.guiCollider.x = this.sliderLine.guiCollider.getx();
		}
		else{
			this.guiCollider.y = App.InputHandler.mouseData.y - this.guiCollider.h/2;
			if(this.guiCollider.gety() > this.sliderLine.guiCollider.gety() + this.sliderLine.guiCollider.h)
				this.guiCollider.y = this.sliderLine.guiCollider.gety() + this.sliderLine.guiCollider.h;
			else if (this.guiCollider.gety() < this.sliderLine.guiCollider.gety())
				this.guiCollider.y = this.sliderLine.guiCollider.gety();
		}
		this.sliderLine.evaluate(this.guiCollider.getx(), this.guiCollider.gety());
	}

	//Releases from dragging
	this.clickEnd = function(){
		this.dragged = false;

	}
}

//callback is basically a change listener. Not required.
//The slider line is the 'rail' that the button 'slides on'
App.GuiSliderLine = function(guiCollider, min, max, direction, callback, panel){
	this.guiCollider = guiCollider;
	if(panel) panel.addChild(this);
	this.guiCollider.functional = true; //to allow snap-to-click
	this.color = App.GuiColors.gray[2];
	this.direction = direction;
	this.sliderButton;
	this.min = min;
	this.max = max;
	this.callback = callback;
	this.value = 0;

	//Renders the slider line component; the part that the slider slides 'on'
	this.render = function(gfx){
		if(!this.sliderButton)
			console.error('Improperly initialized gui slider');
		gfx.fillStyle = this.color;
		gfx.fillRect(this.guiCollider.getx(), this.guiCollider.gety(), this.guiCollider.w, this.guiCollider.h);
	}

	//Evaluates a new value for the slider based on the x,y coordinates of the button
	//Also calls the change listener callback, if there is one.
	this.evaluate = function(x, y){
		var vals = (this.direction === 1)? {v:x, l:this.guiCollider.getx(), h:this.guiCollider.w} :
											{v:y, l:this.guiCollider.gety(), h:this.guiCollider.h};
		vals.v -= vals.l;
		var step = (this.max-this.min)/vals.h;
		vals.v *= step;

		if(this.callback)
			this.callback(vals.v);
		this.value = vals.v;
	}

	//this redirect allows the user to click on the slider and 'snap' the slider button to where they clicked!
	this.clickStart = function(){
		App.Gui.activeComponent = this.sliderButton;
		this.sliderButton.clickStart();
	}

}