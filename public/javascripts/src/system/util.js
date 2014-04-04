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

//NOT cross-browser compatible.
//Throws a typeError in Chrome
//var print = console.log
