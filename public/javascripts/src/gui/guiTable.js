/*
For displaying leaderboards and level select.
*/

App.GuiTable = function(x, y, ppanel){
	this.json = null;
	this.table = []; //to be filled with GuiTableRow objects
	this.cbuttons = []; //to be filled with column button objects

	this.panel = new App.GuiPanel(new App.GuiCollisionRect(x, y, 100, 50)); //will be resized
	this.panel.color = App.GuiColors.gray[6];
	this.guiCollider = this.panel.guiCollider;
	this.guiCollider.functional = true;
	if(ppanel) ppanel.addChild(this);
	this.parentPanel = ppanel;

	this.rowHeight = 20;
	this.colWidth  = 100;
	this.x = x;
	this.y = y;

	this.lastSortedCol = null;
	this.lastSortedSign = 1;

	this.activeRow = -1; //-1 for none
	this.testActiveRow = -1;

	this.oddColor = App.GuiColors.gray[5];
	this.evenColor = App.GuiColors.gray[4];


	this.activeColor = App.GuiColors.gray[3];
	this.testActiveColor = App.GuiColors.gray[2];

	this.update = function(){
		for(var b in this.cbuttons){
			this.cbuttons[b].update();
		}
	}


	//takes a column and whether or not to sort alphabetically
	this.sortBy = function(col){
		var sign = (this.lastSortedCol === col)? this.lastSortedSign * -1 : 1;
		this.lastSortedCol = col;
		this.lastSortedSign = sign;

		this.table.sort(function(a, b){
			var res = 0;
			if(a.entries[col] === b.entries[col])
				return 0;
			return (a.entries[col] < b.entries[col]) ? (-1 * sign) : (1 * sign);

		});
		App.Gui.drawStatic = true;
	}

	this.render = function(gfx){
		this.panel.render(gfx);
		for(var b in this.cbuttons){
			this.cbuttons[b].render(gfx);
		}
		for(var o in this.table){
			for(var k in this.table[o].entries){
				var entry = this.table[o].entries[k];
				var entryWidth = gfx.measureText(entry).width;

				gfx.fillStyle = (o%2 == 0) ? this.evenColor : this.oddColor;

				//intentional use of == vs ===
				if(o == this.testActiveRow) gfx.fillStyle = this.testActiveColor;
				if(o == this.activeRow) gfx.fillStyle = this.activeColor;

				var x = k * this.colWidth + this.guiCollider.getx();
				var y = o * this.rowHeight + this.guiCollider.gety() + 30;
				gfx.fillRect(x, y,this.colWidth,this.rowHeight);

				gfx.fillStyle = App.GuiTextButton.fg;
				var textX = x + this.colWidth/2 - entryWidth/2;
				var textY = y + this.rowHeight/2 + 5;

				if (textX >= x && entryWidth < this.colWidth)
					gfx.fillText(entry, textX, textY);
				else gfx.fillText(entry, x + 2, textY);

				gfx.fillStyle = App.GuiColors.gray[1];
				gfx.fillRect(x-1,this.guiCollider.gety(), 1, this.guiCollider.h);
			}
		}
		gfx.fillStyle = App.GuiColors.gray[1];
		gfx.fillRect(this.guiCollider.w + this.guiCollider.getx(),this.guiCollider.gety(), 1, this.guiCollider.h);
		gfx.fillRect(this.guiCollider.getx()-1,this.guiCollider.gety()-1, this.guiCollider.w + 1,1);
		gfx.fillRect(this.guiCollider.getx()-1,this.guiCollider.gety() + this.guiCollider.h, this.guiCollider.w + 1,1);
	}

	this.clickStart = function(){
		if(!this.json)
			return;

		var x = App.InputHandler.mouseData.x;
		var y = App.InputHandler.mouseData.y;

		for(var b in this.cbuttons){
			this.cbuttons[b].clickStart(x, y);
		}

		y = Math.floor((y - this.guiCollider.gety()-30)/this.rowHeight);

		this.testActiveRow = -1;
		this.activeRow = -1;

		if(this.table[y])
			this.testActiveRow = y;
	}

	this.clickEnd = function(x, y){
		if(!this.json)
			return;

		for(var b in this.cbuttons){
			this.cbuttons[b].clickEnd(x, y);
		}

		y = Math.floor((y - this.guiCollider.gety() - 30)/this.rowHeight);

		this.activeRow = -1;

		if(this.table[y] && y === this.testActiveRow)
			this.activeRow = y;
		this.testActiveRow = -1
	}

	this.clickDrag = function(x, y){
		for(var b in this.cbuttons){
			this.cbuttons[b].clickDrag(x, y);
		}

		y = Math.floor((y - this.guiCollider.gety() - 30)/this.rowHeight);

		if(y !== this.testActiveRow)
			this.testActiveRow = -1;
	}

	this.setData = function(json){
		if(!json)
			return;
		this.table = [];
		this.json = json;
		for(var b in this.cbuttons){
			this.parentPanel.removeChild(this.cbuttons[b]);
		}
		this.cbuttons = [];
		if(json.length <= 0)
			return;

		var i = 0, that = this;
		for(var o in json){
			this.table.push(new App.GuiTable.TableRow(json[o]));
			i++;
		}

		i=0;
		for(var c in json[0]){
			if(!tFilter[c]){
				var b  = new App.GuiTable.TableButton(i, c, this);
				this.cbuttons.push(b);
				i++;
			}
		}

		this.width = i * this.colWidth;
		this.height = json.length * this.rowHeight + 30;
		this.guiCollider.w = this.width;
		this.guiCollider.h = this.height;

		App.Gui.drawStatic = true;

	}

}

App.GuiTable.TableButton = function(x, string, table){
	this.guiCollider = new App.GuiCollisionRect(x * table.colWidth + table.guiCollider.baseX, table.guiCollider.baseY, table.colWidth, 30);
	this.text = string;
	if(table.parentPanel)
		table.parentPanel.addChild(this);

	this.activeColor = App.GuiColors.gray[4];
	this.inactiveColor = App.GuiColors.gray[6];
	this.color = this.inactiveColor;
	this.table = table;
	this.col = x;

	this.clicked = false;
	

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
		var textW = gfx.measureText(this.text).width;
		var textX = this.guiCollider.getx() + this.guiCollider.w/2 - textW/2;
		var textY = this.guiCollider.gety() + (this.guiCollider.h / 2) + 5;
		if (textX > this.guiCollider.getx())
			gfx.fillText(this.text, textX, textY);
		else gfx.fillText(this.text, this.guiCollider.getx() + 2, textY);
	}

	//Changes the color and initiates the click
	this.clickStart = function(x, y){
		if(this.guiCollider.collides(x, y)){
			this.clicked = true;
			this.color = this.activeColor;
		}
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
		if(this.clicked){
			//do resorting of table. OH BOY will THAT be fun! :/
			this.table.sortBy(this.col);
		}
		this.clicked = false;
	}


}

//just filters out things to see. Everything DOES get stored, not all is visible!
var tFilter = {'__v':true, '_id':true, 'level_str':true};

//I don't like this, but until we get this functionality
//built into the JSON or the server, it helps
var scrubData = function(s, t){
	if(tFilter[t])
		return null;

	if(t === 'created'){
		s = s.split('T')[0];
	}

	return s;
}

App.GuiTable.TableRow = function(json){
	this.entries = [];
	this.json = json;
	var i = 0;
	var s = null;
	for(var k in json){
		s = scrubData(json[k], k);
		if(s !== null){
			this.entries.push(s);
			i++;
		}
	}
}
