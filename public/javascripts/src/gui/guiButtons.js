/*
Notes about doing the GUI:

For now, just need:

DRAW NOT DONE
imageButton - small and large? -- doesn't need to be an ACTUAL image, just pictographic somehow

DONE?
textButton - small and large?

DRAW NOT DONE
dragButton - like an imageButton

DONE?
textBox -- static and user entry

DONE
guiPanel -- static and prevents click fallthrough

NOT DONE
guiSliderButton and guiSliderLine


One TODO (potentially): abstract out button logic. Several of the objects
in this file have some similar code. Less than you might think, though...
*/


//A relatively simple button. Click and release on top of it to fire a callback.
//with 'continuous' as true, it will keep firing every frame.
App.GuiTextButton = function(x, y, text, callback, continuous, panel){
	this.guiCollider = new App.GuiCollisionRect(x, y, App.GuiTextButton.width, App.GuiTextButton.height);
	this.text = text;
	this.callback = callback;
	if(panel) panel.addChild(this);
	this.guiCollider.functional = true;

	this.activeColor = App.GuiColors.gray[4];
	this.inactiveColor = App.GuiColors.gray[6];
	this.color = this.inactiveColor;

	this.continuous = continuous;
	this.clicked = false;
	this.flair = null;
	this.flairColor = App.GuiColors.gray[1];


	//For continuous callbacks
	this.update = function(){
		if(this.clicked && this.continuous)
			this.callback();
	}

	//Draws a box and the text! Nothing fancy. Could use some work maybe.
	this.render = function(gfx){

		gfx.fillStyle = this.color;
		gfx.fillRect(this.guiCollider.getx(), this.guiCollider.gety(), this.guiCollider.w, this.guiCollider.h);
		gfx.fillStyle = App.GuiTextButton.fg;

		var textX = this.guiCollider.getx() + 2;
		var textY = this.guiCollider.gety() + (this.guiCollider.h / 2);

		var text_w = gfx.measureText(this.text).width;

		textX = this.guiCollider.getx() + (this.guiCollider.w/2 - text_w/2);

		// there is no gfx.measureText(txt).height param so we must use font size
		textY = this.guiCollider.gety() + this.guiCollider.h/2 + 5;

		gfx.fillText(this.text, textX, textY);
		var flair = (this.flair) ? this.flair : App.GuiTextButton.defaultFlair;
		App.GuiTextButton.flairs[flair](gfx, this.flairColor, this.guiCollider.getx(), this.guiCollider.gety());
	}

	//Changes the color and initiates the click
	this.clickStart = function(){
		// this.color = '#2f2f2f';
		this.clicked = true;
	}

	//Checks for moving the mouse off of the button
	this.clickDrag = function(x, y){
		if(!this.guiCollider.collides(x,y)){
			this.color = App.GuiTextButton.bg;
			this.clicked = false;
		}
	}

	//If the click was successful, fire the callback
	this.clickEnd = function(x, y){
		this.color = this.inactiveColor;
		if(!this.guiCollider.collides(x,y))
			return;
		if(this.callback && this.clicked)
			this.callback();
		this.clicked = false;
	}
}
App.GuiTextButton.bg = '#1f1f1f';
App.GuiTextButton.fg = '#ffffff';
App.GuiTextButton.width = 100;
App.GuiTextButton.height = 30;
App.GuiTextButton.defaultFlair = 3;
App.GuiTextButton.flairs = [
	function(gfx, c, x, y){
		return;
	},
	function(gfx, c, x, y){
		gfx.fillStyle = c;
		gfx.fillRect(x +  App.GuiTextButton.width - 5, y + 10, 10, 10);
	},
	function(gfx, c, x, y){
		gfx.strokeStyle = c;
		gfx.lineWidth = 1;
		gfx.strokeRect(x, y, App.GuiTextButton.width, App.GuiTextButton.height);
	},
	function(gfx, c, x, y){
		gfx.strokeStyle = c;
		gfx.lineWidth = 1;
		gfx.strokeRect(x, y, App.GuiTextButton.width, App.GuiTextButton.height);
		gfx.fillStyle = c;
		gfx.fillRect(x +  App.GuiTextButton.width - 5, y + 10, 10, 10);
	},

]

//A relatively simple button. Click and release on top of it to fire a callback.
//with 'continuous' as true, it will keep firing every frame.
App.GuiDropDownMenu = function(guiCollider, text, callback, continuous, panel){
	// TODO
}

//TODO: Cameron, we need designs. Basically the same as above, just a different render method.
//SHOULD abstract some stuff out but for now...
App.GuiVectorButton = function(guiCollider, draw, callback, continuous, panel){
	this.guiCollider = guiCollider;
	if(panel) panel.addChild(this);
}

//A consistent grayscale to help keep colors coordinated
App.GuiColors = {};
App.GuiColors.gray = [
	'#ffffff',
	'#e0e0e0',
	'#c0c0c0',
	'#afafaf',
	'#5a5a5a',
	'#3d3d3d',
	'#1f1f1f',
	'#000000'
]

App.GuiColors.inactive = [
	'#b20000',
	'#00b200',
	'#0000b2',
	'#999900'
]

App.GuiColors.active = [
	'#ff1010',
	'#10ff10',
	'#1010ff',
	'#ffff00'
]

//A backgound panel. You can add things to these to organize your components for
//relative positioning and rapid gui alterations.
App.GuiPanel = function(guiCollider){
	this.guiCollider = guiCollider;
	this.children = [];
	this.xAlignment = 'left';
	this.yAlignment = 'top';
	this.color = App.GuiPanel.rgba;

	this.addChild = function(comp){
		this.children.push(comp);
		comp.guiCollider.positionRelative(this);
	}

	this.removeChild = function(comp){
		var index =this.children.indexOf(comp);
		if (index > -1) {
		  this.children.splice(index, 1);
		}
	}

	this.updatePosition = function(){
		var x = this.guiCollider.baseX;
		var y = this.guiCollider.baseY;
		var ox = (this.guiCollider.w) ? this.guiCollider.w : 0;
		var oy = (this.guiCollider.h) ? this.guiCollider.h : 0;
		var r = (this.guiCollider.r) ? this.guiCollider.r : 0;
		var w = App.Canvases.width;
		var h = App.Canvases.height;

		if(this.xAlignment === 'left'){
			this.guiCollider.x = x + r;
		}
		else if(this.xAlignment === 'right'){
			this.guiCollider.x = x + w - ox - r;
		}
		else if(this.xAlignment === 'center'){
			this.guiCollider.x = x + (w/2) - (ox/2) - r;
		}

		if(this.yAlignment === 'top'){
			this.guiCollider.y = y + r;
		}
		else if(this.yAlignment === 'bottom'){
			this.guiCollider.y = y + h - oy - r;
		}
		else if(this.yAlignment === 'center'){
			this.guiCollider.y = y + (h/2) - (oy/2) - r;
		}

		for (var c in this.children){
			this.children[c].guiCollider.positionRelative(this);
		}
	}

	this.render = function(gfx){
		gfx.fillStyle = this.color;
		gfx.fillRect(this.guiCollider.getx(), this.guiCollider.gety(), this.guiCollider.w, this.guiCollider.h);
	}

}
App.GuiPanel.rgba = 'rgba(0,0,0, 0.75)';

//Subclassing in JS is awful. Breaks everything. Use factories instead usually
App.makeBlockingPanel = function(){
	var p = new App.GuiPanel(new App.GuiCollisionRect(0,0,App.Canvases.width, App.Canvases.height));
	p.color = 'rgba(0,0,0,0.50)';
	return p;
}

//Positions this component relative to another component, instead of absolute positioning on the screen
var positionRelative = function(component){
	if(!component)
		return;
	if(!component.guiCollider)
		return;
	var r = component.guiCollider;

	this.x = r.x + this.baseX;
	this.y = r.y + this.baseY;
}

App.GuiCollisionCircle = function(x, y, r){
	this.x = x;
	this.y = y;
	this.baseX = x;
	this.baseY = y;
	this.r = r;

	this.getx = function(){
		return this.x;
	}

	this.gety = function(){
		return this.y;
	}
	this.functional = false;

	this.collides = function(x, y){
		return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.r * this.r;
	}

	this.positionRelative = positionRelative;
}

//Abstracts out some logic for coordinates and collision, relative positioning
App.GuiCollisionRect = function(x, y, w, h){
	this.x = x;
	this.y = y;
	this.baseX = x;
	this.baseY = y;
	this.w = w;
	this.h = h;
	this.functional = false;

	this.getx = function(){
		return this.x;
	}

	this.gety = function(){
		return this.y;
	}

	this.geth = function(){
		return this.h;
	}

	this.getw = function(){
		return this.w;
	}


	//Tests if a point is inside of the rectangle
	this.collides = function(x, y){
		return ((x > this.x) && (x < (this.x + this.w)) &&
			   	(y > this.y) && (y < (this.y + this.h)));
	}

	this.positionRelative = positionRelative;
}