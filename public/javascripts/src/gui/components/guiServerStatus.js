/*
For displaying leaderboards and level select.
*/


App.GuiServerStatus = function(x, y, successFunc, failFunc){
	App.GuiTools.Component.call(this, x, y, 200, 24, 100, 100, 'center' , null);

	this.waiting = 0.0;
	this.waiting2 = 0;
	this.waiting3 = 0;
	this.docycle = true;
	this.mode = 'waiting';
	this.functional = true;
	this.errormsg = '';
	this.successFunc = successFunc;
	this.failFunc = failFunc;
	this.colorlerp = 255;
	this.dotCoords = [];
	var i=0;
	for(var j = -100; j < 100; j+=20){
		this.dotCoords[i]    = {x:j,   y:-100};
		this.dotCoords[i+10] = {x:100, y:j};
		this.dotCoords[i+20] = {x:0-j, y:100};
		this.dotCoords[i+30] = {x:-100,y:0-j};
		i++;
	}

	var step = Math.PI/20;
	//this.functional = true;


	this.reset = function(){
		this.waiting = 0.0;
		this.waiting2 = 0;
		this.docycle = true;
		this.mode = 'waiting';
		this.errormsg = '';
		this.colorlerp = 255;
	}
	this.clickStart = function(){
		if(this.mode !== 'waiting'){
		}
	};

	//offset for the confirm button below the main thing
	delete(this.collides);
	this.collides = function(x, y){
		return ((x > this.getx()) && (x < (this.getx() + this.w)) &&
			   	(y > this.gety() + 150) && (y < (this.gety() + 174)));
	}
	this.clickEnd = function(){
		if(this.mode == 'success'){
			if(this.successFunc)
				this.successFunc();
		}
		else if(this.mode == 'failure'){
			if(this.failFunc)
				this.failFunc();
		}
	};


	var that = this;
	delete(this.renderLayers['Rect']);
	this.renderLayers['Server'] = function(gfx){
		switch(that.mode){
			case 'waiting':
				that.renderWaiting(gfx);
				break;
			case 'success':
				that.renderSuccess(gfx);
				break;
			case 'failure':
				that.renderFailure(gfx);
				break;
		}
	}

	this.renderWaiting = function(gfx){
		var alpha = 1;
		var stepper = this.waiting3;
		for(var k = 0; k <= 40; k ++){
			gfx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
			var x = this.dotCoords[stepper].x + this.getx() + this.w/2;
			var y = this.dotCoords[stepper].y + this.gety() + this.h/2;
			gfx.fillRect(x, y, 10, 10);
			stepper  --;
			if(stepper < 0) stepper = this.dotCoords.length-1;
			alpha -= 0.025;
		}

		var txt = "Please Wait ";
		if(this.waiting2 > 20) txt += '.';
		if(this.waiting2 > 40) txt += '.';
		if(this.waiting2 > 60) txt += '.';

		gfx.fillStyle = "#ffffff";
		text(gfx, txt, this.getx() + this.w/2 - 54, this.gety() + this.h/2 - 9, 18, -2);
	}

	this.renderSuccess = function(gfx){
		var stepper = this.waiting3;
		gfx.fillStyle = 'rgba(' + this.colorlerp + ',255,'+ this.colorlerp + ',1)';
		for(var k = 0; k <= 40; k ++){
			var x = this.dotCoords[stepper].x + this.getx() + this.w/2;
			var y = this.dotCoords[stepper].y + this.gety() + this.h/2;
			gfx.fillRect(x, y, 10, 10);
			stepper  --;
			if(stepper < 0) stepper = this.dotCoords.length-1;
		}

		var txt = "Success!"
		text(gfx, txt, this.getx() + this.w/2 - 54, this.gety() + this.h/2 - 9, 18, -2);
		gfx.fillStyle = this.color;
		gfx.fillRect(this.getx(), this.gety()+150, this.w, this.h);
		gfx.fillStyle = this.textColor;
		text(gfx, 'Continue', this.getx() + this.w/2 - 100 + 2, this.gety() + 150 + 3, 18, -1);
	}

	this.renderFailure = function(gfx){
		var stepper = this.waiting3;
		gfx.fillStyle = 'rgba(255,' + this.colorlerp + ',' + this.colorlerp + ',1)';
		for(var k = 0; k <= 40; k ++){
			var x = this.dotCoords[stepper].x + this.getx() + this.w/2;
			var y = this.dotCoords[stepper].y + this.gety() + this.h/2;
			gfx.fillRect(x, y, 10, 10);
			stepper  --;
			if(stepper < 0) stepper = this.dotCoords.length-1;
		}

		text(gfx, 'Failed', this.getx() + this.w/2 - 32, this.gety() + this.h/2 - 9, 18, -2);
		text(gfx, that.errormsg, this.getx() + this.w/2 - 100, this.gety() + 130, 10, -1);
		gfx.fillStyle = this.color;
		gfx.fillRect(this.getx(), this.gety()+150, this.w, this.h);
		gfx.fillStyle = this.textColor;
		text(gfx, 'Continue', this.getx() + this.w/2 - 100 + 2, this.gety() + 150 + 3, 18, -1);
	}

	this.update = function(){
		if(this.docycle){
			this.waiting += step/2;
			this.waiting3++;
			if(this.waiting3 >= this.dotCoords.length){
				this.waiting3 = 0;
			}
			if(this.waiting >= 2*Math.PI){
				this.waiting = 0;
				if(!(this.mode == 'waiting'))
					this.docycle = false;
			}
			this.waiting2++;
			if(this.waiting2 > 80)
				this.waiting2 = 0;
			return true;
		}
		else{
			this.colorlerp-= 20;
			if(this.colorlerp < 0)
				this.colorlerp = 0;
		}
	}

	this.callback = function(success, message){
		if(success)
			this.mode = 'success';
		else{
			this.mode = 'failure';
			this.errormsg = message;
		}
	}
}
App.GuiServerStatus.prototype = Object.create(g.Component);
App.GuiServerStatus.prototype.constructor = App.GuiServerStatus;