// TODO: WHY DOES THIS FLASH WHEN ENTERED
// TODO: DISPLAY SCORES
// TODO: NEXT LEVEL

App.setupSuccessGui = function(){
	var success = App.ModeHandler.addNewMode('success');

	success.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	success.backButton = new App.Button('Back','#fff','#000','#f00','#fff',success.gfx,15,56+28*0,512,24,200,000);
	success.returnButton = new App.Button('Return to Menu','#fff','#000','#f00','#fff',success.gfx,15,56+28*1,512,24,200,000);
	success.alpha = success.goalAlpha = 0;

	success.enterFunc = function(){
		success.requestStaticRenderUpdate = true;
		success.updatingActive = true;
		success.exitFlag = false;

		success.backButton.enter();
		success.returnButton.enter();
		success.goalAlpha = 1;

		App.Shade.turnOn();
		App.Game.requestPause = true;
	}

	success.updateFunc = function(){
		if(!success.requestStaticRenderUpdate)return;
		success.requestStaticRenderUpdate = false;

		success.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		success.gfx.fillStyle = '#fff';
		text(success.gfx,"Success",15,15,36,-3);

		if(success.backButton.render())success.requestStaticRenderUpdate = true;
		if(success.returnButton.render())success.requestStaticRenderUpdate = true;
		if(success.alpha !== success.goalAlpha){
			success.alpha += expInterp(success.alpha,success.goalAlpha,0.003,0.01);
			success.gfx.globalAlpha = success.alpha;
			success.requestStaticRenderUpdate = true;
		}

		if(success.exitFlag && success.requestStaticRenderUpdate === false){
			success.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			success.updatingActive = false;
		}
	}

	success.exitFunc = function(){
		success.requestStaticRenderUpdate = true;
		success.exitFlag = true;

		success.backButton.exit();
		success.returnButton.exit();
		success.goalAlpha = 0;
		App.Shade.turnOff();
		App.Game.setMode(App.Game.modes.PLANNING);
	}

		// ---------------------------------------------

	success.registerMouseMoveFunc(function(x,y){
		if(success.backButton.collide(x,y) && !success.backButton.oldHover)success.requestStaticRenderUpdate = true;
		if(success.backButton.oldHover !== success.backButton.hover)success.requestStaticRenderUpdate = true;

		if(success.returnButton.collide(x,y) && !success.returnButton.oldHover)success.requestStaticRenderUpdate = true;
		if(success.returnButton.oldHover !== success.returnButton.hover)success.requestStaticRenderUpdate = true;
	});

	success.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT,function(x,y){
		if(success.backButton.collide(x,y)){
			App.ModeHandler.popMode(2);
			success.requestStaticRenderUpdate = true;
		}if(success.returnButton.collide(x,y)){
			App.ModeHandler.popMode(3);
			success.requestStaticRenderUpdate = true;
			App.loadDemo();
		}
	});

	success.registerKeyDownFunc('Esc',function(){
		App.ModeHandler.popMode(3);
		success.requestStaticRenderUpdate = true;
		App.loadDemo();
	});
}
