App.makeEngine = function(){
	var engine = {};
	engine.tick    = 0;
	engine.elapsed = 0;
	engine.fps     = 0;

	engine.run = function(){
		window.onresize();
		engine.tick = new Date().getTime();
		engine.elapsed = 1;

		App.loadDemo();
		App.ModeHandler.pushMode('main menu');
		requestAnimationFrame(engine.frame);
	};

	engine.frame = function(){
		requestAnimationFrame(engine.frame);
		var currentTick = new Date().getTime();
		engine.elapsed = currentTick - engine.tick;
		engine.tick = currentTick;
		if (engine.elapsed>0) engine.fps = 1000/engine.elapsed;

		App.Game.update();
		App.GameRenderer.render();
		App.ModeHandler.update();
		App.Shade.staticRender();
	};

	return engine;
}
