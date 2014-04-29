App.PlanningGraphics = function(){

	var that = this;

	this.lmb = ['up',-1,-1,-1,-1,-1]; // [button state, scrnX, scrnY, cell x, cell y, cell c]
	this.mmb = ['up',-1,-1,-1,-1,-1];
	this.rmb = ['up',-1,-1,-1,-1,-1];
	this.mousePos = [-1,-1,-1,-1,-1]; // current mouse position [scrnX, scrnY, cellX, cellY, cellC]

	this.lmbDown = []; this.lmbUp = [];
	this.lmbDrag = false; this.lmbStartOnTile = false;
	this.inMenu = false;

	this.inserted = false;
	this.moving = false;
	this.copying = false;

	this.mouseMove = function(cellX, cellY){
		that.mousePos[0] = App.InputHandler.mouseX;
		that.mousePos[1] = App.InputHandler.mouseY;
		that.mousePos[2] = cellX;
		that.mousePos[3] = cellY;
		that.mousePos[4] = App.GameRenderer.mouseC;

		if( (that.mousePos[2] !== that.mmb[3] || that.mousePos[3] !== that.mmb[4]) && that.lmb[0] === 'down'){
			that.moving = true;
		}
		else{ that.moving = false; }
	}

	this.mouseDown = function(button, cellX, cellY){
		if(button === 'lmb'){
			that.lmb[0] = 'down';
			that.lmb[1] = App.InputHandler.mouseX;
			that.lmb[2] = App.InputHandler.mouseY;
			that.lmb[3] = cellX;
			that.lmb[4] = cellY;
			that.lmb[5] = App.GameRenderer.mouseC;

			var menuTest = App.ModeHandler.currentMode.gui.testCoordinates(that.lmb[1],that.lmb[2]);

			if(menuTest.p.length > 0 || menuTest.f.length > 0){ that.inMenu = true; } else { that.inMenu = false; }

			that.lmbDown[0] = cellX;
			that.lmbDown[1] = cellY;
			that.lmbDown[2] = App.GameRenderer.mouseC;

			var instr = App.Game.currentPlanningLevel.getInstruction(cellX, cellY, App.GameRenderer.mouseC);
			if(instr && App.Game.currentPlanningLevel.currentSelection.indexOf(instr) !== -1){
				that.lmbStartOnTile = true;
			}
			else{
				that.lmbStartOnTile = false;
			}
		}
		else if(button === 'mmb'){
			that.mmb[0] = 'down';
			that.mmb[1] = App.InputHandler.mouseX;
			that.mmb[2] = App.InputHandler.mouseY;
			that.mmb[3] = cellX;
			that.mmb[4] = cellY;
			that.mmb[5] = App.GameRenderer.mouseC;
		}
		else{
			that.rmb[0] = 'down';
			that.rmb[1] = App.InputHandler.mouseX;
			that.rmb[2] = App.InputHandler.mouseY;
			that.rmb[3] = cellX;
			that.rmb[4] = cellY;
			that.rmb[5] = App.GameRenderer.mouseC;
		}
	}

	this.mouseUp = function(button, cellX, cellY){
		if(button === 'lmb'){
			that.lmb[0] = 'up';
			that.lmb[1] = App.InputHandler.mouseX;
			that.lmb[2] = App.InputHandler.mouseY;
			that.lmb[3] = cellX;
			that.lmb[4] = cellY;
			that.lmb[5] = App.GameRenderer.mouseC;

			that.lmbUp[0] = cellX;
			that.lmbUp[1] = cellY;
			that.lmbUp[2] = App.GameRenderer.mouseC;

			if(that.lmbDown[0] === that.lmbUp[0] && that.lmbDown[1] === that.lmbUp[1]
				&& that.lmbDown[2] === that.lmbUp[2]){ that.lmbDrag = false; } else { that.lmbDrag = true; }

			if(that.lmbDrag){ that.drag(); } else { that.single(); }
		}
		else if(button === 'mmb'){
			that.mmb[0] = 'up';
			that.mmb[1] = App.InputHandler.mouseX;
			that.mmb[2] = App.InputHandler.mouseY;
			that.mmb[3] = cellX;
			that.mmb[4] = cellY;
			that.mmb[5] = App.GameRenderer.mouseC;
		}
		else{
			that.rmb[0] = 'up';
			that.rmb[1] = App.InputHandler.mouseX;
			that.rmb[2] = App.InputHandler.mouseY;
			that.rmb[3] = cellX;
			that.rmb[4] = cellY;
			that.rmb[5] = App.GameRenderer.mouseC;
		}
	}

	this.drag = function(){
		if(!that.inMenu){
			if(App.Game.currentPlanningLevel.currentSelection.length === 0 || !that.lmbStartOnTile){
				var s = that.lmbDown;
				var f = that.lmbUp;
				App.Game.currentPlanningLevel.selectInstructions(s[0], s[1], s[2], f[0], f[1], f[2]);
			}
			else if(App.Game.currentPlanningLevel.currentSelection.length !== 0 && that.lmbStartOnTile){
				var shiftX = that.lmbUp[0] - that.lmbDown[0];
				var shiftY = that.lmbUp[1] - that.lmbDown[1];
				if(App.InputHandler.keysDown[App.InputHandler.keyCharToCode['Ctrl']] === true){
					App.Game.currentPlanningLevel.copy(App.Game.currentPlanningLevel.currentSelection, shiftX, shiftY);
				}
				else{
					App.Game.currentPlanningLevel.move(App.Game.currentPlanningLevel.currentSelection, shiftX, shiftY);
				}
			}
		}
	}

	this.single = function(){
		if(!that.inMenu){
			if(!that.inserted){
				var s = that.lmbDown;
				var f = that.lmbUp;
				App.Game.currentPlanningLevel.selectInstructions(s[0], s[1], s[2], f[0], f[1], f[2]);
			}
		}
	}

	this.staticRender = function(gfx){}

	this.selectionOverlay = function(gfx){

		var currentSelection = App.Game.currentPlanningLevel.currentSelection;
		gfx.fillStyle = 'rgba(100,100,100,.5)';
		gfx.strokeStyle = '#ffffff';

		var gridX, gridY, color, size, scrnX, scrnY, offsetX, offsetY;		
		var i = 0;

		App.GameRenderer.translateCanvas(gfx);
		do{
			gfx.fillStyle = 'rgba(100,100,100,.5)';
			gfx.strokeStyle = '#ffffff';

			gridX = currentSelection[i].x;
			gridY = currentSelection[i].y;
			color = currentSelection[i].color;
			size = App.GameRenderer.cellSize;
			scrnX = size * gridX;
			scrnY = size * gridY;
			size = size / 2; // TODO: ask about cellSizeFactor

			offsetX;
			offsetY;

			if(color == 0){
				offsetX = 0; offsetY = 0;
			}else if(color == 1){
				offsetX = size; offsetY = 0;
			}else if(color == 2){
				offsetX = 0; offsetY = size;
			}else{
				offsetX = size; offsetY = size;
			}

			// TODO: get rid of clear rect for efficiency
			if(App.Game.currentPlanningLevel.grid[gridX][gridY][color] !== null){
				gfx.strokeRect(scrnX+offsetX, scrnY+offsetY, size, size);
				gfx.clearRect(scrnX+offsetX+5, scrnY+offsetY-2, size-10, size+4);
				gfx.clearRect(scrnX+offsetX-2, scrnY+offsetY+5, size+4, size-10);
			}
			++i;
		} while(i < currentSelection.length);
		gfx.restore();
	}

	this.dynamicRender = function(gfx){
		App.GameRenderer.tempGfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		// selection overlay
		if(App.Game.currentPlanningLevel.currentSelection.length !== 0
			&& App.Game.currentPlanningLevel.currentSelection[0] !== null ){ that.selectionOverlay(gfx); } // TODO: move to static render?

		// drag selection box
		if(that.moving && App.Game.currentPlanningLevel.currentSelection.length === 0){ that.drawSelectionBox(gfx); }
		else if(that.moving && that.lmbStartOnTile === false){ that.drawSelectionBox(gfx); }
		// TODO can make into one if now that lmbStartOnTile changed?

		// move / copy graphics
		if(App.Game.currentPlanningLevel.currentSelection.length !== 0
			&& that.moving && that.lmbStartOnTile){ that.moveCopy(gfx); }
			// there's a bug that keeps displaying the ghost instructions.
			// sheould we clear the selection array here?
	}

	this.moveCopy = function(gfx){
		var mX = that.mousePos[0];
		var mY = that.mousePos[1];
		
		// drag line
		// I don't think we need this
		gfx.strokeStyle = 'rgba(200,200,200,.75)';
		gfx.lineWidth = 2;
		gfx.beginPath();
		gfx.moveTo(that.lmb[1], that.lmb[2]);
		gfx.lineTo(mX, mY);
		gfx.stroke();
		

		// move shadows
		/*var size = App.GameRenderer.cellSize/2;

		var selected = App.Game.currentPlanningLevel.currentSelection;
		var offX; var offY; var offCX = 0; var offCY = 0;
		var msX = that.lmbDown[0]; var msY = that.lmbDown[1]; var msC = that.lmbDown[2];
		var iX; var iY; var iC;

		for(instr in selected){
			
			iX = selected[instr].x; 
			iY = selected[instr].y; 
			iC = selected[instr].color;
			iT = selected[instr].type;
			
			offX = msX - iX; 
			offY = msY - iY;
			offX = offX * size * 2; 
			offY = offY * size * 2;

			// I think something is wrong with this.  Ask Kevin
			if(msC !== iC){
				if(msC % 2 === 0 && iC % 2 !== 0){ offCX = size; } // shift right
				if(msC % 2 === 1 && iC % 2 !== 1){ offCX = -size; } // shift left
				if(msC < 2 && iC >= 2){ offCY = size; } // shift down
				if(msC >= 2 && iC < 2){ offCY = -size; } // shift up
			}
			// shadows for icons
			// TODO: draw icons at .5 opacity
			switch (iC){
				case App.COLORS.RED: 
					gfx.strokeStyle = 'rgba(100,0,0,1)'; 
					gfx.fillStyle = 'rgba(100,0,0,.5)';
					break;
				case App.COLORS.GREEN: 
					gfx.strokeStyle = 'rgba(0,100,0,1)'; 
					gfx.fillStyle = 'rgba(0,100,0,.5)';
					break;
				case App.COLORS.BLUE: 
					gfx.strokeStyle = 'rgba(0,0,100,1)'; 
					gfx.fillStyle = 'rgba(0,0,100,.5)';
					break;
				case App.COLORS.YELLOW:
					gfx.strokeStyle = 'rgba(100,100,0,1)'; 
					gfx.fillStyle = 'rgba(100,100,0,.5)';
					break;
			}
			
			gfx.fillRect(mX-size/2-offX-offCX, mY-size/2-offY-offCY, size, size);
			gfx.strokeRect(mX-size/2-offX-offCX, mY-size/2-offY-offCY, size, size);
			
		}*/

	}

	this.drawSelectionBox = function(gfx){	
		var curX = that.mousePos[0];
		var curY = that.mousePos[1];
		var downX = that.lmb[1];
		var downY = that.lmb[2];
		if(!that.inMenu){
			gfx.fillStyle = 'rgba(255,255,255,0.1)';
			gfx.fillRect(curX, curY, (downX-curX), (downY-curY) );
			gfx.strokeStyle = '#ffffff';
			gfx.lineWidth = 2;
			gfx.strokeRect(curX, curY, (downX-curX), (downY-curY) );
		}
	}
}
