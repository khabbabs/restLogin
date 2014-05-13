// TODO: WHY DOES THIS FLASH WHEN ENTERED
// TODO: DISPLAY SCORES
// TODO: NEXT LEVEL

App.setupSuccessGui = function(){
	var success = App.ModeHandler.addNewMode('success');

	success.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	success.gui = new App.guiFrame(success.gfx);

	success.backButton = new App.GuiTextButton(15, 56+28*0, 200, 000, 'Back to Planning', function(){
		App.ModeHandler.popMode(2);
		success.requestStaticRenderUpdate = true;
	}, false, null, null);

	success.returnButton = new App.GuiTextButton(15, 56+28*1, 200, 000, 'Back to Menu', function(){
		App.ModeHandler.popMode(3);
		success.requestStaticRenderUpdate = true;
		App.loadDemo();
	}, false, null, null);

	success.username = new App.GuiTextBox(15, 150, 200, 25, "Name", 100, 100, null, null);
	success.submitButton = new App.GuiTextButton(250, 150, 200, 000, 'Submit Scores', function(){
		App.Server.postScore(App.Game.currentPlanningLevel.id, success.username.txt, success.scores[2], success.scores[1], success.scores[3], success.scores[0], function(){
			App.Server.getScore(App.Game.currentPlanningLevel.id, success.serverCallback);
		} )
	}, false, null, null);
	success.submitButton.w = 200;

	success.scores = [0,0,0,0];

	success.tickLeaderboard = new App.GuiTable(15+260*0, 190, 20, [{id:'name', name:"Name"},{id:'score', name:"Cycles"}]);
	success.tickLeaderboard.emptyMessage = '';
	success.tickLeaderboard.sortAlphabetical = false;
	success.instLeaderboard = new App.GuiTable(15+260*1, 190, 20, [{id:'name', name:"Name"},{id:'score', name:"Instructions"}]);
	success.instLeaderboard.emptyMessage = '';
	success.instLeaderboard.sortAlphabetical = false;
	success.autoLeaderboard = new App.GuiTable(15+260*2, 190, 20, [{id:'name', name:"Name"},{id:'score', name:"Automaton"}]);
	success.autoLeaderboard.emptyMessage = '';
	success.autoLeaderboard.sortAlphabetical = false;
	success.cellLeaderboard = new App.GuiTable(15+260*3, 190, 20, [{id:'name', name:"Name"},{id:'score', name:"Cells"}]);
	success.cellLeaderboard.emptyMessage = '';
	success.cellLeaderboard.sortAlphabetical = false;

	success.gui.addComponent(success.backButton);
	success.gui.addComponent(success.returnButton);
	success.gui.addComponent(success.tickLeaderboard);
	success.gui.addComponent(success.instLeaderboard);
	success.gui.addComponent(success.autoLeaderboard);
	success.gui.addComponent(success.cellLeaderboard);
	success.gui.addComponent(success.submitButton);
	success.gui.addComponent(success.username);
	success.alpha = success.goalAlpha = 0;

	success.serverCallback = function(json){
		console.log(json);
		success.tickLeaderboard.setData(json.tickCount);
		success.instLeaderboard.setData(json.instruCount);
		success.autoLeaderboard.setData(json.autoCount);
		success.cellLeaderboard.setData(json.cellCount);
	}

	success.enterFunc = function(){
		success.requestStaticRenderUpdate = true;
		success.updatingActive = true;
		success.exitFlag = false;

		var cellCount = 0;
		for(var i in App.Game.currentPlanningLevel.grid)
			for(var j in App.Game.currentPlanningLevel.grid[i])
				if(App.Game.currentPlanningLevel.grid[i][j])
					cellCount++;

		success.scores[0] = App.Game.cycle;
		success.scores[1] = App.Game.currentSimulationLevel.instructions.length;
		success.scores[2] = App.Game.currentSimulationLevel.automatons.length;
		success.scores[3] = cellCount;

		//get the scoreboard json
		App.Server.getScore(App.Game.currentPlanningLevel.id, success.serverCallback);

		success.gui.enter();
		success.goalAlpha = 1;

		App.Shade.turnOn();
		App.Game.requestPause = true;
	}

	success.updateFunc = function(){

		if(success.gui.update())
			success.requestStaticRenderUpdate = true;

		if(!success.requestStaticRenderUpdate) return;
		success.requestStaticRenderUpdate = false;

		success.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		success.gfx.fillStyle = '#fff';
		text(success.gfx,"Success",15,15,36,-3);
		text(success.gfx, 'Your Scores: Cycles Elapsed: ' + success.scores[0] + ', Instructions Used: ' + success.scores[1] + ', Automaton Used: ' + success.scores[2] + ', Cells Used: ' + success.scores[3], 15, 125, 15, -1);

		if(success.gui.render())
			success.requestStaticRenderUpdate = true;

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

		success.gui.exit();
		success.goalAlpha = 0;
		App.Shade.turnOff();
		App.Game.setMode(App.Game.modes.PLANNING);
	}

		// ---------------------------------------------

	success.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, success.gui.mouseDown);
	success.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, success.gui.mouseUp);

	success.registerKeyDownFunc('Esc',function(){
		App.ModeHandler.popMode(3);
		success.requestStaticRenderUpdate = true;
		App.loadDemo();
	});
}
