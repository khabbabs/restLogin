window.onload = function(){
	App.InstCatalog  = App.makeInstructionCatalog();
	App.Canvases     = App.createCanvasArray();
	App.InputHandler = App.makeInputHandler();
	App.ModeHandler  = App.makeModeHandler();
	App.Engine       = App.makeEngine();
	App.Shade        = App.makeShade();

	App.Game         = App.makeGame();
	App.GameRenderer = App.makeGameRenderer();

	App.setupMainMenu();
	App.setupLevelSelect();
	App.setupLibrary();
	App.setupSettings();
	App.confirmGui = App.setupConfirm();
	App.setupSubmitLevel();
	App.setupCreateAccount();

	// TODO: split below into normal and sandbox versions?
	App.setupPlanGui();
	App.setupSimGui();
	App.setupErrorGui();
	App.setupSuccessGui();
	
	App.Engine.run();
}
