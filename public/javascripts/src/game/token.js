App.renderToken = function(gfx,x,y,num,size){
	gfx.lineCap  = 'round';
	gfx.lineJoin = 'round';

	var cs = size === undefined?App.GameRenderer.cellSize:size;

	gfx.fillStyle = '#ffffff';
	gfx.strokeStyle = '#aaaaaa';
	gfx.lineWidth = 2;
	gfx.beginPath();
	gfx.arc(x+cs/2,y+cs/2,13*cs/32,-Math.PI,Math.PI);
	gfx.fill();
	gfx.stroke();

	gfx.strokeStyle = '#404040';
	gfx.lineWidth = (Math.round(Math.log(cs/3)/Math.log(2)+2)-5)*2;

	if(num === undefined)return;

	gfx.save();
	var str = num.toString();
	gfx.translate(x+Math.floor(17*cs/32-str.length*3*cs/32),y);
	for(var i=0;i<str.length;++i){
		switch(num.toString().charAt(i)){
			case '1':
				gfx.beginPath();
				gfx.moveTo(0     ,3*cs/8);
				gfx.lineTo(cs/16 ,3*cs/8);
				gfx.lineTo(cs/16 ,5*cs/8);
				gfx.moveTo(0     ,5*cs/8);
				gfx.lineTo(cs/8  ,5*cs/8);
				gfx.stroke();
				break;
			case '2':
				gfx.beginPath();
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.lineTo(0    ,4*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.stroke();
				break;
			case '3':
				gfx.beginPath();
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.moveTo(0    ,4*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.stroke();
				break;
			case '4':
				gfx.beginPath();
				gfx.moveTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(0    ,4*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.stroke();
				break;
			case '5':
				gfx.beginPath();
				gfx.moveTo(cs/8 ,3*cs/8);
				gfx.lineTo(0    ,3*cs/8);
				gfx.lineTo(0    ,4*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.stroke();
				break;
			case '6':
				gfx.beginPath();
				gfx.moveTo(cs/8 ,3*cs/8);
				gfx.lineTo(0    ,3*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.lineTo(0    ,4*cs/8);
				gfx.stroke();
				break;
			case '7':
				gfx.beginPath();
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.stroke();
				break;
			case '8':
				gfx.beginPath();
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.lineTo(0    ,3*cs/8);
				gfx.moveTo(0    ,4*cs/8);
				gfx.lineTo(cs/8 ,4*cs/8);
				gfx.stroke();
				break;
			case '9':
				gfx.beginPath();
				gfx.moveTo(cs/8 ,4*cs/8);
				gfx.lineTo(0    ,4*cs/8);
				gfx.lineTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.stroke();
				break;
			case '0':
				gfx.beginPath();
				gfx.moveTo(0    ,3*cs/8);
				gfx.lineTo(cs/8 ,3*cs/8);
				gfx.lineTo(cs/8 ,5*cs/8);
				gfx.lineTo(0    ,5*cs/8);
				gfx.lineTo(0    ,3*cs/8);
				gfx.stroke();
				break;
			case '-':
				gfx.beginPath();
				gfx.moveTo(0    ,cs/2);
				gfx.lineTo(cs/8 ,cs/2);
				gfx.stroke();
				break;
		}gfx.translate(3*cs/16,0);
	}

	gfx.restore();
}
