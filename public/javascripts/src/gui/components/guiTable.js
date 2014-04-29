/*
For displaying leaderboards and level select.
*/


App.GuiTable = function(x, y, maxRows, descrip){
	App.GuiTools.Component.call(this, x, y, descrip.length * 132 + 2, 26*maxRows+2, 100, 100, null , null);
	this.json = null;

	this.table = [];
	for(var k in descrip){
		this.table[k] = [];
	}

	this.color = this.baseColor = '#000000';
	this.descrip = descrip;
	this.emptyMessage = 'No levels found; try another search?';
	this.loadingMessage='Loading...';
	this.loading = false;
	this.functional = true;

	this.rowHeight       = 24;
	this.colWidth        = 130;
	this.x               = x;
	this.y               = y;
	this.border          = 2;

	this.lastSortedCol   = null;
	this.lastSortedSign  = 1;

	this.activeRow       = -1; //-1 for none
	this.testActiveRow   = -1;

	this.buttonColor     = '#ffffff';
	this.oddColor        = '#f0f0f0';
	this.evenColor       = '#d0d0d0';
	this.activeColor     = this.baseColor;
	this.hoverColor      = this.baseColor;
	this.testActiveColor = '#101010';
	this.activeTextColor = this.textColor;

	this.butHover = null;//button hovering over
	this.butClick = null;//button clicked
	this.selectedRow = null;
	this.hoverRow = null;

	this.butHoverColor = '#ababab';
	this.butClickColor = '#000000';
	this.butClickTextColor = '#ffffff';
	this.selectedColor = '#000000';
	this.selectedTextColor = '#ffffff';
	this.hoverRowColor = '#ababab';

	var that = this;
	this.renderLayers['Table'] = function(gfx){
		var x = that.getx()+that.border;
		if(!that.json){
			var t = (that.loading)?that.loadingMessage : that.emptyMessage;
			gfx.textBaseline = "alphabetic";
			gfx.font = "800 "+(this.h-6)*1.37+"px arial";

			var tw = gfx.measureText(t).width + (t.length) * -2;
			gfx.fillStyle = that.buttonColor;
			text(gfx, t,that.getx() + that.w/2 - 3*tw/13, that.gety() + (that.h/2), that.rowHeight-6, -2 );
		}
		for(var k in that.descrip){
			var y = that.gety()+that.border;

			gfx.fillStyle = that.buttonColor;
			if(k == that.butHover) gfx.fillStyle = that.butHoverColor;
			if(k == that.butClick) gfx.fillStyle = that.butClickColor;
			gfx.fillRect(x, y, that.colWidth, that.rowHeight);
			gfx.fillStyle = that.textColor;
			if(k == that.butClick) gfx.fillStyle = that.butClickTextColor;
			text(gfx, that.descrip[k].name, x+2, y+3, that.rowHeight-6, -2);

			for(var i in that.json){
				y += that.rowHeight + that.border;
				var v = that.json[i][that.descrip[k].id];
				//deal with dates
				if(that.descrip[k].id === 'created')
					v = v.substring(0, v.indexOf('T'));

				gfx.fillStyle = (i%2 === 0)? that.evenColor : that.oddColor;
				if(i == (that.hoverRow-1)) gfx.fillStyle = that.hoverRowColor;
				if(i == (that.selectedRow-1)) gfx.fillStyle = that.selectedColor;
				gfx.fillRect(x, y, that.colWidth, that.rowHeight);
				gfx.fillStyle = that.textColor;
				if(i == (that.selectedRow-1)) gfx.fillStyle = that.selectedTextColor;
				text(gfx, v, x+2, y+3, that.rowHeight-6, -2);
			}
			x += that.border + that.colWidth
		}
	}

	this.update = function(){
		if(!App.InputHandler.lmb)
			this.butClick = null;
		var c = this.getLocalCoords();
		var x = c.x;
		var y = c.y;
		this.hoverRow = null;
		this.butHover = null;
		if(y === 0){
			if(x !== this.butClick)
				this.butClick = null;
			this.butHover = x;
		}
		else{
			this.hoverRow = y;
		}
		this.changed = true;
	}

	this.clickStart = function(){
		var c = this.getLocalCoords();
		var x = c.x;
		var y = c.y;

		if(y === 0){
			this.butClick = x;
		}
		else {
			this.selectedRow = y;
		}

	}

	this.clickEnd = function(){
		var c = this.getLocalCoords();
		var x = c.x;
		var y = c.y;
		if(y == 0 && x == this.butClick){
			this.sortBy(this.descrip[x].id);
		}
	}

	this.getLocalCoords = function(){
		var x = App.InputHandler.mouseX +2;
		var y = App.InputHandler.mouseY +2;
		//determine row, if any
		y = Math.floor((y - this.gety())/(this.rowHeight + this.border));
		//determine column
		x = Math.floor((x - this.getx())/(this.colWidth + this.border));

		return {x:x, y:y};
	}

	this.getSelectedEntry = function(){
		if(this.selectedRow !== null && this.json){
			return this.json[this.selectedRow-1];
		}
		return null;
	}

	var that = this;
	this.setData = function(json){
		that.selectedRow = null;
		that.loading = false;
		if(!json)
			return;
		if((typeof json) === 'string'){
			return;
		}
		console.log(json);
		that.json = json;
	}

	//takes a column and whether or not to sort alphabetically
	this.sortBy = function(col){
		if(!this.json)
			return;
		var sign = (this.lastSortedCol === col)? this.lastSortedSign * -1 : 1;
		this.lastSortedCol = col;
		this.lastSortedSign = sign;

		this.json.sort(function(a, b){
			return (a[col].toLowerCase() < b[col].toLowerCase()) ? (-1 * sign) : (1 * sign);
		});
	}
}
App.GuiTable.prototype = Object.create(g.Component);
App.GuiTable.prototype.constructor = App.GuiTable;