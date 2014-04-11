/*
	Explanation: In order for other things to access this, it has to be loaded first.
	HOWEVER we don't want to load main.js (and therefore risk running the application) until
	every OTHER script has been loaded. So that's why there's this script instead of just
	putting it all in main. Stupid fucking JavaScript.
*/

App = {}; // top level object | everything should be stored within here

App.COLORS = {
	RED    : 0,
	GREEN  : 1,
	BLUE   : 2,
	YELLOW : 3
};

App.DIRECTIONS = {
	LEFT  : 0,
	DOWN  : 1,
	RIGHT : 2,
	UP    : 3
};


App.demoLevels = [
	"AllInstructions,10,7;1,1,0,0;1,2,0,4;1,3,0,18;1,4,0,22;1,5,0,26;2,1,0,1;2,2,0,5;2,3,0,19;2,4,0,23;2,5,0,27;3,1,0,2;3,2,0,6;3,3,0,20;3,4,0,24;3,5,0,28;4,1,0,3;4,2,0,7;4,3,0,21;4,4,0,25;4,5,0,29;6,1,0,8;6,2,0,10;6,3,0,13;6,4,0,15;6,4,1,15;6,4,2,15;6,4,3,15;6,5,0,17;7,1,0,9;7,2,0,11;7,3,0,14;8,2,0,12;8,4,0,16;8,4,1,16;8,4,2,16;8,4,3,16",
	"OldSort,10,5;0,0,0,1;0,0,1,16;0,0,2,16;0,0,3,16;0,1,0,8;0,1,3,7;0,4,1,4;1,1,2,14;1,1,3,19;1,2,0,13;1,4,0,9;1,4,1,6;2,1,2,14;2,1,3,19;2,2,0,13;2,2,1,13;2,4,0,9;2,4,1,6;3,1,2,14;3,1,3,19;3,2,0,13;3,2,1,13;3,2,2,13;3,4,0,9;3,4,1,6;4,1,2,14;4,1,3,19;4,2,0,13;4,2,1,13;4,2,2,13;4,2,3,13;4,4,0,9;4,4,1,6;5,1,2,14;5,1,3,19;5,2,0,13;5,2,1,13;5,2,2,13;5,2,3,13;5,3,0,13;5,4,0,9;5,4,1,6;6,1,2,14;6,1,3,19;6,2,0,13;6,2,1,13;6,2,2,13;6,2,3,13;6,3,0,13;6,3,1,13;6,4,0,9;6,4,1,6;7,1,2,14;7,1,3,19;7,2,0,13;7,2,1,13;7,2,2,13;7,2,3,13;7,3,0,13;7,3,1,13;7,3,2,13;7,4,0,9;7,4,1,6;8,1,2,14;8,1,3,19;8,2,0,13;8,2,1,13;8,2,2,13;8,2,3,13;8,3,0,13;8,3,1,13;8,3,2,13;8,3,3,13;8,4,0,9;8,4,1,6;9,1,2,5;9,2,0,13;9,2,1,13;9,2,2,13;9,2,3,13;9,3,0,13;9,3,1,13;9,3,2,13;9,3,3,13;9,4,0,9;9,4,1,6",
	"SuperSort,6,7;0,0,0,1;0,1,0,1;0,2,0,1;0,2,1,16;0,2,2,16;0,2,3,16;0,3,0,8;0,3,1,7;0,4,0,1;0,5,0,1;0,6,0,1;1,0,0,9;1,0,1,7;1,2,2,13;1,2,3,13;1,3,0,14;1,3,1,18;1,3,2,14;1,3,3,19;1,4,0,13;1,4,1,13;1,6,0,9;1,6,1,7;2,0,0,9;2,0,1,7;2,2,0,13;2,2,1,13;2,2,2,13;2,2,3,13;2,3,0,14;2,3,1,18;2,3,2,14;2,3,3,19;2,4,0,13;2,4,1,13;2,4,2,13;2,4,3,13;2,6,0,9;2,6,1,7;3,0,0,9;3,0,1,7;3,1,2,13;3,1,3,13;3,2,0,13;3,2,1,13;3,2,2,13;3,2,3,13;3,3,0,14;3,3,1,18;3,3,2,14;3,3,3,19;3,4,0,13;3,4,1,13;3,4,2,13;3,4,3,13;3,5,0,13;3,5,1,13;3,6,0,9;3,6,1,7;4,0,0,9;4,0,1,7;4,1,0,13;4,1,1,13;4,1,2,13;4,1,3,13;4,2,0,13;4,2,1,13;4,2,2,13;4,2,3,13;4,3,0,14;4,3,1,18;4,3,2,14;4,3,3,19;4,4,0,13;4,4,1,13;4,4,2,13;4,4,3,13;4,5,0,13;4,5,1,13;4,5,2,13;4,5,3,13;4,6,0,9;4,6,1,7;5,0,0,9;5,0,1,5;5,1,0,13;5,1,1,13;5,1,2,13;5,1,3,13;5,2,0,13;5,2,1,13;5,2,2,13;5,2,3,13;5,3,0,7;5,3,1,22;5,6,1,4"
]

App.getDemoLevel = function(){
	App.Game.simulationSpeed = 512; //reset on entering menus
	return App.demoLevels[Math.floor(Math.random() * App.demoLevels.length)];
}

App.lastSandboxLevel = null;
App.getSandboxLevel = function(){
	if(App.lastSandboxLevel)
	{
		return App.lastSandboxLevel;
	}
return "Blank,10,10";
}

App.getNextLevel = function(){
	//TODO make this return the next level based on local storage!
	return App.Game.currentPlanningLevel; //right now does nothing.
}

App.setup = {};
App.setup.frames = {PLANNING:'Planning', SIMULATION:'Simulation', SANDBOX:'Sandbox',  MAIN_MENU:'Main Menu', LEVEL_SELECT:'Level Select', USER_LEVEL_SELECT:'User Level Selection', SETTINGS:'Settings'}
App.setup.modes = {PLANNING:App.setup.frames.PLANNING, SIMULATION:App.setup.frames.SIMULATION} // XXX: why is this a nearly complete duplicate of App.Game.modes? why not just use App.Game.modes?

App.MODES = {
	MAIN_MENU         : {frame:App.setup.frames.MAIN_MENU,
	                     mode:App.setup.modes.SIMULATION,
	                     level:App.getDemoLevel,
	                     exit:null,
	                     toString:function(){return 'MAIN_MENU'}},

	PLANNING          : {frame:App.setup.frames.PLANNING,
	                     mode:App.setup.modes.PLANNING,
	                     level:null,
	                     exit:null,
	                     toString:function(){return 'PLANNING'}},

	SANDBOX           : {frame:App.setup.frames.SANDBOX,
	                     mode:App.setup.modes.PLANNING,
	                     level:App.getSandboxLevel,
	                     exit:function(){App.lastSandboxLevel = App.Game.currentPlanningLevel.generateParseString();},
	                     toString:function(){return 'SANDBOX'}},

	SIMULATION        : {frame:App.setup.frames.SIMULATION,
	                     mode:App.setup.modes.SIMULATION,
	                     level:null,
	                     exit:null,
	                     toString:function(){return 'SIMULATION'}},

	USER_LEVEL_SELECT : {frame:App.setup.frames.USER_LEVEL_SELECT,
	                     mode:App.setup.modes.SIMULATION,
	                     level:App.getDemoLevel,
	                     exit:null,
	                     toString:function(){return 'USER_LEVEL_SELECT'}},

	SETTINGS          : {frame:App.setup.frames.SETTINGS,
	                     mode:App.setup.modes.SIMULATION,
	                     evel:App.getDemoLevel,
	                     toString:function(){return 'SETTINGS'}},

	LEVEL_SELECT      : {frame:App.setup.frames.LEVEL_SELECT,
	                     mode:App.setup.modes.SIMULATION,
	                     evel:App.getDemoLevel,
	                     toString:function(){return 'LEVEL_SELECT'}}

}
App.MODE = App.MODES.PLANNING;
App.LASTMODE = App.MODES.PLANNING;

App.changeMode = function(mode, ignoreLevel){
	if(App.MODE.exit)
		App.MODE.exit();
	if(mode.level && !ignoreLevel)App.Game.loadNewLevel(mode.level());

	// TODO: DUMP ALL THIS INTO App.Game.centerGrid() v v v v v v //
	// TODO: this should only happen if a center-grid is requested
	var cs = App.Game.cellSize;
	App.Game.goalRenderX = Math.floor((App.Canvases.width-App.Game.currentPlanningLevel.width*cs)/2);
	App.Game.goalRenderY = Math.floor((App.Canvases.height-App.Game.currentPlanningLevel.height*cs)/2);
	// TODO: set optimal zoom
	// TODO: ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  //

	// XXX: renderX and renderY shouldnt be set manually
//	App.Game.renderX = ((App.MODE === App.MODES.PLANNING && mode === App.MODES.SIMULATION) || (App.MODE === App.MODES.SIMULATION && mode === App.MODES.PLANNING)) ? App.Game.goalRenderX : 20000;
//	App.Game.renderY = App.Canvases.halfHeight - ( App.Game.currentPlanningLevel.height * App.Game.cellSize )/2;

	App.Game.setMode(mode.mode);
	App.Gui.setCurrentFrame(mode.frame);

	App.LASTMODE = App.MODE;
	App.MODE = mode;
	console.log('changed mode to : ' + mode);
}



