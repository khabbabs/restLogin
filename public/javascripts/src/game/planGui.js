App.setupPlanGui = function(){
	var planMode = App.ModeHandler.addNewMode('planning');

//============================================================================//

	planMode.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	planMode.direction = App.DIRECTIONS.UP;
	planMode.color = App.COLORS.RED;
	planMode.selectStart = undefined;
	planMode.moveStart = undefined;
	planMode.alpha = planMode.goalAlpha = 0;
	planMode.gui = new App.guiFrame(planMode.gfx);
	planMode.isSandbox = false;

	var setRed    = function(){console.log('red'); planMode.activeToggle[1].toggled = planMode.activeToggle[2].toggled = planMode.activeToggle[3].toggled = false; planMode.activeToggle[0].toggled = true; App.GuiInstDrag.changeGlobalColor(0); planMode.color = App.COLORS.RED;    planMode.requestStaticRenderUpdate = true};
	var setGreen  = function(){planMode.activeToggle[0].toggled = planMode.activeToggle[2].toggled = planMode.activeToggle[3].toggled = false; planMode.activeToggle[1].toggled = true; App.GuiInstDrag.changeGlobalColor(1); planMode.color = App.COLORS.GREEN;  planMode.requestStaticRenderUpdate = true};
	var setBlue   = function(){planMode.activeToggle[0].toggled = planMode.activeToggle[1].toggled = planMode.activeToggle[3].toggled = false; planMode.activeToggle[2].toggled = true; App.GuiInstDrag.changeGlobalColor(2); planMode.color = App.COLORS.BLUE;   planMode.requestStaticRenderUpdate = true};
	var setYellow = function(){planMode.activeToggle[0].toggled = planMode.activeToggle[1].toggled = planMode.activeToggle[2].toggled = false; planMode.activeToggle[3].toggled = true; App.GuiInstDrag.changeGlobalColor(3); planMode.color = App.COLORS.YELLOW; planMode.requestStaticRenderUpdate = true};

	var returnToMenu = function(){
		App.confirmGui.title = "Return To Menu Without Saving?";
		App.confirmGui.yes = function(){
			App.ModeHandler.popMode();
			App.loadDemo();
		};App.ModeHandler.pushMode('confirm');
	}

	var addDragBtn = function(x,y,type,dirSense,tooltip,hotkey,data){
		planMode.gui.addComponent(new App.GuiInstDrag(x,y,0,type,dirSense,'center','bottom',planMode.gui,tooltip,hotkey,data));
	}

	var addBtn = function(x,y,size,color,toggle,tooltip,callback,glyph,continuous){
		var btn = new App.GuiToolbarButton(x,y,size,0,color,'center','bottom',toggle,tooltip,callback,glyph);
		btn.continuous = continuous || false;
		planMode.gui.addComponent(btn);
		return btn;
	}

//============================================================================//

	planMode.instPanel = new App.GuiTools.Component(0,-54,794,98,0,0,'center','bottom');
	planMode.instPanel.render = function(gfx){
		gfx.fillStyle = 'rgba(0,0,0,0.8)';
		gfx.fillRect(planMode.instPanel.getx(), planMode.instPanel.gety(), planMode.instPanel.w, planMode.instPanel.h);
	};planMode.gui.addComponent(planMode.instPanel);



	addDragBtn(-164,-73-5, 0,true ,'[ Q ] Spawn Automaton','Q');
	addDragBtn(-116,-73-5, 4,false,'[ W ] Change Direction Up','W');
	addDragBtn( -68,-73-5,12,false,'[ E ] Grab/Drop Token','E');
	addDragBtn( -20,-73-5,27,true ,'[ R ] Positive Switch','R');
	addDragBtn(  28,-73-5,31,true ,'[ T ] Flip-Flop','T');
	addDragBtn(  76,-73-5,16,false,'[ Y ] Sync','Y');
	addDragBtn( 124,-73-5,13,false,'[ U ] Add','U');
	addDragBtn( 172,-73-5,15,false,'[ I ] Set Value','I');
	addDragBtn( 220,-73-5, 8,false,'[ O ] Input Stream','','I');
	addDragBtn(-164,-25-5, 7,false,'[ A ] Change Direction Left','A');
	addDragBtn(-116,-25-5, 6,false,'[ S ] Change Direction Down','S');
	addDragBtn( -68,-25-5, 5,false,'[ D ] Change Direction Right','D');
	addDragBtn( -20,-25-5,23,true ,'[ F ] Equality Switch','F');
	addDragBtn(  28,-25-5,19,true ,'[ G ] Token Switch','G');
	addDragBtn(  76,-25-5,17,false,'[ H ] Toggle Color','H');
	addDragBtn( 124,-25-5,14,false,'[ J ] Subtract','J');
	addDragBtn( 172,-25-5,18,false,'[ K ] Pause','K');
	addDragBtn( 220,-25-5, 9,false,'[ L ] Output Stream','','O');

	var panSpeed = 0.25;
	addBtn(-348, -81-5, 30,'#808080',false,'Nav Up',    function(){App.GameRenderer.goalRenderY += App.Engine.elapsed*panSpeed; App.GameRenderer.constrain(); App.GameRenderer.requestStaticRenderUpdate = true;}, null, true);
	addBtn(-380, -49-5, 30,'#808080',false,'Nav Left',  function(){App.GameRenderer.goalRenderX += App.Engine.elapsed*panSpeed; App.GameRenderer.constrain(); App.GameRenderer.requestStaticRenderUpdate = true;}, null, true);
	addBtn(-348, -49-5, 30,'#808080',false,'Nav Reset', function(){App.GameRenderer.bestFit();}, null, false);
	addBtn(-316, -49-5, 30,'#808080',false,'Nav Right', function(){App.GameRenderer.goalRenderX -= App.Engine.elapsed*panSpeed; App.GameRenderer.constrain(); App.GameRenderer.requestStaticRenderUpdate = true;}, null, true);
	addBtn(-380, -17-5, 30,'#808080',false,'Zoom In',   function(){console.log('zoom in'); App.GameRenderer.zoom(App.Canvases.width/2, App.Canvases.height/2, 1); }, null, false);
	addBtn(-348, -17-5, 30,'#808080',false,'Nav Down',  function(){App.GameRenderer.goalRenderY -= App.Engine.elapsed*panSpeed; App.GameRenderer.constrain(); App.GameRenderer.requestStaticRenderUpdate = true;}, null, true);
	addBtn(-316, -17-5, 30,'#808080',false,'Zoom Out',  function(){App.GameRenderer.zoom(App.Canvases.width/2, App.Canvases.height/2, -1)}, null, false);

	addBtn(-284,-81-5,30,'#808080',false,'Low Speed', function(){
		App.Game.setSimulationSpeed(512);
		console.log(App.ModeHandler.currentMode.name === 'planning');
		if(App.ModeHandler.currentMode.name === 'planning'){
			App.ModeHandler.pushMode('simulation');
			App.ModeHandler.modes['simulation'].renderStreams = true;
		}
	},App.LowSpeedGlyph);

	addBtn(-252,-81-5,30,'#808080',false,'Med Speed', function(){
		App.Game.setSimulationSpeed(128);
		console.log(App.ModeHandler.currentMode.name === 'planning');
		if(App.ModeHandler.currentMode.name === 'planning'){
			App.ModeHandler.pushMode('simulation');
			App.ModeHandler.modes['simulation'].renderStreams = true;
		}
	},App.MedSpeedGlyph);

	addBtn(-284,-49-5,30,'#808080',false,'Hi Speed',  function(){
		App.Game.setSimulationSpeed(32);
		console.log(App.ModeHandler.currentMode.name === 'planning');
		if(App.ModeHandler.currentMode.name === 'planning'){
			App.ModeHandler.pushMode('simulation');
			App.ModeHandler.modes['simulation'].renderStreams = true;
		}
	},App.HiSpeedGlyph);

	addBtn(-252,-49-5,30,'#808080',false,'MAX Speed', function(){
		App.Game.setSimulationSpeed(1);
		console.log(App.ModeHandler.currentMode.name === 'planning');
		if(App.ModeHandler.currentMode.name === 'planning'){
			App.ModeHandler.pushMode('simulation');

			App.ModeHandler.modes['simulation'].renderStreams = true;
		}
	},App.MaxSpeedGlyph);
	addBtn(-284,-17-5,30,'#808080',false,'Stop',      function(){
		console.log(App.ModeHandler.currentMode.name === 'simulation');
		if(App.ModeHandler.currentMode.name === 'simulation'){
			App.ModeHandler.popMode();
		}
	},App.StopGlyph);

	addBtn(-252,-17-5,30,'#808080',false,'[Space] Pause',     function(){
		App.Game.pause();
		if(App.ModeHandler.currentMode.name === 'planning'){
			App.ModeHandler.pushMode('simulation');
			App.ModeHandler.modes['simulation'].renderStreams = true;
		}

	},App.PauseGlyph);

	addBtn(-212,-73-5,46,'#808080',false,'[Ctrl+Z] Undo',function(){App.Game.currentPlanningLevel.undo()},App.UndoGlyph);
	addBtn(-212,-25-5,46,'#808080',false,'[Ctrl+Shift+Z] Redo',function(){App.Game.currentPlanningLevel.redo()},App.RedoGlyph);

	planMode.activeToggle = [];
	planMode.activeToggle[0] = addBtn(260,-81-5,30,0,false,'[1] Red Active',    setRed);
	planMode.activeToggle[1] = addBtn(292,-81-5,30,1,false,'[2] Green Active',  setGreen);
	planMode.activeToggle[2] = addBtn(324,-81-5,30,2,false,'[3] Blue Active',   setBlue);
	planMode.activeToggle[3] = addBtn(356,-81-5,30,3,false,'[4] Yellow Active', setYellow);

	planMode.lockedToggle = [];
	planMode.lockedToggle[0] = addBtn(260,-49-5,30,0,true,'Red Locked',    function(){App.Game.currentPlanningLevel.toggleLock(0)});
	planMode.lockedToggle[1] = addBtn(292,-49-5,30,1,true,'Green Locked',  function(){App.Game.currentPlanningLevel.toggleLock(1)});
	planMode.lockedToggle[2] = addBtn(324,-49-5,30,2,true,'Blue Locked',   function(){App.Game.currentPlanningLevel.toggleLock(2)});
	planMode.lockedToggle[3] = addBtn(356,-49-5,30,3,true,'Yellow Locked', function(){App.Game.currentPlanningLevel.toggleLock(3)});

	planMode.visibleToggle = [];
	planMode.visibleToggle[0] = addBtn(260,-17-5,30,0,true,'Red Visible',    function(){App.Game.toggleVisible(0)}).toggled = true; // TODO: move the toggled = true somewhere else
	planMode.visibleToggle[1] = addBtn(292,-17-5,30,1,true,'Green Visible',  function(){App.Game.toggleVisible(1)}).toggled = true; // TODO: move the toggled = true somewhere else
	planMode.visibleToggle[2] = addBtn(324,-17-5,30,2,true,'Blue Visible',   function(){App.Game.toggleVisible(2)}).toggled = true; // TODO: move the toggled = true somewhere else
	planMode.visibleToggle[3] = addBtn(356,-17-5,30,3,true,'Yellow Visible', function(){App.Game.toggleVisible(3)}).toggled = true; // TODO: move the toggled = true somewhere else

	planMode.newBut = addBtn(384,-85-5,22,'#808080',false,'New',function(){
		App.confirmGui.title = "Create A New Level?";
		App.confirmGui.yes = function(){
			App.Game.currentPlanningLevel = App.Game.parseLevel("empty`0`10`10");
			App.GameRenderer.bestFit();
		};App.ModeHandler.pushMode('confirm');
	},App.NewGlyph);

	planMode.uploadBut = addBtn(384,-61-5,22,'#808080',false,'Upload', function(){
		App.ModeHandler.pushMode('submit level');
		planMode.requestStaticRenderUpdate = true;
	},App.SaveGlyph);
	planMode.propBut = addBtn(384,-37-5,22,'#808080',false,'Properties',function(){
		App.ModeHandler.pushMode('properties');
	},App.PropertiesGlyph);
	addBtn(384,-13-5,22,'#808080',false,'[Esc] Return',returnToMenu,App.BackGlyph);

//============================================================================//

	planMode.enterFunc = function(){
		planMode.requestStaticRenderUpdate = true;
		planMode.updatingActive = true;
		planMode.exitFlag = false;
		planMode.goalAlpha = 1;
		planMode.gui.gfx = planMode.gfx;
		planMode.gui.enter();
		if(planMode.isSandbox){
			planMode.uploadBut.locked = false;
			planMode.newBut.locked = false;
			planMode.propBut.locked = false;
		}
		else{
			planMode.uploadBut.locked = true;
			planMode.newBut.locked = true;
			planMode.propBut.locked = true;
		}
		setRed();
		// TODO: reset locks
		// TODO: reset visibilities

		App.Game.setMode(App.Game.modes.PLANNING);
		App.GuiInstDrag.changeDirection(App.DIRECTIONS.UP);
		App.Shade.turnOff();
	}

	planMode.exitFunc = function(){
		planMode.requestStaticRenderUpdate = true;
		planMode.exitFlag = true;
		planMode.goalAlpha = 0;
		planMode.gui.exit();
	}

	planMode.updateFunc = function(){
		if(planMode.gui.update())
			planMode.requestStaticRenderUpdate = true;

		if(!planMode.requestStaticRenderUpdate)return;
		planMode.requestStaticRenderUpdate = false;

		planMode.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		if(planMode.gui.render())
			planMode.requestStaticRenderUpdate = true;

		if(planMode.alpha !== planMode.goalAlpha){
			planMode.alpha += expInterp(planMode.alpha,planMode.goalAlpha,0.005,0.01);
			planMode.gfx.globalAlpha = planMode.alpha;
			planMode.requestStaticRenderUpdate = true;
		}

		// TOP BAR -------------------------------------

		var keys = Object.keys(App.Game.inStreams);
		for(var i in keys){
			var key = keys[i];
			var stream = App.Game.inStreams[key];
			switch(stream[4]){
				case App.COLORS.RED:    planMode.gfx.fillStyle = 'rgba(255,0,0,0.2)';break;
				case App.COLORS.GREEN:  planMode.gfx.fillStyle = 'rgba(0,255,0,0.2)';break;
				case App.COLORS.BLUE:   planMode.gfx.fillStyle = 'rgba(0,0,255,0.2)';break;
				case App.COLORS.YELLOW: planMode.gfx.fillStyle = 'rgba(255,255,0,0.2)';break;
			}planMode.gfx.fillRect(5+i*100,5,98,63);
			App.InstCatalog.render(planMode.gfx,8,5+i*100,5,stream[4],48,key);
			App.renderToken(planMode.gfx,55+i*100,5,''/*,stream[2][stream[3]]*/,48);
			planMode.gfx.fillStyle = '#ffffff';
			text(planMode.gfx,'gives '+stream[0],10+i*100,55,8,-1);
		}

		var keys = Object.keys(App.Game.outStreams);
		for(var i in keys){
			var key = keys[i];
			var stream = App.Game.outStreams[key];
			switch(stream[6]){
				case App.COLORS.RED:    planMode.gfx.fillStyle = 'rgba(255,0,0,0.2)';break;
				case App.COLORS.GREEN:  planMode.gfx.fillStyle = 'rgba(0,255,0,0.2)';break;
				case App.COLORS.BLUE:   planMode.gfx.fillStyle = 'rgba(0,0,255,0.2)';break;
				case App.COLORS.YELLOW: planMode.gfx.fillStyle = 'rgba(255,255,0,0.2)';break;
			}planMode.gfx.fillRect(5+i*100,70,98,63);
			App.InstCatalog.render(planMode.gfx,8,5+i*100,70,stream[6],48,key);
			App.renderToken(planMode.gfx,55+i*100,70,''/*,stream[2][stream[3]]*/,48);
			planMode.gfx.fillStyle = '#ffffff';
			text(planMode.gfx,'accepts '+stream[0],10+i*100,120,8,-1);
		}

		// BOTTOM BAR ----------------------------------

		var xOffset = Math.floor((App.Canvases.width-50*8)/2)+1;
		var yOffset = App.Canvases.height-100-2-5;

		planMode.gfx.fillStyle = 'rgba(0,0,0,0.8)';
		if(planMode.exitFlag && planMode.requestStaticRenderUpdate === false){
			planMode.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			planMode.updatingActive = false;
		}
	}

//============================================================================//

	planMode.registerKeyDownFunc('Esc',function(){returnToMenu();});

	planMode.registerKeyDownFunc('Space',function(){
		App.ModeHandler.pushMode('simulation');
		App.ModeHandler.modes['simulation'].renderStreams = true;
	});

	var registerDirectional = function(key,direction){
		planMode.registerKeyDownFunc(key,function(){
			planMode.direction = direction;
			App.GuiInstDrag.changeDirection(direction);
			planMode.requestStaticRenderUpdate = true;
		});
	}

	registerDirectional('W',App.DIRECTIONS.UP);
	registerDirectional('S',App.DIRECTIONS.DOWN);
	registerDirectional('A',App.DIRECTIONS.LEFT);
	registerDirectional('D',App.DIRECTIONS.RIGHT);

	planMode.registerKeyDownFunc('1', setRed);
	planMode.registerKeyDownFunc('2', setGreen);
	planMode.registerKeyDownFunc('3', setBlue);
	planMode.registerKeyDownFunc('4', setYellow);
	planMode.registerKeyDownFunc('Tab',function(){
		planMode.color = (planMode.color+1)%4;
		switch(planMode.color){
			case App.COLORS.RED:    setRed();break;
			case App.COLORS.GREEN:  setGreen();break;
			case App.COLORS.BLUE:   setBlue();break;
			case App.COLORS.YELLOW: setYellow();break;
		}
	});

	planMode.registerKeyDownFunc('Ctrl',function(){ App.Game.currentPlanningLevel.graphics.copying = true;  });
	planMode.registerKeyUpFunc  ('Ctrl',function(){ App.Game.currentPlanningLevel.graphics.copying = false; });

	planMode.registerKeyDownFunc('Delete',function(){
		if(App.Game.currentPlanningLevel.currentSelection !== []){
			App.Game.currentPlanningLevel.delete(App.Game.currentPlanningLevel.currentSelection);
			App.GameRenderer.requestStaticRenderUpdate = true;
		}
	});

	planMode.registerKeyDownFunc('Z',function(){
		if(App.InputHandler.keysDown[App.InputHandler.keyCharToCode['Ctrl']]){
			if(App.InputHandler.keysDown[App.InputHandler.keyCharToCode['Shift']]){
				App.Game.currentPlanningLevel.redo();
			}else{
				App.Game.currentPlanningLevel.undo();
			}
		}App.GameRenderer.requestStaticRenderUpdate = true;
	});

	planMode.registerMouseMoveFunc(function(x,y){
		App.GameRenderer.screenToGridCoords(x,y);
		if(App.InputHandler.rmb)App.GameRenderer.pan(x,y);
		App.Game.currentPlanningLevel.graphics.mouseMove(App.GameRenderer.mouseX,App.GameRenderer.mouseY);
	});

	planMode.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT,function(x,y){
		planMode.gui.mouseDown(x, y);

		var insCode = undefined;
		var d = planMode.direction;
		var set = function(key,code){if(App.InputHandler.keysDown[App.InputHandler.keyCharToCode[key]] === true)insCode = code;}

		set('Q', 0+d);set('W', 4);set('E',12);set('R',27+d);set('T',31+d);set('Y',16);set('U',13);set('I',15);set('O',8);
		set('A', 7  );set('S', 6);set('D', 5);set('F',23+d);set('G',19+d);set('H',17);set('J',14);set('K',18);set('L',9);

		if(insCode !== undefined){
			var ins = new App.PlanningInstruction(App.GameRenderer.mouseX,App.GameRenderer.mouseY,planMode.color,insCode);

			App.Game.currentPlanningLevel.insert(ins);
			App.Game.currentPlanningLevel.graphics.inserted = true;
			App.GameRenderer.requestStaticRenderUpdate = true;
		}else{ App.Game.currentPlanningLevel.graphics.inserted = false; }

		App.Game.currentPlanningLevel.graphics.mouseDown('lmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);
	});

	planMode.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.MIDDLE,function(x,y){App.Game.currentPlanningLevel.graphics.mouseDown('mmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);});
	planMode.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.RIGHT,function(x,y){App.GameRenderer.beginPan(x,y);App.Game.currentPlanningLevel.graphics.mouseDown('rmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);});

	planMode.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT,function(x,y){planMode.gui.mouseUp(x, y);App.Game.currentPlanningLevel.graphics.mouseUp('lmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);});

	planMode.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.MIDDLE,function(x,y){App.Game.currentPlanningLevel.graphics.mouseUp('mmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);});
	planMode.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.RIGHT,function(x,y){App.Game.currentPlanningLevel.graphics.mouseUp('rmb',App.GameRenderer.mouseX,App.GameRenderer.mouseY);});
	planMode.registerMouseWheelFunc(function(w){App.GameRenderer.zoom(App.InputHandler.mouseX,App.InputHandler.mouseY,w);});
	//planMode.registerResizeFunc(function(){/* TODO: move grid relative to center of screen, NOT a bestFit() */});
}
