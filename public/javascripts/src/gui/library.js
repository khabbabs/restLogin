App.setupLibrary = function(){
	var library = App.ModeHandler.addNewMode('library');

		// ---------------------------------------------

	library.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	library.gui = new App.guiFrame(library.gfx);

	library.backButton = new App.GuiTextButton(15,56+28*0,200,000,'Back to Main Menu',function(){
		library.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	},false,null,null);

	library.backButton.hoverColor       = '#00ff00';
	library.backButton.activeColor      = '#008000';
	library.backButton.activeTextColor  = '#00ff00';

	var go = function(){
		var type = library.typeButton.txt;
		var query;
		if(type === 'User') {
			type = 'user';
			query = library.queryBox.txt;
		}
		else {
			type = 'diff';
			query = library.diffButton.txt;
		}
		library.table.loading = true;
		App.Server.getLevels(type, query, library.table.setData);
	}

	var loadLevel = function(){
		var e = library.table.getSelectedEntry();
		if(e == null)
			return;
		App.Game.currentPlanningLevel = App.Game.parseLevel(e.level_str);
		App.GameRenderer.bestFit();
		App.ModeHandler.pushMode('planning');
		library.requestStaticRenderUpdate = true;
	}

	library.queryBox = new App.GuiTextBox(15+128+10, 56+28*2, 300, 25, "Enter search term here", 100, 100, null, null);
	library.queryBox.submitFunc = go;

	library.diffButton = new App.GuiTextButton(15+128+10, 56+28*2,200, 200, 'Easy', function(){
		if(library.diffButton.txt === 'Easy')
			library.diffButton.txt = 'Medium';
		else if(library.diffButton.txt === 'Medium')
			library.diffButton.txt = 'Hard';
		else if(library.diffButton.txt === 'Hard')
			library.diffButton.txt = 'Easy';
	});

	library.diffButton.hoverColor       = '#00ff00';
	library.diffButton.activeColor      = '#008000';
	library.diffButton.activeTextColor  = '#00ff00';
	library.diffButton.w = 300;
	library.diffButton.dointerp = false;

	library.typeButton = new App.GuiTextButton(15, 56+28*2, 200, 000, 'User', function(){
		if(library.typeButton.txt === 'User'){
			library.typeButton.txt = 'Difficulty';
			library.gui.removeComponent(library.queryBox);
			library.gui.addComponent(library.diffButton);
		}
		else{
			library.typeButton.txt = 'User';
			library.gui.removeComponent(library.diffButton);
			library.gui.addComponent(library.queryBox);
		}
	}, false, null, null);

	library.typeButton.hoverColor       = '#00ff00';
	library.typeButton.activeColor      = '#008000';
	library.typeButton.activeTextColor  = '#00ff00';
	library.typeButton.w = 128;

	library.goButton = new App.GuiTextButton(15 + 128 + 20 + 300, 56+28*2, 200, 000, 'Search!', go, false, null, null);

	library.goButton.hoverColor       = '#00ff00';
	library.goButton.activeColor      = '#008000';
	library.goButton.activeTextColor  = '#00ff00';
	library.goButton.w = 128;

	library.table = new App.GuiTable(15, 150, 20, [{id:'title', name:"Title"},{id:'description', name:"Description"},{id:'difficulty', name:"Difficulty"},{id:'author_id', name:"Author"},{id:'created', name:"Created"}]);

	library.loadButton = new App.GuiTextButton(library.table.w + 30, 152, 200, 000, 'Load Level', loadLevel, false, null, null);

	library.loadButton.hoverColor       = '#00ff00';
	library.loadButton.activeColor      = '#008000';
	library.loadButton.activeTextColor  = '#00ff00';
	library.loadButton.w = 128;

	library.gui.addComponent(library.table);
	library.gui.addComponent(library.typeButton);
	library.gui.addComponent(library.loadButton);
	library.gui.addComponent(library.queryBox);
	library.gui.addComponent(library.backButton);
	library.gui.addComponent(library.goButton);
	library.alpha = library.goalAlpha = 0;

		// ---------------------------------------------

	library.enterFunc = function(){
		library.requestStaticRenderUpdate = true;
		library.updatingActive = true;
		library.exitFlag = false;
		App.GameRenderer.bestFit();

		library.gui.enter();
		library.goalAlpha = 1;

		App.Shade.turnOn();
	}

	library.updateFunc = function(){
		if(library.gui.update())
			library.requestStaticRenderUpdate = true;

		if(!library.requestStaticRenderUpdate)return;
		library.requestStaticRenderUpdate = false;

		library.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		library.gfx.fillStyle = '#fff';
		text(library.gfx,"Library",15,15,36,-3);

		if(library.gui.render())
			library.requestStaticRenderUpdate = true;

		if(library.alpha !== library.goalAlpha){
			library.alpha += expInterp(library.alpha,library.goalAlpha,0.003,0.01);
			library.gfx.globalAlpha = library.alpha;
			library.requestStaticRenderUpdate = true;
		}

		if(library.exitFlag && library.requestStaticRenderUpdate === false){
			library.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			library.updatingActive = false;
		}
	}

	library.exitFunc = function(){
		library.requestStaticRenderUpdate = true;
		library.exitFlag = true;

		library.gui.exit();
		library.goalAlpha = 0;
	}

		// ---------------------------------------------

	library.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, library.gui.mouseDown);
	library.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, library.gui.mouseUp);

	library.registerKeyDownFunc('Esc',function(){
		library.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	});

	library.registerKeyDownFunc('Enter', function(){if(!library.table.json) go(); else loadLevel();} );
}
