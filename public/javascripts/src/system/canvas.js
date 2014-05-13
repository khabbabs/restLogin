App.createCanvasArray = function(){
	var canvases = {};
	canvases.width = window.innerWidth;
	canvases.height = window.innerHeight;
	canvases.halfWidth;
	canvases.halfHeight;
	canvases.layers = [];

	// adds and returns a new canvas to the canvas array
	canvases.addNewLayer = function(z){
		var layer = document.createElement('canvas');

		layer.width = canvases.width;
		layer.height = canvases.height;
		layer.style.zIndex = z;
		layer.style.position = 'absolute';
		document.body.appendChild(layer);

		canvases.layers.push(layer);
		return layer;
	}

	// resizes all canvases when browser window is resized
	window.onresize = function(){
		canvases.width = window.innerWidth;
		canvases.height = window.innerHeight;
		canvases.halfWidth = canvases.width/2;
		canvases.halfHeight = canvases.height/2;

		for(var i in canvases.layers){
			var layer = canvases.layers[i];
			layer.width = canvases.width;
			layer.height = canvases.height;
		}

		// TODO: everything needs to be re-rendered
		App.GameRenderer.requestStaticRenderUpdate = true;
		App.GameRenderer.requestUltraStaticRenderUpdate = true;
		App.Shade.requestStaticRenderUpdate = true;
		App.ModeHandler.callResizeFuncs();
	}

	return canvases;
}
