// TODO: WHY DOES THIS FLASH WHEN ENTERED
// TODO: DISPLAY WHAT THE ERROR WAS

App.setupErrorGui = function(){
	var error = App.ModeHandler.addNewMode('error');

	error.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	error.returnButton = new App.Button('Return','#fff','#000','#f00','#fff',error.gfx,15,56+28*0,512,24,200,000);
	error.alpha = error.goalAlpha = 0;

	error.enterFunc = function(){
		error.requestStaticRenderUpdate = true;
		error.updatingActive = true;
		error.exitFlag = false;

		error.returnButton.enter();
		error.goalAlpha = 1;

		App.Shade.turnOn();
		App.Game.requestPause = true;
	}

	error.updateFunc = function(){
		if(!error.requestStaticRenderUpdate)return;
		error.requestStaticRenderUpdate = false;

		error.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		error.gfx.fillStyle = '#fff';
		text(error.gfx,"Error",15,15,36,-3);

		if(error.returnButton.render())error.requestStaticRenderUpdate = true;
		if(error.alpha !== error.goalAlpha){
			error.alpha += expInterp(error.alpha,error.goalAlpha,0.003,0.01);
			error.gfx.globalAlpha = error.alpha;
			error.requestStaticRenderUpdate = true;
		}

		if(error.exitFlag && error.requestStaticRenderUpdate === false){
			error.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			error.updatingActive = false;
		}
	}

	error.exitFunc = function(){
		error.requestStaticRenderUpdate = true;
		error.exitFlag = true;

		error.returnButton.exit();
		error.goalAlpha = 0;
		App.Shade.turnOff();
		App.Game.setMode(App.Game.modes.PLANNING);
	}

		// ---------------------------------------------

	error.registerMouseMoveFunc(function(x,y){
		if(error.returnButton.collide(x,y) && !error.returnButton.oldHover)error.requestStaticRenderUpdate = true;
		if(error.returnButton.oldHover !== error.returnButton.hover)error.requestStaticRenderUpdate = true;
	});

	error.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT,function(x,y){
		if(error.returnButton.collide(x,y)){
			// mode must be popped twice
			App.ModeHandler.popMode();
			App.ModeHandler.popMode();
			error.requestStaticRenderUpdate = true;
		}
	});

	error.registerKeyDownFunc('Esc',function(){
		error.requestStaticRenderUpdate = true;
		// mode must be popped twice
		App.ModeHandler.popMode();
		App.ModeHandler.popMode();
	});
}
