App.SimulationToken = function(level,x,y,number){
	level.tokens.push(this);

	this.number = number;

	this.add = function(num){this.number+=num;while(this.number> 127)this.number-=256;}
	this.sub = function(num){this.number-=num;while(this.number<-128)this.number+=256;}

	this.rFunc = function(x,y,gfx){
		App.renderToken(gfx,x,y,this.number);
	}

	this.staticRender = function(x,y){this.rFunc(x,y,App.GameRenderer.tokenSGfx);}
	this.dynamicRender = function(x,y){this.rFunc(x,y,App.GameRenderer.tokenDGfx);}
}
