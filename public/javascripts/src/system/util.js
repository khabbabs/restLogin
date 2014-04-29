// should fmod and addr be in App...?

function fmod(a,b){ // you should only be using this for integer values
	var c=a%b;
	if(c<0)return c+b;
	return c;
}

function addr(i,dimension){
	if(dimension===0)return i;
	return fmod(i,dimension);
}

function expInterp(val,goal,speed,threshold){
	var factor = App.Engine.elapsed*speed;
	if(factor>1)factor=1;
	var retVal = (goal-val)*factor;
	if(Math.abs(val+retVal-goal)<threshold)retVal=goal-val;
	return retVal;
}

function textWidth(gfx, string, size, spacing){
	gfx.font = "800 "+size*1.37+"px arial";
	return gfx.measureText(string).width + (spacing * (string.length-1));
}

//draws a special subsection a certain color if specified
function text(gfx,string,x,y,size,spacing){
	gfx.textBaseline = "alphabetic";
	gfx.font = "800 "+size*1.37+"px arial";
	for(var i=0;i<string.length;++i){

		gfx.fillText(string.charAt(i),x,y+size);
		x += gfx.measureText(string.charAt(i)).width+spacing;
	}
}
