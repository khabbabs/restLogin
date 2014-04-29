App.makeModeHandler = function(){
	var modeHandler = {};

	modeHandler.modes = [];
	modeHandler.modeStack = [];
	modeHandler.currentMode;

	// ========================================================== //

	modeHandler.pushMode = function(name){
		var mode = modeHandler.modes[name];
		if(!mode)return;

		if(modeHandler.currentMode) modeHandler.currentMode.exitFunc();
		modeHandler.modeStack.push(mode);
		modeHandler.currentMode = mode;
		modeHandler.currentMode.enterFunc();
	}

	modeHandler.popMode = function(num){
		if(num === undefined)num = 1;
		while(num --> 0){
			modeHandler.currentMode.exitFunc();
			modeHandler.modeStack.pop();
			modeHandler.currentMode = modeHandler.modeStack[modeHandler.modeStack.length-1];
			modeHandler.currentMode.enterFunc();
		}
	}

	// ========================================================== //

	// REMEMBER TO SET UPDATEFUNC,enterFunc,EXITFUNC WHEN CREATING NEW MODE
	// remember to set updatingActive to false when the transition is complete

	modeHandler.addNewMode = function(name){
		var mode = {};

		// input ---------------------------------------

		mode.keyDownFuncs    = [];
		mode.keyUpFuncs      = [];
		mode.mouseDownFuncs  = [];
		mode.mouseMoveFunc;
		mode.mouseUpFuncs    = [];
		mode.mouseWheelFunc;
		mode.resizeFunc;

		mode.registerKeyDownFunc    = function(key,func){mode.keyDownFuncs[App.InputHandler.keyCharToCode[key]]=func;}
		mode.registerKeyUpFunc      = function(key,func){mode.keyUpFuncs[App.InputHandler.keyCharToCode[key]]=func;}
		mode.registerMouseDownFunc  = function(button,func){mode.mouseDownFuncs[button]=func;}
		mode.registerMouseMoveFunc  = function(func){mode.mouseMoveFunc=func;}
		mode.registerMouseUpFunc    = function(button,func){mode.mouseUpFuncs[button]=func;}
		mode.registerMouseWheelFunc = function(func){mode.mouseWheelFunc=func;}
		mode.registerResizeFunc     = function(func){mode.resizeFunc=func;}

		// update/render -------------------------------

		mode.updatingActive = false;
		mode.requestStaticRenderUpdate = false;

		mode.updateFunc = function(){
			if(mode.exitFlag)mode.updatingActive=false;
			console.log("updating "+name+" | TODO: OVERWRITE UPDATEFUNC");
		};

		// transition ----------------------------------

		mode.exitFlag;

		mode.enterFunc = function(){
			mode.updatingActive=true;
			mode.exitFlag = false;
			console.log(name+' entering'+" | TODO: OVERWRITE enterFunc");
		};

		mode.exitFunc = function(){
			mode.exitFlag=true;
			console.log(name+' exiting'+" | TODO: OVERWRITE EXITFUNC");
		};

		// ---------------------------------------------

		modeHandler.modes[name] = mode;

		//GUI ------------------------------------------

		//XXX will this work? Only one gets drawn at any given time...?


		return mode;
	}

	// ========================================================== //

	modeHandler.update = function(){
		for(var i in modeHandler.modes)
		if(modeHandler.modes[i].updatingActive)
			modeHandler.modes[i].updateFunc();
		if(modeHandler.modes[i].gui)
			modeHandler.modes[i].gui.render();
	}

	modeHandler.callResizeFuncs = function(){
		for(var i in modeHandler.modes){
			var mode = modeHandler.modes[i];
			mode.requestStaticRenderUpdate = true;
			if(mode.resizeFunc)mode.resizeFunc();
		}
	}

	// ========================================================== //

	return modeHandler;
}
