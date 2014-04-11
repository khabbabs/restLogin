
/*Creates a Gui object that:
1. tracks 'frames', i.e. menus and gameplay UI interfaces, implemented as arrays of components
2. allows adding a new frame (creates an empty array)
3. allows adding components to frames
4. allows switching between frames
5. updates components in current frame that have an update method
6. renders components in current frame that have a render method (all should)
*/
App.makeGUI = function(){
	var gui = {};
	gui.staticGfx = App.Canvases.addNewLayer('GUI_Static',0);
	//Only used to draw the currently active component
	//if this is bad, we can change it.
	gui.dynamicGfx = App.Canvases.addNewLayer('GUI_Dynamic',0);

	gui.frames = [];
	gui.currentFrame;
	gui.activeComponent = null;
	//gets reset after one frame.
	gui.drawStatic = true;

	gui.overlayGfx = App.Canvases.addNewLayer('GUI_Overlay',0);
	gui.overlayClear = false;
	//We might want to draw multiple overlays at a time...
	gui.overlays = [];
	//overlays block other gui inputs and the game (and other overlays) from receiving any input
	//for simplicity, they are rendered on their own canvas, and are themselves essentially 'frames'
	gui.startOverlay = function(overlay){
		this.overlays.push(overlay);
		this.overlayClear = true;
	}

	gui.endOverlay = function(){
		this.overlays.pop();
	}

	gui.isOverlayDrawing = function(){
		return this.overlays.length !== 0;
	}

	gui.getActiveOverlay = function(){
		if(this.isOverlayDrawing())
			return this.overlays[this.overlays.length - 1];
		return null;
	}

	gui.addNewFrame = function(framekey){
		if(this.frames[framekey]){
			console.error('tried to bind two frames to a single key: ' + framekey);
			return;
		}
		this.frames[framekey] = [];

		if(!this.currentFrame)
			this.currentFrame = this.frames[framekey];
	}

	gui.setCurrentFrame = function(framekey){
		this.currentFrame = (this.frames[framekey]) ? this.frames[framekey] : this.currentFrame;
		this.activeComponent = null;
		this.ensurePositions();
		setTimeout(function(){App.Gui.drawStatic = true}, 100);
	}

	gui.addNewComponent = function(framekey, component){
		if(!this.frames[framekey])
			console.error('cannot add a component to nonexistent frame: ' + framekey);
		this.frames[framekey].push(component);
		if(this.frames[framekey] == this.currentFrame)
			this.drawStatic = true;
	}

	gui.testCoordinates = function(x,y){

		if(this.isOverlayDrawing()){
			var dRet = null;
			for(var d in this.overlays){
				for(var c in this.overlays[d]){
					if(this.overlays[d][c].guiCollider && this.overlays[d][c].guiCollider.collides(x, y)){
						if(this.overlays[d][c].guiCollider.functional){
							return this.overlays[d][c];
						}
						else dRet = this.currentFrame[c];
					}
				}
			}
			if(dRet !== null)
				return dRet;
		}

		var ret = null;
		for(var c in this.currentFrame){
			if(this.currentFrame[c].guiCollider && this.currentFrame[c].guiCollider.collides(x, y)){
					if(this.currentFrame[c].guiCollider.functional){
						ret = this.currentFrame[c];
						return ret;
					}
					else ret = this.currentFrame[c];

			}
		}
		return ret;
	}

	gui.update = function(){
		for(var c in this.currentFrame)if(this.currentFrame[c].update)
			this.currentFrame[c].update();
	}

	gui.ensurePositions = function(){
		this.drawStatic = true;
		for(var o in this.overlays){
			for(var c in this.overlays[o]){
				if(this.overlays[o][c].updatePosition)
					this.overlays[o][c].updatePosition();
			}
		}

		for(var c in this.currentFrame) {

			if(this.currentFrame[c].updatePosition)
				this.currentFrame[c].updatePosition();
			if(this.currentFrame[c].windowupdate)
				this.currentFrame[c].windowupdate();
		}
	}

	gui.render = function(){
		if(this.overlayClear){
			this.overlayGfx.clearRect(0,0,App.Canvases.width, App.Canvases.height);
			if(this.isOverlayDrawing()){
				for(var d in this.overlays){
					for(var c in this.overlays[d]){
						this.overlays[d][c].render(this.overlayGfx);
					}
				}
			}
			else this.overlayClear = false;
		}

		this.dynamicGfx.clearRect(0,0,App.Canvases.width, App.Canvases.height);

		if(this.drawStatic){
			this.staticGfx.clearRect(0,0,App.Canvases.width, App.Canvases.height);
		}

		for(var c in this.currentFrame){
			if(this.currentFrame[c].render){
				if(this.currentFrame[c] === this.activeComponent){
					this.dynamicGfx.font = App.Canvases.font;
					this.currentFrame[c].render(this.dynamicGfx);
				}
				else if(this.drawStatic){
					this.staticGfx.font = App.Canvases.font;
					this.currentFrame[c].render(this.staticGfx);
				}
			}
		}

		this.drawStatic = false;
	}

	return gui;
}

