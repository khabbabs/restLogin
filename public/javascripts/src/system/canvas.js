App.createCanvasArray = function(){
	var canvases = {};
	canvases.width;
	canvases.height;
	canvases.halfWidth;
	canvases.halfHeight;
	canvases.layers = [];
	canvases.gfxs = [];
	canvases.font = '12px Futurastd';

	// adds and returns a new canvas to the canvas array
	canvases.addNewLayer = function(name,z){
		var layer = document.createElement('canvas');
		layer.id = name;
		layer.width = this.width;
		layer.height = this.height;
		layer.style.zIndex = z;
		layer.style.position = 'absolute';

		//I like this font. It's not, of course, mandatory that we use it. Just please, not a monospace font in the game... lol
		layer.getContext('2d').font = canvases.font;
		document.body.appendChild(layer);

		this.layers[name] = layer;
		this.gfxs[name] = layer.getContext('2d');
		return this.gfxs[name]; //skip the middleman for most of these...
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
		if(App.Game)App.Game.requestStaticRenderUpdate = true;
		if(App.Gui)App.Gui.ensurePositions();
	}

	canvases.textMetrics = function(text){
		for(var i in this.layers){ //sadly, this is the only way I know how to do this with string keys
			return this.layers[i].getContext('2d').measureText(text); //only returns one thing obviously
		}
	}

	canvases.clear = function(name){
		this.gfxs[name].clearRect(0, 0, this.width, this.height);
	}

	window.onresize(); // initializes width and height on page-load
	return canvases;
}
