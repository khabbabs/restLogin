App.setupHelp = function(){
	var help = App.ModeHandler.addNewMode('help');

		// ---------------------------------------------

	help.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	help.gui = new App.guiFrame(help.gfx);
	help.page = 0;

	help.backButton = new App.GuiTextButton(15,56+28*0,200,000,'Back to Main Menu',function(){
		help.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	},false,null,null);

	help.prevButton = new App.GuiTextButton(15, 56+28*1, 200, 000, 'Previous', function(){
		help.page--;
		if(help.page < 0) help.page = 0;
		help.requestStaticRenderUpdate = true;
	}, false, null, null);
	help.prevButton.w = 255;

	help.nextButton = new App.GuiTextButton(15+257, 56+28*1, 200, 000, 'Next', function(){
		help.page++;
		if(help.page >= App.INFO_PAGES.length) help.page = App.INFO_PAGES.length-1;
		help.requestStaticRenderUpdate = true;
	}, false, null, null);
	help.nextButton.w = 255;

	help.backButton.hoverColor      = '#ffff00';
	help.backButton.hoverTextColor  = '#ffffff';
	help.backButton.activeColor     = '#808000';
	help.backButton.activeTextColor = '#ffff00';
	help.gui.addComponent(help.prevButton);
	help.gui.addComponent(help.nextButton);
	help.gui.addComponent(help.backButton);
	help.alpha = help.goalAlpha = 0;

		// ---------------------------------------------

	help.enterFunc = function(){
		help.requestStaticRenderUpdate = true;
		help.updatingActive = true;
		help.exitFlag = false;
		App.GameRenderer.bestFit();

		help.gui.enter();
		help.goalAlpha = 1;

		App.Shade.turnOn();
	}

	help.updateFunc = function(){
		if(help.gui.update())
			help.requestStaticRenderUpdate = true;

		if(!help.requestStaticRenderUpdate)return;
		help.requestStaticRenderUpdate = false;

		help.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		help.gfx.fillStyle = '#ffffff';
		text(help.gfx,"Help",15,15,36,-3);

		App.INFO_PAGES[help.page](help.gfx);

		if(help.gui.render())
			help.requestStaticRenderUpdate = true;

		if(help.alpha !== help.goalAlpha){
			help.alpha += expInterp(help.alpha,help.goalAlpha,0.003,0.01);
			help.gfx.globalAlpha = help.alpha;
			help.requestStaticRenderUpdate = true;
		}

		if(help.exitFlag && help.requestStaticRenderUpdate === false){
			help.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			help.updatingActive = false;
		}
	}

	help.exitFunc = function(){
		help.requestStaticRenderUpdate = true;
		help.exitFlag = true;

		help.gui.exit();
		help.goalAlpha = 0;
	}

		// ---------------------------------------------

	help.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, help.gui.mouseDown);
	help.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, help.gui.mouseUp);

	help.registerKeyDownFunc('Esc',function(){
		help.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	});
}
