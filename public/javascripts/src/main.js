/*
	Top-level window event handler.
	Fires when the window loads.
	This provides a safe  place to kick off things and start the game.
*/
window.onload = function(){
	App.Canvases     = App.createCanvasArray();
	App.InputHandler = App.makeInputHandler();
	App.Gui          = App.makeGUI();
	App.InstCatalog  = App.makeInstructionCatalog();
	App.Game         = App.makeGame();
	App.Engine       = App.makeEngine();

	App.setupGUI();
	App.Engine.run();

	setupTestLevel(); //temporary

	App.changeMode(App.MODES.MAIN_MENU);
	//App.changeMode(App.MODES.PLANNING);
	//App.changeMode(App.MODES.USER_LEVEL_SELECT);
}