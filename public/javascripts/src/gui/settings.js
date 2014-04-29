App.setupSettings = function(){
	var settings = App.ModeHandler.addNewMode('settings');

		// ---------------------------------------------

	settings.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	settings.gui = new App.guiFrame(settings.gfx);

	settings.backButton = new App.GuiTextButton(15,56+28*0,200,000,'Back to Main Menu',function(){
		settings.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	},false,null,null);

	settings.backButton.hoverColor      = '#ffff00';
	settings.backButton.activeColor     = '#808000';
	settings.backButton.activeTextColor = '#ffff00';

	settings.gui.addComponent(settings.backButton);
	settings.alpha = settings.goalAlpha = 0;

		// ---------------------------------------------

	settings.enterFunc = function(){
		settings.requestStaticRenderUpdate = true;
		settings.updatingActive = true;
		settings.exitFlag = false;
		App.GameRenderer.bestFit();

		settings.gui.enter();
		settings.goalAlpha = 1;

		App.Shade.turnOn();
	}

	settings.updateFunc = function(){
		if(settings.gui.update())
			settings.requestStaticRenderUpdate = true;

		if(!settings.requestStaticRenderUpdate)return;
		settings.requestStaticRenderUpdate = false;

		settings.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		settings.gfx.fillStyle = '#ffffff';
		text(settings.gfx,"Settings",15,15,36,-3);

		if(settings.gui.render())
			settings.requestStaticRenderUpdate = true;

		if(settings.alpha !== settings.goalAlpha){
			settings.alpha += expInterp(settings.alpha,settings.goalAlpha,0.003,0.01);
			settings.gfx.globalAlpha = settings.alpha;
			settings.requestStaticRenderUpdate = true;
		}

		if(settings.exitFlag && settings.requestStaticRenderUpdate === false){
			settings.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			settings.updatingActive = false;
		}
	}

	settings.exitFunc = function(){
		settings.requestStaticRenderUpdate = true;
		settings.exitFlag = true;

		settings.gui.exit();
		settings.goalAlpha = 0;
	}

		// ---------------------------------------------

	settings.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, settings.gui.mouseDown);
	settings.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, settings.gui.mouseUp);

	settings.registerKeyDownFunc('Esc',function(){
		settings.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	});
}
