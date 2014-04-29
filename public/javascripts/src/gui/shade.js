App.makeShade = function(){
	var shade = {};
	shade.gfx = App.Canvases.addNewLayer(1).getContext('2d');
	shade.requestStaticRenderUpdate = true;
	shade.alpha = 1;
	shade.goalAlpha = 0.5;

	shade.turnOn = function(){
		shade.goalAlpha = 0.5;
		shade.requestStaticRenderUpdate = true;
	}

	shade.turnOff = function(){
		shade.goalAlpha = 0;
		shade.requestStaticRenderUpdate = true;
	}

	shade.staticRender = function(){
		if(!shade.requestStaticRenderUpdate)return;
		shade.requestStaticRenderUpdate = false;

		shade.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
		shade.alpha += expInterp(shade.alpha,shade.goalAlpha,0.002,0.01);
		shade.gfx.globalAlpha = shade.alpha;
		shade.gfx.fillStyle = '#000000';
		shade.gfx.fillRect(0,0,App.Canvases.width,App.Canvases.height);
		if(shade.alpha !== shade.goalAlpha)shade.requestStaticRenderUpdate = true;
	}

	return shade;
}
