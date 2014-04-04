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
//	UP    : 0,
//	LEFT  : 1,
//	DOWN  : 2,
//	RIGHT : 3

	// /\ in modulo arithmetic this is exactly the same thing /\

	// this order makes rotation much more convenient
	LEFT  : 0,
	DOWN  : 1,
	RIGHT : 2,
	UP    : 3
};


App.demoLevels = [
	"Demo1,7,6;1,2,0,3;1,2,1,3;1,2,2,3;1,2,3,2;2,1,1,7;2,2,1,4;2,2,2,5;2,4,2,7;4,1,1,5;4,2,1,7;4,2,2,7;4,4,2,4;5,2,0,22;5,2,1,22;5,2,2,22;5,2,3,22",
	"Demo2,8,3;1,1,0,3;1,1,3,3;2,1,0,12;2,1,3,23;3,1,0,10;3,1,3,14;4,1,0,17;4,1,3,17;5,1,0,11;5,1,3,15;6,1,0,13"

]
App.getDemoLevel = function(){
	App.Game.simulationSpeed = 512; //reset on entering menus
	return App.demoLevels[Math.floor(Math.random() * App.demoLevels.length)];
}

App.setup = {};
App.setup.frames = {PLANNING:'Planning', SIMULATION:'Simulation', MAIN_MENU:'Main Menu', LEVEL_SELECT:'Level Select', USER_LEVEL_SELECT:'User Level Selection', SETTINGS:'Settings'}
App.setup.modes = {PLANNING:App.setup.frames.PLANNING, SIMULATION:App.setup.frames.SIMULATION}

App.MODES = {
	MAIN_MENU         : {frame:App.setup.frames.MAIN_MENU,
	                     mode:App.setup.modes.SIMULATION,
	                     level:App.getDemoLevel,
	                     toString:function(){return 'MAIN_MENU'}},

	PLANNING          : {frame:App.setup.frames.PLANNING,
	                     mode:App.setup.modes.PLANNING,
	                     level:null,
	                     toString:function(){return 'PLANNING'}},

	SIMULATION        : {frame:App.setup.frames.SIMULATION,
	                     mode:App.setup.modes.SIMULATION,
	                     level:null,
	                     toString:function(){return 'SIMULATION'}},

	USER_LEVEL_SELECT : {frame:App.setup.frames.USER_LEVEL_SELECT,
	                     mode:App.setup.modes.SIMULATION,
	                     evel:App.getDemoLevel,
	                     toString:function(){return 'USER_LEVEL_SELECT'}},

	SETTINGS : {frame:App.setup.frames.SETTINGS,
	                     mode:App.setup.modes.SIMULATION,
	                     evel:App.getDemoLevel,
	                     toString:function(){return 'SETTINGS'}},

	LEVEL_SELECT : {frame:App.setup.frames.LEVEL_SELECT,
	                     mode:App.setup.modes.SIMULATION,
	                     evel:App.getDemoLevel,
	                     toString:function(){return 'LEVEL_SELECT'}}

}
App.MODE = App.MODES.PLANNING;

App.changeMode = function(mode){

	if(mode.level){
		App.Game.loadNewLevel(mode.level());
	}



	// this becomes especially annoying when switching between planning and simulation mode
	// a different transition will be written for level swapping once we get the functionality of that going


	// |||Leave it for now: it's good for demo purposes and it doesn't do the transition when going between
	// planning and simulation mode! It only does it when changing menus! And it's nice
	// to have it start out centered, otherwise it tries to draw in a place it can't legally
	App.Game.renderY = App.Canvases.halfHeight - ( App.Game.currentPlanningLevel.height * App.Game.cellSize )/2;

	App.Game.goalRenderX = App.Canvases.halfWidth - (App.Game.currentPlanningLevel.width * App.Game.cellSize )/2;
	App.Game.goalRenderY = App.Game.renderY;

	App.Game.renderX = ((App.MODE === App.MODES.PLANNING && mode === App.MODES.SIMULATION) || (App.MODE === App.MODES.SIMULATION && mode === App.MODES.PLANNING)) ? App.Game.goalRenderX : 20000;

	App.Game.setMode(mode.mode);
	App.Gui.setCurrentFrame(mode.frame);

	App.MODE = mode;
	console.log('changed mode to : ' + mode);
}



