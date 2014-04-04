App.SimulationToken = function(level,x,y,number){
	level.tokens.push(this);
	level.getCell(x,y).tokens.push(this);

	this.gfxS = App.Game.tokenSGfx;
	this.gfxD = App.Game.tokenDGfx;
	this.number = number;

	this.rFunc = function(x,y,gfx){
		var cs = App.Game.cellSize;

		gfx.fillStyle = '#ffffff';
		gfx.beginPath();
		gfx.arc(x+cs/2,y+cs/2,7*cs/16,-Math.PI,Math.PI);
		gfx.fill();

		gfx.fillStyle = '#000000';
		gfx.fillText(this.number,x+cs/2,y+cs/2+App.Game.cellSize/32);
	}

	this.staticRender = function(x,y){this.rFunc(x,y,this.gfxS);}
	this.dynamicRender = function(x,y){this.rFunc(x,y,this.gfxD);}
}
