App.PlanningControls = function(){
	var that = this;
	this.downX; this.downY; this.downC; this.downScrnX; this.downScrnY;
	this.upX; this.upY; this.upC
	this.curX; this.curY;
	this.dragged = false;
	this.isDown = false;

	this.setCurrentMouseCoords = function(x, y){
		that.curX = x;
		that.curY = y;
	}

	this.setDown = function(mX, mY, mC, scrnX, scrnY){
		that.dragged = false;
		that.isDown = true;
		that.downX = mX;
		that.downY = mY;
		that.downC = mC;
		that.downScrnX = scrnX;
		that.downScrnY = scrnY;
	}
	
	this.setUp = function(mX, mY, mC){
		that.isDown = false;
		that.upX = mX; that.upY = mY; that.upC = mC;
		if(that.downX !== that.upX || that.downY !== that.upY || that.downC !== that.upC){
			this.dragged = true;
		} else { this.dragged = false; }
		//console.log(mX + ' ' + mY + ' ' + mC + ' ' + that.dragged);
		if(!App.Game.currentPlanningLevel.copied && !App.Game.currentPlanningLevel.moving){ that.select(that.dragged); }
		else if(App.Game.currentPlanningLevel.copied){
			App.Game.currentPlanningLevel.doCopy(that.downX, that.downY);
		}else{
			App.Game.currentPlanningLevel.doMove(that.downX, that.downY);
		}
	}

	this.select = function(isDrag){
		if(isDrag){
			// group select
				App.Game.currentPlanningLevel.selectCells(that.downX, that.downY, that.downC, that.upX, that.upY, that.upC);
		}else{
			// single instruction select
			App.Game.currentPlanningLevel.selectInstruction(that.upX, that.upY, that.upC);
		}
		App.Game.requestStaticRenderUpdate = true;
	}
}