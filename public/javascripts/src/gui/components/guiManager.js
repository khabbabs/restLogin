
/*Creates a Gui object that:
3. allows adding components
5. updates components that have an update method
6. renders components that have a render method (all should)
*/
App.guiFrame = function(gfx){
	this.gfx = gfx;
	this.frame = [];
	this.lastActive = null;

	//gets reset after one frame.
	var that = this;

	this.enter = function(){
		for(var c in this.frame){
			this.frame[c].enter();
		}
	}

	this.exit = function(){
		for(var c in this.frame){
			this.frame[c].exit();
		}
	}

	this.addComponent = function(comp){
		this.frame.push(comp);
		comp.gui = this;
	}

	this.removeComponent = function(comp){
		var index = this.frame.indexOf(comp);
		if (index > -1) {
			this.frame.splice(index, 1);
		}
	}

	this.testCoordinates = function(x,y){
		var ret = {f:[],p:[]};
		for(var c in this.frame){
			if(this.frame[c].collides(x, y)){
					if(this.frame[c].functional)
						ret.f.push(this.frame[c]);
					else
						ret.p.push(this.frame[c]);
			}
		}
		return ret;
	}

	//lmb must be true or false. if it's false, it will block input but not do anything
	this.mouseDown = function(x, y){
		that.lastActive = null;
		var comps = that.testCoordinates(x, y);
		if(!comps.f && !comps.p)
			return false;

		for(var fn in comps.f){
			if(comps.f[fn].locked) continue;
			comps.f[fn]._clickStart();
			comps.f[fn].clickStart();
		}
		return true;
	}

	//Only needs to be called when lmb is released. Returns nothing.
	this.mouseUp = function(x, y){
		var comps = that.testCoordinates(x, y);

		for(var fn in comps.f){
			if(comps.f[fn].locked) continue;
			comps.f[fn].clickEnd();
		}
		for(var f in that.frame)
			that.frame[f]._clickEnd();
		for(var f in that.overlay)
			that.overlay[f]._clickEnd();
	}

	this.update = function(){
		var flag = false;
		for(var c in this.frame)if(this.frame[c].update){
			if(this.frame[c]._update()) flag = true; //if we need to render
			if(this.frame[c].update()) flag = true;
		}
		return flag;
	}

	this.windowResized = function(){
		that.drawStatic = true;

		for(var c in that.frame) {
			if(that.frame[c].updatePosition)
				that.frame[c].updatePosition();
		}
	}

	this.render = function(){
		var flag = false;

		for(var c in this.frame){
			if(this.frame[c].render){
				if(this.frame[c].render(this.gfx))
					flag = true;

			}
		}

		return flag;
	}
}

