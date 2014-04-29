App.GuiInstDrag = function(x, y, delay, instruction, dirsens, xorigin, yorigin, gui, tooltip, hotkey, data){
	App.GuiTools.Drag.call(this, x, y, 46, 46, delay, delay, xorigin, yorigin);
	this.functional = true;
	this.gui = gui;
	this.tooltip = tooltip;
	this.hotkey  = hotkey;

	//for streams and flipflops
	this.data = data;

	//if this is direction-sensitive
	this.dirsens = dirsens;

	this.instruction     = instruction;
	this.baseInstruction = instruction;

	var that = this;

	delete(this.renderLayers['Drag']);
	this.renderLayers['Inst'] = function(gfx){
		gfx.lineWidth = 2;

		var interp = (that.interpmode === 'exit') ?
		that.w - (that.getleft() - that.getx()) :
		that.getright() - that.getx();

		var dx = (interp * that.pos + (that.getx() - that.x) +that.w/2);
		if(that.overridepos)
			dx = that.getx() - that.w/2;

		App.InstCatalog.render(
			gfx,
			that.instruction,
			that.getx()-1, that.gety()-1,
			App.GuiInstDrag.globalColor,
			that.w+2);

		if(that.hovering){
			var w = textWidth(gfx, that.tooltip, 24-6, -2);
			gfx.fillStyle = App.FILL_COLOR[App.GuiInstDrag.globalColor];
			gfx.fillRect(that.getx(), App.Canvases.height-103-24, w+6, 24);
			w = textWidth(gfx, that.hotkey, 24-6, -2);
			gfx.fillRect(App.Canvases.width/2-394, App.Canvases.height-103-24, w+6, 24);
			gfx.fillStyle = '#000000';
			text(gfx, that.tooltip, that.getx() + 3, App.Canvases.height-103-21, 24-6, -2);


			text(gfx, that.hotkey, App.Canvases.width/2-391, App.Canvases.height-103-21, 24-6, -2);
		}
	}

	this.subClickStart = function(){
		if(App.Game.currentPlanningLevel.locks[App.GuiInstDrag.globalColor]){
			this.preventDrag = true;
			return;
		}
		this.preventDrag = false;
		if(this.instruction >=4 && this.instruction <= 7)
			App.GuiInstDrag.changeDirection(this.instruction-4);
		this.ignoreHover = true;
	};

	//The drag part of 'drag and drop'
	this.subUpdate = function(){
		if(!this.active)
			return;

		this.x = App.InputHandler.mouseX - this.w/2;
		this.x = App.InputHandler.mouseY - this.h/2;
	}

	//The button has been 'dropped'!
	this.subClickEnd = function(){
		//prevent dropping instructions behind gui elements
		//check upper left
		this.ignoreCollide = true;
		this.ignoreHover = false;
		var flag = false;
		var c = this.gui.testCoordinates(this.getx()-this.w/2, this.gety()-this.h/2);
		if(c.f.length > 0 || c.p.length > 0) flag = true;
		//bottom left
		c = this.gui.testCoordinates(this.getx()-this.w/2, this.gety()+this.h/2);
		if(c.f.length > 0 || c.p.length > 0) flag = true;
		//upper right
		c = this.gui.testCoordinates(this.getx()+this.w/2, this.gety()-this.h/2);
		if(c.f.length > 0 || c.p.length > 0) flag = true;
		//lower right
		c = this.gui.testCoordinates(this.getx()+this.w/2, this.gety()+this.h/2);
		if(c.f.length > 0 || c.p.length > 0) flag = true;
		this.ignoreCollide = false;
		if(flag)
			return;

		//place the instruction
		App.GameRenderer.screenToGridCoords(this.getx() + this.w/2, this.gety() + this.h/2);
		App.GameRenderer.requestStaticRenderUpdate = true;
		var nx = App.GameRenderer.mouseX;
		var ny = App.GameRenderer.mouseY;
		var c = App.GuiInstDrag.globalColor;

		//TODO make instructino update based on direction if applicable
		var t = this.instruction;
		console.log('dragged to ' + nx + ',' + ny);
		App.Game.currentPlanningLevel.insert(new App.PlanningInstruction(nx,ny,c,t));
	}

	App.GuiInstDrag.registry.push(this);
}
App.GuiInstDrag.prototype = Object.create(App.GuiTools.Drag);
App.GuiInstDrag.prototype.constructor = App.GuiInstDrag;

App.GuiInstDrag.registry = [];
App.GuiInstDrag.globalColor = 0;
App.GuiInstDrag.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
App.GuiInstDrag.direction = 0;
App.GuiInstDrag.changeGlobalColor = function(color){
	this.globalColor = color;
	for(var i = 0; i < this.registry.length; i++){
		this.registry[i].activeColor = this.colors[this.globalColor];
		this.registry[i].inactiveColor = this.colors[this.globalColor];
	}
}

App.GuiInstDrag.changeDirection = function(dir){
	this.direction = dir;
	for(var i = 0; i < this.registry.length; i++){
		if(this.registry[i].dirsens)
			this.registry[i].instruction = this.registry[i].baseInstruction + dir;
	}
}

