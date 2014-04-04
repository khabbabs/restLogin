// DELETE THIS FILE ONCE PROPER LEVEL LOADING IS IMPLEMENTED

function test1(){
	var testLevel = new App.PlanningLevel();
	testLevel.width  = 7;
	testLevel.height = 7;

	for(var x=0;x<5;++x)for(var y=0;y<5;++y)
		testLevel.insert(new App.PlanningInstruction(x+1,y+1,0,5*y+x));

	return testLevel;
}

function test2(){
	var testLevel = new App.PlanningLevel();
	testLevel.width  = 8;
	testLevel.height = 3;

	testLevel.insert(new App.PlanningInstruction(1,1,0,3));
	testLevel.insert(new App.PlanningInstruction(1,1,3,3));
	testLevel.insert(new App.PlanningInstruction(2,1,0,12));
	testLevel.insert(new App.PlanningInstruction(2,1,3,23));
	testLevel.insert(new App.PlanningInstruction(3,1,0,10));
	testLevel.insert(new App.PlanningInstruction(3,1,3,14));
	testLevel.insert(new App.PlanningInstruction(4,1,0,17));
	testLevel.insert(new App.PlanningInstruction(4,1,3,17));
	testLevel.insert(new App.PlanningInstruction(5,1,0,11));
	testLevel.insert(new App.PlanningInstruction(5,1,3,15));
	testLevel.insert(new App.PlanningInstruction(6,1,0,13));

	return testLevel;
}

function test3(){
	var testLevel = new App.PlanningLevel();
	testLevel.width  = 7;
	testLevel.height = 6;

	testLevel.insert(new App.PlanningInstruction(1,2,0,3));
	testLevel.insert(new App.PlanningInstruction(1,2,1,3));
	testLevel.insert(new App.PlanningInstruction(1,2,2,3));
	testLevel.insert(new App.PlanningInstruction(1,2,3,2));

	testLevel.insert(new App.PlanningInstruction(2,2,1,4));
	testLevel.insert(new App.PlanningInstruction(2,2,2,5));
	testLevel.insert(new App.PlanningInstruction(2,1,1,7));
	testLevel.insert(new App.PlanningInstruction(2,4,2,7));
	testLevel.insert(new App.PlanningInstruction(4,1,1,5));
	testLevel.insert(new App.PlanningInstruction(4,4,2,4));
	testLevel.insert(new App.PlanningInstruction(4,2,1,7));
	testLevel.insert(new App.PlanningInstruction(4,2,2,7));

	testLevel.insert(new App.PlanningInstruction(5,2,0,22));
	testLevel.insert(new App.PlanningInstruction(5,2,1,22));
	testLevel.insert(new App.PlanningInstruction(5,2,2,22));
	testLevel.insert(new App.PlanningInstruction(5,2,3,22));

	return testLevel;
}

function test4(){
	var testLevel = new App.PlanningLevel();
	testLevel.width  = 0;
	testLevel.height = 3;
	testLevel.insert(new App.PlanningInstruction(0,0,0,0));
	testLevel.insert(new App.PlanningInstruction(0,0,1,1));
	testLevel.insert(new App.PlanningInstruction(0,0,2,2));
	testLevel.insert(new App.PlanningInstruction(0,0,3,3));
	return testLevel;
}

function setupTestLevel(){
	App.Game.currentPlanningLevel = test4();
}

// DELETE THIS FILE ONCE PROPER LEVEL LOADING IS IMPLEMENTED
