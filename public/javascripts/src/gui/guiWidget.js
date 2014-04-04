/*
	I felt like we needed something that could draw abstract, random stuff to the gui and be included
	as a component without necessarily being clickable, so here is a place to put those things
*/

App.GuiTextWidget = function(text, spacing, font, x, y, panel){
	this.guiCollider = new App.GuiCollisionRect(x, y, 0,0);
	this.text = text;
	this.font = font;
	this.spacing = spacing;
	if(panel) panel.addChild(this);

	//Draws a box and the text! Nothing fancy. Could use some work maybe.
	this.render = function(gfx){
		gfx.font = this.font;
		gfx.fillStyle = App.GuiTextButton.fg;
		var textX = this.guiCollider.getx();
		var textY = this.guiCollider.gety();
		for(var t in this.text){
			gfx.fillText(this.text[t], textX, textY + this.spacing * t);
		}
	}



}