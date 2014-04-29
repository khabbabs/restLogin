App.Box = function(gfx,x,y,width,height,enterDelay,exitDelay){
	var box = {};

	box.gfx             = gfx;
	box.x               = x;
	box.y               = y;
	box.width           = width;
	box.height          = height;
	box.enterDelay      = enterDelay;
	box.exitDelay       = exitDelay;

	box.left            = x;
	box.right           = x;
	box.goalLeft        = x;
	box.goalRight       = x;
	box.interpLeftTick  = 0;
	box.interpRightTick = 0;

	box.collide = function(x,y){
		if(x >= box.x && x < box.x+box.width)
		if(y >= box.y && y < box.y+box.height)
			return true;
		return false;
	}

	box.enter = function(){
		box.left  = box.goalLeft  = box.x;
		box.right = box.goalRight = box.x;
		box.goalRight = box.x+box.width;
		box.interpRightTick = App.Engine.tick+box.enterDelay;
	}

	box.render = function(){
		var updating = false;

		if(box.left != box.goalLeft){
			updating = true;
			if(App.Engine.tick >= box.interpLeftTick)box.left += expInterp(box.left,box.goalLeft,0.005,1);
		}if(box.right != box.goalRight){
			updating = true;
			if(App.Engine.tick >= box.interpRightTick)box.right += expInterp(box.right,box.goalRight,0.005,1);
		}

		gfx.fillRect(box.left,box.y,box.right-box.left,box.height);
		return updating;
	}

	box.exit = function(){
		box.goalLeft = box.x+box.width;
		box.interpLeftTick = App.Engine.tick+box.exitDelay;
	}

	return box;
}

//============================================================================//

App.Button = function(txt,primaryBtnCol,primaryTxtCol,secondaryBtnCol,secondaryTxtCol,
                      gfx,x,y,width,height,enterDelay,exitDelay){ // TODO: take out height
	var button = {};

	button.gfx             = gfx;
	button.x               = x;
	button.y               = y;
	button.height          = height;
	button.txt             = txt;
	button.primaryBtnCol   = primaryBtnCol;
	button.primaryTxtCol   = primaryTxtCol;
	button.secondaryBtnCol = secondaryBtnCol;
	button.secondaryTxtCol = secondaryTxtCol;
	button.hover           = false;
	button.oldHover        = false;
	button.box = new App.Box(gfx,x,y,width,height,enterDelay,exitDelay);

	button.enter = function(){button.box.enter();}
	button.exit = function(){button.box.exit();}

	button.collide = function(x,y){
		button.oldHover = button.hover;
		return button.hover = button.box.collide(x,y);
	}

	button.render = function(){
		button.gfx.fillStyle = button.hover?button.secondaryBtnCol:button.primaryBtnCol;
		var retVal = button.box.render();
		button.gfx.fillStyle = button.hover?button.secondaryTxtCol:button.primaryTxtCol;
		text(button.gfx,button.txt,x+2,y+3,height-6,-2);
		return retVal;
	}

	return button;
}
