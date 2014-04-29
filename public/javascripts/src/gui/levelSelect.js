App.setupLevelSelect = function(){
	var levelSelect = App.ModeHandler.addNewMode('level select');

		// ---------------------------------------------

	var startLevel = function(lvlStr){
		App.Game.currentPlanningLevel = App.Game.parseLevel(lvlStr);
		App.GameRenderer.bestFit();
		App.ModeHandler.pushMode('planning');
		levelSelect.requestStaticRenderUpdate = true;
	}

	var xOffset=0,yOffset=0,timeOffset=0;
	levelSelect.levelButtons = [];
	var addLevel = function(title,level){
		var btn = new App.GuiTextButton(15+172*xOffset,56+28*yOffset,timeOffset+200,timeOffset,title,function(){startLevel(level);},false,null,null);
		++xOffset;
		if(xOffset > 2){
			xOffset = 0;
			++yOffset;
		}timeOffset+=30;
		btn.hoverColor      = '#ff0000';
		btn.activeColor     = '#800000';
		btn.activeTextColor = '#ff0000';
		btn.w = 168;
		levelSelect.gui.addComponent(btn);
	}

	levelSelect.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	levelSelect.gui = new App.guiFrame(levelSelect.gfx);

	addLevel("Moving"          , "move`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`I`10");
	addLevel("Incrementing"    , "increment`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`I+3`10");
	addLevel("Zeroing"         , "zero`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`0`10");
	addLevel("Modding"         , "mod 2`0`11`5~2`2`0`8`I`random(0,10)~8`2`0`9`O`I%2`10");
	addLevel("Multi Sorting"   , "msort`0`11`5");
	addLevel("Single Sorting"  , "ssort`0`11`5");
	addLevel("Rounding"        , "round`0`11`5~2`2`0`8`I`random(0,100)~8`2`0`9`O`round(I/10)*10`10");
	addLevel("Negation"        , "negate`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`-I`10");
	addLevel("Absoluting"      , "abs`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`abs(I)`10");
	addLevel("Addition"        , "add`0`11`11~2`2`0`8`A`random(0,10)~2`8`1`8`B`random(0,10)~8`5`2`9`O`A+B`10");
	addLevel("Multiplication"  , "multiply`0`11`11~2`5`3`8`Z`0~5`2`0`8`A`random(0,10)~5`8`1`8`B`random(0,10)~8`5`2`9`O`A*B`10");
//	addLevel("Instruction Set" , "AllInstructions`0`10`13~1`1`0`0~2`1`0`1~3`1`0`2~4`1`0`3~1`2`0`4~2`2`0`5~3`2`0`6~4`2`0`7~1`3`0`19~2`3`0`20~3`3`0`21~4`3`0`22~1`4`0`23~2`4`0`24~3`4`0`25~4`4`0`26~1`5`0`27~2`5`0`28~3`5`0`29~4`5`0`30~1`6`0`31~2`6`0`32~3`6`0`33~4`6`0`34~6`1`0`10~7`1`0`11~8`1`0`12~6`2`0`13~7`2`0`14~8`2`0`15~6`3`0`18~6`5`0`16~6`5`1`16~6`5`2`16~6`5`3`16~8`5`0`17~8`5`1`17~8`5`2`17~8`5`3`17~1`8`0`8`A`0~2`8`0`8`B`0~3`8`0`8`C`0~4`8`0`8`D`0~5`8`0`8`E`0~6`8`0`8`F`0~7`8`0`8`G`0~8`8`0`8`H`0~1`9`1`8`I`0~2`9`1`8`J`0~3`9`1`8`K`0~4`9`1`8`L`0~5`9`1`8`M`0~6`9`1`8`N`0~7`9`1`8`O`0~8`9`1`8`P`0~1`10`2`8`Q`0~2`10`2`8`R`0~3`10`2`8`S`0~4`10`2`8`T`0~5`10`2`8`U`0~6`10`2`8`V`0~7`10`2`8`W`0~8`10`2`8`X`0~4`11`3`8`Y`0~5`11`3`8`Z`0");

	levelSelect.backButton 	= new App.GuiTextButton(15,56+28*(yOffset+(xOffset===0?0:1)),timeOffset+200,timeOffset,'Back to Main Menu', function(){App.ModeHandler.popMode(); levelSelect.requestStaticRenderUpdate = true;}, false, null, null);
	levelSelect.backButton.hoverColor      = '#ff0000';
	levelSelect.backButton.activeColor     = '#800000';
	levelSelect.backButton.activeTextColor = '#ff0000';
	levelSelect.gui.addComponent(levelSelect.backButton);

	levelSelect.alpha = levelSelect.goalAlpha = 0;

		// ---------------------------------------------

	levelSelect.enterFunc = function(){
		levelSelect.requestStaticRenderUpdate = true;
		levelSelect.updatingActive = true;
		levelSelect.exitFlag = false;
		App.GameRenderer.bestFit();

		levelSelect.gui.enter();
		levelSelect.goalAlpha = 1;

		App.Shade.turnOn();
	}

	levelSelect.updateFunc = function(){
		if(levelSelect.gui.update())
			levelSelect.requestStaticRenderUpdate = true;

		if(!levelSelect.requestStaticRenderUpdate)return;
		levelSelect.requestStaticRenderUpdate = false;

		levelSelect.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		levelSelect.gfx.fillStyle = '#fff';
		text(levelSelect.gfx,"Level Select",15,15,36,-3);

		if(levelSelect.gui.render())
			levelSelect.requestStaticRenderUpdate = true;

		if(levelSelect.alpha !== levelSelect.goalAlpha){
			levelSelect.alpha += expInterp(levelSelect.alpha,levelSelect.goalAlpha,0.003,0.01);
			levelSelect.gfx.globalAlpha = levelSelect.alpha;
			levelSelect.requestStaticRenderUpdate = true;
		}

		if(levelSelect.exitFlag && levelSelect.requestStaticRenderUpdate === false){
			levelSelect.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			levelSelect.updatingActive = false;
		}
	}

	levelSelect.exitFunc = function(){
		levelSelect.requestStaticRenderUpdate = true;
		levelSelect.exitFlag = true;

		levelSelect.gui.exit();
		levelSelect.goalAlpha = 0;
	}

		// ---------------------------------------------
	levelSelect.registerKeyDownFunc('Esc',function(){
		levelSelect.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
	});

	levelSelect.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, levelSelect.gui.mouseDown);
	levelSelect.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, levelSelect.gui.mouseUp);
}
