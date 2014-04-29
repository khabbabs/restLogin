App.setupConfirm = function(){
	var confirm = App.ModeHandler.addNewMode('confirm');

		// ---------------------------------------------

	confirm.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	confirm.gui = new App.guiFrame(confirm.gfx);
	confirm.alpha = confirm.goalAlpha = 0;

	// MUST OVERWRITE THE BELOW 3 WHEN YOU PUSH THIS MODE
	confirm.title = "Confirm";
	confirm.yes = function(){}

	confirm.yesBtn = new App.GuiTextButton(15,56+28*0,200,000,'Yes',function(){confirm.requestStaticRenderUpdate = true;App.ModeHandler.popMode();App.Shade.turnOff();confirm.yes();},false,null,null);
	confirm.noBtn  = new App.GuiTextButton(15,56+28*1,200,000,'No' ,function(){confirm.requestStaticRenderUpdate = true;App.ModeHandler.popMode();App.Shade.turnOff();},false,null,null);

	confirm.yesBtn.hoverColor      = confirm.noBtn.hoverColor      = '#ff0000';
	confirm.yesBtn.activeColor     = confirm.noBtn.activeColor     = '#800000';
	confirm.yesBtn.activeTextColor = confirm.noBtn.activeTextColor = '#ff0000';

	confirm.gui.addComponent(confirm.yesBtn);
	confirm.gui.addComponent(confirm.noBtn);

		// ---------------------------------------------

	confirm.enterFunc = function(){
		confirm.requestStaticRenderUpdate = true;
		confirm.updatingActive = true;
		confirm.exitFlag = false;

		confirm.gui.enter();
		confirm.goalAlpha = 1;

		App.Shade.turnOn();
	}

	confirm.updateFunc = function(){
		if(confirm.gui.update())
			confirm.requestStaticRenderUpdate = true;

		if(!confirm.requestStaticRenderUpdate)return;
		confirm.requestStaticRenderUpdate = false;

		confirm.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		confirm.gfx.fillStyle = '#ffffff';
		text(confirm.gfx,confirm.title,15,15,36,-3);

		if(confirm.gui.render())
			confirm.requestStaticRenderUpdate = true;

		if(confirm.alpha !== confirm.goalAlpha){
			confirm.alpha += expInterp(confirm.alpha,confirm.goalAlpha,0.003,0.01);
			confirm.gfx.globalAlpha = confirm.alpha;
			confirm.requestStaticRenderUpdate = true;
		}

		if(confirm.exitFlag && confirm.requestStaticRenderUpdate === false){
			confirm.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			confirm.updatingActive = false;
		}
	}

	confirm.exitFunc = function(){
		confirm.requestStaticRenderUpdate = true;
		confirm.exitFlag = true;

		confirm.gui.exit();
		confirm.goalAlpha = 0;
	}

		// ---------------------------------------------

	confirm.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, confirm.gui.mouseDown);
	confirm.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, confirm.gui.mouseUp);

	confirm.registerKeyDownFunc('Esc',function(){
		confirm.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
		App.Shade.turnOff();
	});

	return confirm;
}
