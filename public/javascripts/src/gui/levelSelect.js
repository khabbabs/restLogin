App.setupLevelSelect = function(){
	var levelSelect = App.ModeHandler.addNewMode('level select');

		// ---------------------------------------------

	var startLevel = function(lvlStr, id, instlocks){
		App.Game.currentPlanningLevel = App.Game.parseLevel(lvlStr);
		App.Game.currentPlanningLevel.id = id;
		App.GuiInstDrag.lockedInstructions = instlocks;
		App.GameRenderer.bestFit();
		App.ModeHandler.pushMode('planning');
		levelSelect.requestStaticRenderUpdate = true;
	}

	var xOffset=0,yOffset=0,timeOffset=0;

	levelSelect.levelButtons = [];
	var addLevel = function(title, id, level, instlocks){
		if(!instlocks) instlocks = [];
		var btn = new App.GuiTextButton(15+172*xOffset,56+28*yOffset,timeOffset+200,timeOffset,title,function(){startLevel(level, id, instlocks);},false,null,null);
		++xOffset;
		if(xOffset > 2){
			xOffset = 0;
			++yOffset;
		}timeOffset+=30;
		btn.hoverColor      = '#ff0000';
		btn.hoverTextColor  = '#ffffff';
		btn.activeColor     = '#800000';
		btn.activeTextColor = '#ff0000';
		btn.w = 168;
		levelSelect.gui.addComponent(btn);
	}

	levelSelect.sectionText = [];
	var addSection = function(title){
		++yOffset;
		if(xOffset !== 0)++yOffset;
		levelSelect.sectionText.push({y:yOffset,title:title});
		xOffset = 0;
		++yOffset;
	}

	levelSelect.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	levelSelect.gui = new App.guiFrame(levelSelect.gfx);

	// addSection("Misc...");
	// addLevel("Instruction Set" , '0', "AllInstructions`0`10`13~1`1`0`0~2`1`0`1~3`1`0`2~4`1`0`3~1`2`0`4~2`2`0`5~3`2`0`6~4`2`0`7~1`3`0`19~2`3`0`20~3`3`0`21~4`3`0`22~1`4`0`23~2`4`0`24~3`4`0`25~4`4`0`26~1`5`0`27~2`5`0`28~3`5`0`29~4`5`0`30~1`6`0`31~2`6`0`32~3`6`0`33~4`6`0`34~6`1`0`10~7`1`0`11~8`1`0`12~6`2`0`13~7`2`0`14~8`2`0`15~6`3`0`18~6`5`0`16~6`5`1`16~6`5`2`16~6`5`3`16~8`5`0`17~8`5`1`17~8`5`2`17~8`5`3`17~1`8`0`8`A`0~2`8`0`8`B`0~3`8`0`8`C`0~4`8`0`8`D`0~5`8`0`8`E`0~6`8`0`8`F`0~7`8`0`8`G`0~8`8`0`8`H`0~1`9`1`8`I`0~2`9`1`8`J`0~3`9`1`8`K`0~4`9`1`8`L`0~5`9`1`8`M`0~6`9`1`8`N`0~7`9`1`8`O`0~8`9`1`8`P`0~1`10`2`8`Q`0~2`10`2`8`R`0~3`10`2`8`S`0~4`10`2`8`T`0~5`10`2`8`U`0~6`10`2`8`V`0~7`10`2`8`W`0~8`10`2`8`X`0~4`11`3`8`Y`0~5`11`3`8`Z`0",[]);

	addSection("Introductory");
	addLevel("Moving"          , '536de1dc5d67b80b00ca1c4b', "move`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`I`10", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]);
	addLevel("Colors"          , '536de1f65d67b80b00ca1c4d', "move`0`9`9~2`2`0`8`A`random(0,10)~6`6`0`9`X`A`10~2`6`3`8`B`random(0,10)~6`2`3`9`Y`B`10", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]);
	addLevel("Transferring"    , '536de21a5d67b80b00ca1c4f', "trans`0`9`5~2`2`0`8`I`random(0,10)~6`2`2`9`O`I`10",[8, 9, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]); // TODO: QUOTA 0 ON TOGGLES
	addLevel("Incrementing"    , '536de2325d67b80b00ca1c53', "increment`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`I+3`10", [8, 9, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]);
	addLevel("Sign Sort"       , '536de24a5d67b80b00ca1c55', "sgn`0`9`9~2`4`0`8`I`random(0,10)~6`2`0`9`X`I`10~6`6`0`9`Y`I`10", [8, 9, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34]); // TODO: PUT NEW "SORTING" FUNCTIONALITY IN PARSER
	addLevel("Equality Sort"   , '536de2645d67b80b00ca1c57', "equal`0`9`9~2`2`0`8`A`random(0,10)~2`6`0`8`B`random(0,10)~6`4`0`9`O`A`10", [8, 9, 16, 17, 19, 20, 21, 22, 31, 32, 33, 34]); // TODO: PUT NEW "SORTING" FUNCTIONALITY IN PARSER

	// TODO: pause tutorial???
	// TODO: stack operation tutorials
	// TODO: flip flop
	// TODO: toggle tutorial

	addSection("Easy");
	addLevel("Zeroing"         , '536de28d5d67b80b00ca1c59', "zero`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`0`10", [8, 9]);
	addLevel("Mod 2"           , '536de2a25d67b80b00ca1c5b', "mod 2`0`11`5~2`2`0`8`I`random(0,10)~8`2`0`9`O`I%2`10", [8, 9]);

	addSection("Medium");
	addLevel("Negation"        , '536de2b65d67b80b00ca1c5d', "negate`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`-I`10", [8, 9]);
	addLevel("Absoluting"      , '536de2cf5d67b80b00ca1c5f', "abs`0`9`5~2`2`0`8`I`random(0,10)~6`2`0`9`O`abs(I)`10", [8, 9]);
	addLevel("Rounding"        , '536de2e25d67b80b00ca1c61', "round`0`11`5~2`2`0`8`I`random(0,100)~8`2`0`9`O`round(I/10)*10`10", [8, 9]);
	addLevel("Addition"        , '536de2f65d67b80b00ca1c63', "add`0`11`11~2`2`0`8`A`random(0,10)~2`8`1`8`B`random(0,10)~8`5`2`9`O`A+B`10", [8, 9]);
	addLevel("Subtraction"     , '536de3695d67b80b00ca1c65', "sub`0`11`11~2`2`0`8`A`random(0,10)~2`8`1`8`B`random(0,10)~8`5`2`9`O`A-B`10", [8, 9]);
	addLevel("Division"        , '536de37b5d67b80b00ca1c69', "div`0`11`11~2`2`0`8`A`random(0,128)~2`8`1`8`B`random(0,10)~8`5`2`9`O`A/B`10", [8, 9]);
	addLevel("Modding"         , '536de3935d67b80b00ca1c6d', "mod`0`11`11~2`2`0`8`A`random(0,128)~2`8`1`8`B`random(0,10)~8`5`2`9`O`A%B`10", [8, 9]);
	addLevel("Multi-Out Sort"  , '536de58b5d67b80b00ca1c71', "msort`0`11`5", [8, 9]); // TODO: IMPLEMENT THIS

	addSection("Hard");
	addLevel("Multiplication"  , '536de6035d67b80b00ca1c75', "multiply`0`11`11~2`5`3`8`Z`0~5`2`0`8`A`random(0,10)~5`8`1`8`B`random(0,10)~8`5`2`9`O`A*B`10", [8, 9]);
	addLevel("Squaring"        , '536de61e5d67b80b00ca1c77', "square`12342`11`11~2`2`0`8`I`random(1,12)~2`8`1`8`Z`0~8`5`2`9`O`I*I`10", [8, 9]);
	addLevel("Cubing"          , '536de65c5d67b80b00ca1c79', "cube`456`11`11~2`2`0`8`I`random(1,6)~2`8`1`8`Z`0~8`5`2`9`O`I*I*I`10", [8, 9]);
	addLevel("Factorial"       , '536de6745d67b80b00ca1c7b', "fact`12344`11`11~2`2`0`8`I`random(1,6)~2`8`1`8`Z`0~8`5`2`9`O`fac(I)`10", [8, 9]);
	addLevel("Single-Out Sort" , '536de6915d67b80b00ca1c7d', "ssort`0`11`5", [8, 9]); // TODO: IMPLEMENT THIS

	levelSelect.backButton 	= new App.GuiTextButton(15,56,timeOffset+200,timeOffset,'Back to Main Menu', function(){App.ModeHandler.popMode(); levelSelect.requestStaticRenderUpdate = true;}, false, null, null);
	levelSelect.backButton.hoverColor      = '#ff0000';
	levelSelect.backButton.hoverTextColor  = '#ffffff';
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
		App.GuiInstDrag.lockedInstructions = [];
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
		levelSelect.gfx.fillStyle = '#f00';
		for(var i in levelSelect.sectionText)
			text(levelSelect.gfx,levelSelect.sectionText[i].title,15,56+28*levelSelect.sectionText[i].y+3,18,-2);

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
