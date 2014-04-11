//An input redirect 'class' for the game (simulation and planning modes)

//TODO make work with planning AND simulation modes.
//Need a functioning (visibly so, at least) planning mode first.

App.makeGameInput = function(){
	var gInput = {};


	gInput.mouseDown = function(mouseData){
		var game = App.Game;

		if(mouseData.rmb)
			game.beginPan(mouseData.x, mouseData.y);

		//do dragging of instructions that have already been placed
		//OR
		//do selection box (to select a number of instructions)			
		if(mouseData.lmb && game.mode === game.modes.PLANNING){
			App.Game.currentPlanningLevel.setDown(App.Game.mouseX, App.Game.mouseY, App.Game.mouseC, mouseData.x, mouseData.y);
		}

		else if(mouseData.lmb && game.mode === game.modes.SIMULATION){
			//show data about a node?
		}

	}

	gInput.mouseUp = function(mouseData){
		var game = App.Game;

		App.Game.screenToGridCoords(mouseData.x,mouseData.y);

		// TODO: do dragging of instructions that have already been placed
		if(mouseData.lmb && game.mode === game.modes.PLANNING){
			App.Game.currentPlanningLevel.setUp(App.Game.mouseX, App.Game.mouseY, App.Game.mouseC);
		}
		
	}

	gInput.mouseMove = function(mouseData){
		var game = App.Game;

		App.Game.screenToGridCoords(mouseData.x,mouseData.y); // DELETE

		if(mouseData.rmb){
			game.pan(mouseData.x, mouseData.y);
		}

		if(game.mode === game.modes.PLANNING){
			App.Game.currentPlanningLevel.input.setCurrentMouseCoords(mouseData.x,mouseData.y);
		}
	}

	gInput.mouseWheel = function(mouseData){
		var game = App.Game;

		game.zoom(mouseData.x, mouseData.y, mouseData.wheel);
	}

	//Just to allow key registration to happen here for ease of grokking the API
	gInput.registerKey = function(key, callback){
		App.InputHandler.registerKey(key, callback);
	}

	return gInput;
}
