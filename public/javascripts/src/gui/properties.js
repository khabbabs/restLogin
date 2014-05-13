App.setupPropertiesGui = function(){
	properties = App.ModeHandler.addNewMode('properties');

	var returnFunc = function(){
		var w = parseInt(properties.widthBox.txt);
		var h = parseInt(properties.heightBox.txt);
		if(!isNaN(w) && !isNaN(h)){
			if(w >= App.Game.currentPlanningLevel.width || App.Game.currentPlanningLevel.pristine)
				App.Game.currentPlanningLevel.width = w;
			if(h >= App.Game.currentPlanningLevel.height || App.Game.currentPlanningLevel.pristine)
				App.Game.currentPlanningLevel.height = h;
		}
		properties.requestStaticRenderUpdate = true;
		App.GameRenderer.requestStaticRenderUpdate = true;
		App.GameRenderer.bestFit();
		App.ModeHandler.popMode();
	}


	properties.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	properties.gui = new App.guiFrame(properties.gfx);

	properties.applyButton = new App.GuiTextButton(15, 56, 0, 0, 'Apply', returnFunc, false, null, null);
	properties.widthBox = new App.GuiTextBox(15,56+28*2, 255, 24, '10', 0, 0, null, null);
	properties.heightBox = new App.GuiTextBox(15+257,56+28*2, 255, 24, '10', 0, 0, null, null);

	properties.gui.addComponent(properties.applyButton);
	properties.gui.addComponent(properties.widthBox);
	properties.gui.addComponent(properties.heightBox);

	properties.alpha = properties.goalAlpha = 0;

	properties.enterFunc = function(){
		properties.requestStaticRenderUpdate = true;
		properties.updatingActive = true;
		properties.exitFlag = false;
		properties.gui.enter();
		properties.goalAlpha = 1;

		App.Shade.turnOn();
	}

	properties.updateFunc = function(){
		properties.timeout --;
		if(properties.gui.update())
			properties.requestStaticRenderUpdate = true;

		if(!properties.requestStaticRenderUpdate)return;
		properties.requestStaticRenderUpdate = false;

		properties.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		properties.gfx.fillStyle = '#fff';
		text(properties.gfx,"Level Dimensions",15,15,36,-3);
		text(properties.gfx,"WIDTH",15,58+28*1,20,-3);
		text(properties.gfx,"HEIGHT",15+257,58+28*1,20,-3);

		if(properties.gui.render())
			properties.requestStaticRenderUpdate = true;

		if(properties.alpha !== properties.goalAlpha){
			properties.alpha += expInterp(properties.alpha,properties.goalAlpha,0.003,0.01);
			properties.gfx.globalAlpha = properties.alpha;
			properties.requestStaticRenderUpdate = true;
		}

		if(properties.exitFlag && properties.requestStaticRenderUpdate === false){
			properties.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			properties.updatingActive = false;
		}
	}

	properties.exitFunc = function(){
		properties.requestStaticRenderUpdate = true;
		properties.exitFlag = true;

		properties.gui.exit();
		properties.goalAlpha = 0;
	}

	properties.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, properties.gui.mouseDown);
	properties.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, properties.gui.mouseUp);

	properties.registerResizeFunc(function(){
		App.GameRenderer.bestFit();
	});
}