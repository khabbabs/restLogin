App.setupSimGui = function(){
	var simMode = App.ModeHandler.addNewMode('simulation');

		// ---------------------------------------------

	simMode.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	simMode.renderStreams = false;

		// ---------------------------------------------

	simMode.enterFunc = function(){
		simMode.requestStaticRenderUpdate = true;
		simMode.updatingActive = true;
		simMode.exitFlag = false;

		App.Game.setMode(App.Game.modes.SIMULATION);
		App.Shade.turnOff();
	}

	simMode.updateFunc = function(){
		if(!simMode.requestStaticRenderUpdate)return;
		simMode.requestStaticRenderUpdate = false;

		simMode.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		if(simMode.renderStreams){
			var keys = Object.keys(App.Game.inStreams);
			for(var i in keys){
				var key = keys[i];
				var stream = App.Game.inStreams[key];
				switch(stream[4]){
					case App.COLORS.RED:    simMode.gfx.fillStyle = 'rgba(255,0,0,0.2)';break;
					case App.COLORS.GREEN:  simMode.gfx.fillStyle = 'rgba(0,255,0,0.2)';break;
					case App.COLORS.BLUE:   simMode.gfx.fillStyle = 'rgba(0,0,255,0.2)';break;
					case App.COLORS.YELLOW: simMode.gfx.fillStyle = 'rgba(255,255,0,0.2)';break;
				}simMode.gfx.fillRect(5+i*100,5,98,63);
				App.InstCatalog.render(simMode.gfx,8,5+i*100,5,stream[4],48,key);
				App.renderToken(simMode.gfx,55+i*100,5,stream[2][stream[3]],48);
				simMode.gfx.fillStyle = '#ffffff';
				text(simMode.gfx,'gives '+stream[0],10+i*100,55,8,-1);
			}

			var keys = Object.keys(App.Game.outStreams);
			for(var i in keys){
				var key = keys[i];
				var stream = App.Game.outStreams[key];
				switch(stream[6]){
					case App.COLORS.RED:    simMode.gfx.fillStyle = 'rgba(255,0,0,0.2)';break;
					case App.COLORS.GREEN:  simMode.gfx.fillStyle = 'rgba(0,255,0,0.2)';break;
					case App.COLORS.BLUE:   simMode.gfx.fillStyle = 'rgba(0,0,255,0.2)';break;
					case App.COLORS.YELLOW: simMode.gfx.fillStyle = 'rgba(255,255,0,0.2)';break;
				}simMode.gfx.fillRect(5+i*100,70,98,63);
				App.InstCatalog.render(simMode.gfx,8,5+i*100,70,stream[6],48,key);
				App.renderToken(simMode.gfx,55+i*100,70,stream[2][stream[3]],48);
				simMode.gfx.fillStyle = '#ffffff';
				text(simMode.gfx,'accepts '+stream[0],10+i*100,120,8,-1);
			}

			// TODO: TRIGGER A STATIC RENDER UPDATE WHEN TOKEN CHANGES
			simMode.requestStaticRenderUpdate = true; // DELETE THIS!!!!!!!!!!!!!
		}

		if(simMode.exitFlag && simMode.requestStaticRenderUpdate === false){
			simMode.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			simMode.updatingActive = false;
		}
	}

	simMode.exitFunc = function(){
		simMode.requestStaticRenderUpdate = true;
		simMode.exitFlag = true;
		simMode.renderStreams = false;
	}

		// ---------------------------------------------

	simMode.registerKeyDownFunc('Esc',function(){
		App.ModeHandler.popMode();
	});

	simMode.registerKeyDownFunc('Space',function(){
		App.Game.pause();
	});

	simMode.registerKeyDownFunc(']',function(){
		App.Game.setSimulationSpeed(App.Game.simulationSpeed/2);
	});

	simMode.registerKeyDownFunc('[',function(){
		App.Game.setSimulationSpeed(App.Game.simulationSpeed*2);
	});

	simMode.registerMouseMoveFunc(function(x,y){
		App.GameRenderer.screenToGridCoords(x,y);
		if(App.InputHandler.rmb)App.GameRenderer.pan(x,y);
	});

	simMode.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.RIGHT,function(x,y){
		App.GameRenderer.beginPan(x,y);
	});

	simMode.registerMouseWheelFunc(function(w){
		App.GameRenderer.zoom(App.InputHandler.mouseX,App.InputHandler.mouseY,w);
	});

	simMode.registerResizeFunc(function(){
		// TODO: move grid relative to center of screen, NOT a bestFit()
	});
}
