//An input redirection 'class' for dealing with the gui side of input.

App.makeGuiInput = function(){
	var gInput = {};

	//First, checks all components in current frame for collision
	//Simultaneously updates the active component based on whether a collision
	//is a functional object (should be passed clickStart, etc)
	//Then calls clickStart if necessary, and returns whether or not a collision occurred
	gInput.mouseDown = function(mouseData){
		var comp = App.Gui.testCoordinates(mouseData.x, mouseData.y);
		if(!comp)
			return false;

		var frame = App.Gui.currentFrame;
		if(comp.guiCollider.functional)
			App.Gui.activeComponent = comp;
		App.Gui.drawStatic = true;

		//I don't declare a variable for activecomponent because if it's null,
		//the App.Gui will need manual updating.
		if(App.Gui.activeComponent && App.Gui.activeComponent.clickStart){
			App.Gui.activeComponent.clickStart();

			if(App.Gui.activeComponent.activeColor)
				App.Gui.activeComponent.color = App.Gui.activeComponent.activeColor;

		}

		return true;
	}


	//Calls the clickEnd function on the active component if appropriate,
	//then clears active component.
	gInput.mouseUp = function(mouseData){
		if(App.Gui.activeComponent && App.Gui.activeComponent.clickEnd){
			App.Gui.activeComponent.clickEnd(mouseData.x, mouseData.y);
			if(App.Gui.activeComponent && App.Gui.activeComponent.inactiveColor)
				App.Gui.activeComponent.color = App.Gui.activeComponent.inactiveColor;
		}
		App.Gui.activeComponent = null;
		App.Gui.drawStatic = true;
	}

	//We can allow moving through the gui when clicking and dragging in game.
	//Used mainly not to drag buttons (too laggy), but to make sure buttons
	//cancel their mid-click state if the user moves their mouse away
	gInput.mouseMove = function(mouseData){
		if(App.Gui.activeComponent && App.Gui.activeComponent.clickDrag)
			App.Gui.activeComponent.clickDrag(mouseData.x, mouseData.y);
	}

	gInput.mouseWheel = function(mouseData){
		//nothing yet! later, scrollable tables, maybe.
		//right now, just block input if necessary
		return App.Gui.testCoordinates(mouseData.x, mouseData.y);
	}

	//Just to allow key registration to happen here for ease of grokking the API
	gInput.registerKey = function(key, callback){
		App.InputHandler.registerKey(key, callback);
	}

	return gInput;
}
