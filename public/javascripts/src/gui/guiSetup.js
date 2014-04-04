App.setupGUI = function(){
	setupPlanningFrame();
	setupSimulationFrame();
	setupMainMenuFrame();
	setupUserLevelSelectFrame();
	setupSettingsFrame();
	setupLevelSelectFrame();
}

var setupLevelSelectFrame = function(){
	var key = App.setup.frames.LEVEL_SELECT;
	App.Gui.addNewFrame(key);

	var blockPanel = App.makeBlockingPanel();
	App.Gui.addNewComponent(key, blockPanel);

	var panel = new App.GuiPanel(new App.GuiCollisionRect(0,50,800,450));
	panel.xAlignment = 'center';
	panel.yAlignment = 'center';

	var menuButton = new App.GuiTextButton(400, 50, 'Main Menu',function(){App.changeMode(App.MODES.MAIN_MENU);	}, false, null);

	App.Gui.addNewComponent(key, panel);
	App.Gui.addNewComponent(key, menuButton);
}

var setupSettingsFrame = function(){
	var key = App.setup.frames.SETTINGS;
	App.Gui.addNewFrame(key);

	var blockPanel = App.makeBlockingPanel();
	App.Gui.addNewComponent(key, blockPanel);

	var panel = new App.GuiPanel(new App.GuiCollisionRect(0,50,800,450));
	panel.xAlignment = 'center';
	panel.yAlignment = 'center';

	var menuButton = new App.GuiTextButton(400, 50, 'Main Menu',function(){App.changeMode(App.MODES.MAIN_MENU);	}, false, null);

	App.Gui.addNewComponent(key, panel);
	App.Gui.addNewComponent(key, menuButton);
}

var setupUserLevelSelectFrame = function(){
	var key = App.setup.frames.USER_LEVEL_SELECT;
	App.Gui.addNewFrame(key);

	var blockPanel = App.makeBlockingPanel();
	App.Gui.addNewComponent(key, blockPanel);
	var panel = new App.GuiPanel(new App.GuiCollisionRect(0,50,800,450));
	panel.xAlignment = 'center';
	panel.yAlignment = 'center';

	var table = new App.GuiTable(25,25, panel);
	var confirmButton = new App.GuiTextButton(525, 25, 'Load Level', function(){
		if(table.table[table.activeRow]){

			if(App.Game.loadNewLevel(table.table[table.activeRow].json['level_str'])){
				App.changeMode(App.MODES.PLANNING);
			}
			else{
				//TODO error dialog box
			}
		}

		else
			console.log('select a level first!');
	}, false, panel);

	var callback = function(data){
		table.setData(data);
	}

	var typeEntry = new App.GuiEditableTextBox(new App.GuiCollisionRect(675, 25, 100, 30), 'user', panel);
	var subtypeEntry = new App.GuiEditableTextBox(new App.GuiCollisionRect(675, 75, 100, 30), 'khabbabs', panel);
	var submitButton = new App.GuiTextButton(675, 125, 'Get Levels', function(){
		App.Server.getLevels(typeEntry.text, subtypeEntry.text, callback);
	}, false, panel)

	var menuButton = new App.GuiTextButton(400, 50, 'Main Menu',function(){App.changeMode(App.MODES.MAIN_MENU);	}, false, null);

	App.Gui.addNewComponent(key, panel);
	App.Gui.addNewComponent(key, menuButton);
	App.Gui.addNewComponent(key, confirmButton);
	App.Gui.addNewComponent(key, table);
	App.Gui.addNewComponent(key, typeEntry);
	App.Gui.addNewComponent(key, subtypeEntry);
	App.Gui.addNewComponent(key, submitButton);


	App.Server.getLevels('user', 'khabbabs', callback);

}


var setupMainMenuFrame = function(){
	var key = App.setup.frames.MAIN_MENU;
	App.Gui.addNewFrame(key);

	var blockPanel = App.makeBlockingPanel();
	var panel = new App.GuiPanel(new App.GuiCollisionRect(0,0,200,2100));
	var p2 = new App.GuiPanel(new App.GuiCollisionRect(0,0,200,100));
	p2.color = 'rgba(0,0,0,0)';
	panel.yAlignment = 'center';
	panel.xAlignment = 'left';
	p2.yAlignment = 'bottom';

	var notyet = [];
	notyet[0] = App.makeBlockingPanel();
	notyet[1] = new App.GuiPanel(new App.GuiCollisionRect(0,0,150,150));
	notyet[1].xAlignment = 'center';
	notyet[1].yAlignment = 'center';
	notyet[1].updatePosition();
	notyet[2] = new App.GuiTextButton(25,100,'OK', function(){
		setTimeout(function(){App.Gui.endOverlay();});
	}, false, notyet[1]);
	notyet[3] = new App.GuiTextWidget(['Coming Soon!'], 0,'16px Futurastd', 5, 25, notyet[1]);

	var fun = function(){
	 console.log('not yet!');
	 App.Gui.startOverlay(notyet);
	}

	var playBut = new App.GuiTextButton(100, 1000, 'Play', function(){App.changeMode(App.MODES.PLANNING);}, false, panel);
	var levelBut = new App.GuiTextButton(100, 1040, 'Level Select',function(){App.changeMode(App.MODES.SETTINGS);}, false, panel);
	var userBut = new App.GuiTextButton(100, 1080, 'User Levels', function(){App.changeMode(App.MODES.USER_LEVEL_SELECT);}, false, panel);
	var editBut = new App.GuiTextButton(100, 1120, 'Sandbox Mode',fun, false, panel);
	var settingsBut = new App.GuiTextButton(100, 1160, 'Settings',function(){App.changeMode(App.MODES.SETTINGS);}, false, panel);

	var text = new App.GuiTextWidget(['Automaton'], 0,'32px Futurastd', 5, 800, panel);
	var creds = new App.GuiTextWidget(['Luke Balaoro','Khabbab Saleem','Kevin Dilts','Cameron Smith','Ezra Stallings'], 20, '10px Futurastd', 5, 0, p2);



	blockPanel.color = 'rgba(180, 180, 180, 0)';

	App.Gui.addNewComponent(key, blockPanel);
	App.Gui.addNewComponent(key, panel);
	App.Gui.addNewComponent(key, playBut);
	App.Gui.addNewComponent(key, levelBut);
	App.Gui.addNewComponent(key, userBut);
	App.Gui.addNewComponent(key, editBut);
	App.Gui.addNewComponent(key, settingsBut);
	App.Gui.addNewComponent(key, text);
	App.Gui.addNewComponent(key, creds);
	App.Gui.addNewComponent(key, p2);


}

var setupSimulationFrame = function(){


	var key = App.setup.frames.SIMULATION;
	App.Gui.addNewFrame(key);

	var controlsPanel = new App.GuiPanel(new App.GuiCollisionRect(0,0,200,500));
	controlsPanel.yAlignment = 'bottom';

	var joystick = new App.GuiJoystick(50, 50, controlsPanel);
	var zoomInButton = new App.GuiTextButton(0, 200, 'Zoom In', function(){App.Game.zoom(App.Canvases.halfWidth, App.Canvases.halfHeight,1);}, false, controlsPanel);
	var zoomOutButton = new App.GuiTextButton(0, 250, 'Zoom Out', function(){App.Game.zoom(App.Canvases.halfWidth, App.Canvases.halfHeight,-1);}, false, controlsPanel);
	var simButton = new App.GuiTextButton(400, 50, 'Return',function(){ App.changeMode(App.MODES.PLANNING);	}, false, null);
	var pauseButton = new App.GuiTextButton(0, 325, 'Pause',function(){ App.Game.pause();}, false, controlsPanel);
	var speedSliderButton = new App.GuiSliderButton(new App.GuiCollisionRect(150,10,50,25), controlsPanel);

	var min = 0;
	var max = 7;
	var diff = 3;
	var speedSliderLine = new App.GuiSliderLine(new App.GuiCollisionRect(150,10,10, 400), min, max, 2, function(n){
		var k = 0 - n + max;
		App.Game.setSimulationSpeed(Math.pow(2,k+diff));
	}, controlsPanel);
	speedSliderButton.sliderLine = speedSliderLine;
	speedSliderLine.sliderButton = speedSliderButton;



	App.Gui.addNewComponent(key, controlsPanel);
	App.Gui.addNewComponent(key, simButton);
	App.Gui.addNewComponent(key, pauseButton);
	App.Gui.addNewComponent(key, joystick);
	App.Gui.addNewComponent(key, zoomInButton);
	App.Gui.addNewComponent(key, zoomOutButton);
	App.Gui.addNewComponent(key, speedSliderLine);
	App.Gui.addNewComponent(key, speedSliderButton);

	//Setup key bindings
	App.InputHandler.registerKey('[', App.MODES.SIMULATION, function(){App.Game.setSimulationSpeed(App.Game.simulationSpeed*2);});
	App.InputHandler.registerKey(']', App.MODES.SIMULATION,function(){App.Game.setSimulationSpeed(App.Game.simulationSpeed/2);});
	App.InputHandler.registerKey('Space', App.MODES.SIMULATION,function(){App.Game.pause();});
	App.InputHandler.registerKey('`', App.MODES.SIMULATION,function(){ App.changeMode(App.MODES.PLANNING);});
	App.InputHandler.registerKey('Esc', App.MODES.SIMULATION, function(){App.changeMode(App.MODES.PLANNING);});
}

var setupPlanningFrame = function(){
	var key = App.setup.frames.PLANNING;

	App.Gui.addNewFrame(key);
	var instructionPanel = new App.GuiPanel(new App.GuiCollisionRect(0,0,100,600));
	instructionPanel.xAlignment = 'right';
	var controlsPanel = new App.GuiPanel(new App.GuiCollisionRect(0,100,100,500));

	var redButton 		= new App.GuiTextButton(0,300,'Red',		function(){	App.GuiDragButton.changeGlobalColor(0)	}, false, instructionPanel);
	var greenButton 	= new App.GuiTextButton(0,330,'Green',	function(){	App.GuiDragButton.changeGlobalColor(1)	}, false, instructionPanel);
	var blueButton 		= new App.GuiTextButton(0,360,'Blue',		function(){	App.GuiDragButton.changeGlobalColor(2)	}, false, instructionPanel);
	var yellowButton	= new App.GuiTextButton(0,390,'Yellow',	function(){	App.GuiDragButton.changeGlobalColor(3)	}, false, instructionPanel);

	App.Gui.addNewComponent(key, instructionPanel);
	App.Gui.addNewComponent(key, controlsPanel);
	App.Gui.addNewComponent(key, redButton);
	App.Gui.addNewComponent(key, greenButton);
	App.Gui.addNewComponent(key, blueButton);
	App.Gui.addNewComponent(key, yellowButton);


	for(var i=0; i < 8; i++){
		App.Gui.addNewComponent(key, new App.GuiDragButton(0 , 31 * i, null, i, 			instructionPanel));
		App.Gui.addNewComponent(key, new App.GuiDragButton(31, 31 * i, null, i + 8, 	instructionPanel));
		App.Gui.addNewComponent(key, new App.GuiDragButton(62, 31 * i, null, i + 16, instructionPanel));

	}
	var joystick = new App.GuiJoystick(50, 50, controlsPanel);
	App.Gui.addNewComponent(key, joystick);

	var zoomInButton = new App.GuiTextButton(0, 200, 'Zoom In', function(){App.Game.zoom(App.Canvases.halfWidth, App.Canvases.halfHeight,1);}, false, controlsPanel);
	var zoomOutButton = new App.GuiTextButton(0, 250, 'Zoom Out', function(){App.Game.zoom(App.Canvases.halfWidth, App.Canvases.halfHeight,-1);}, false, controlsPanel);

	App.Gui.addNewComponent(key, zoomInButton);
	App.Gui.addNewComponent(key, zoomOutButton);

	var simButton = new App.GuiTextButton(400, 50, 'Simulate',function(){App.changeMode(App.MODES.SIMULATION);	}, false, null);
	App.Gui.addNewComponent(key, simButton);

	var menuButton = new App.GuiTextButton(525, 50, 'Menu',function(){App.changeMode(App.MODES.MAIN_MENU);	}, false, null);
	App.Gui.addNewComponent(key, menuButton);

	var submitDialog = [];
	submitDialog[0] = App.makeBlockingPanel();
	submitDialog[1] = new App.GuiPanel(new App.GuiCollisionRect(0,0,150,500));
	submitDialog[1].xAlignment = 'center';
	submitDialog[1].yAlignment = 'center';
	submitDialog[1].updatePosition();
	submitDialog[2] = new App.GuiTextButton(25,430,'Cancel', function(){
		setTimeout(function(){App.Gui.endOverlay();});
		submitDialog[3].resetText();
		submitDialog[4].resetText();
		submitDialog[5].resetText();
		submitDialog[6].resetText();
		submitDialog[7].resetText();
	}, false, submitDialog[1]);

	submitDialog[3] = new App.GuiEditableTextBox(new App.GuiCollisionRect(25,270,100,30), 'Username', submitDialog[1]);
	submitDialog[4] = new App.GuiEditableTextBox(new App.GuiCollisionRect(25,300,100,30), 'Password', submitDialog[1]);

	submitDialog[5] = new App.GuiEditableTextBox(new App.GuiCollisionRect(25,100,100,30), 'Level Name', submitDialog[1]);
	submitDialog[6] = new App.GuiEditableTextBox(new App.GuiCollisionRect(25,200,100,30), 'Level Description', submitDialog[1]);
	submitDialog[7] = new App.GuiEditableTextBox(new App.GuiCollisionRect(25,150,100,30), 'Difficulty', submitDialog[1]);

	submitDialog[5].next = submitDialog[7];
	submitDialog[7].next = submitDialog[6];
	submitDialog[6].next = submitDialog[3];
	submitDialog[3].next = submitDialog[4];
	submitDialog[4].password = true;

	submitDialog[8] = new App.GuiTextButton(25,400,'Submit', function(){
		App.Server.putLevel(App.Game.currentPlanningLevel.generateParseString(),
											submitDialog[3].text,
											submitDialog[4].text,
											submitDialog[7].text,
											submitDialog[5].text,
											submitDialog[6].text,
											App.Server.testPostCallback);

		submitDialog[3].resetText();
		submitDialog[4].resetText();
		submitDialog[5].resetText();
		submitDialog[6].resetText();
		submitDialog[7].resetText();

		App.Gui.endOverlay();
	}, false, submitDialog[1]);

	var submitButton = new App.GuiTextButton(650, 50, 'Submit Level', function(){
		App.Gui.startOverlay(submitDialog);
	}, false, null);
	App.Gui.addNewComponent(key, submitButton);

	//Setup Key Bindings
	App.InputHandler.registerKey('M', App.MODES.PLANNING,function(){ App.Game.currentPlanningLevel.mkey(); });
	App.InputHandler.registerKey('C', App.MODES.PLANNING,function(){ App.Game.currentPlanningLevel.ckey(); });
	App.InputHandler.registerKey('D', App.MODES.PLANNING,function(){ App.Game.currentPlanningLevel.dkey(); });
	App.InputHandler.registerKey('`', App.MODES.PLANNING,function(){ App.changeMode(App.MODES.SIMULATION);});
	App.InputHandler.registerKey('Z', App.MODES.PLANNING, function(){
			if(App.InputHandler.keysDown['Ctrl']) {
				if(App.InputHandler.keysDown['Shift']){
					App.Game.currentPlanningLevel.redo();
				}
				else
					App.Game.currentPlanningLevel.undo();
			}
	});
	App.InputHandler.registerKey('Esc', App.MODES.PLANNING, function(){App.Gui.endOverlay();});

}