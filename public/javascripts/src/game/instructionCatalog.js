App.makeInstructionCatalog = function(){
	var ins = {};

	// Instruction type id's
	// TODO: ALL SWITCHES NEED UP DOWN LEFT RIGHT
	ins.TYPES = {
	// --------------------------------------------- AUTOMATON SPAWN
		'SPAWN UP'	: 0,		'SPAWN DOWN'	: 1,
		'SPAWN LEFT'	: 2,		'SPAWN RIGHT'	: 3,
	// ------------------------------------------- DIRECTION CONTROL
		'UP'		: 4,		'DOWN'		: 5,
		'LEFT'		: 6,		'RIGHT'		: 7,
		'ROTATE CW'	: 8,		'ROTATE CCW'	: 9,
	// ---------------------------------------------------- TOKEN IO
		'IN STREAM'	: 10,		'OUT STREAM'	: 11,
		'IN'		: 12,		'OUT'		: 13,
	// ------------------------------------------ TOKEN MANIPULATION
		'GRAB'		: 14,		'DROP'		: 15,
		'GRAB/DROP'	: 16,		'INC'		: 17,
		'DEC'		: 18,
	// ----------------------------------------- CONDITIONAL CONTROL
		'COND 0'	: 19,		'COND +-'	: 20,
		'COND EVEN ODD'	: 21,
	// -------------------------------------------------------- MISC
		'SYNC'		: 22,		'COLOR TOGGLE'	: 23,
		'PAUSE'		: 24,
	};

	ins.render = function(gfx,type,x,y,c,size,selected,copied,moving){
		gfx.save();
		gfx.translate(x,y);

		// TODO: SPECIAL RENDER FUNCS (STREAM, SYNC)

		switch(c){
			case App.COLORS.RED:
				gfx.fillStyle='#660000';
				gfx.fillRect(2,2,size-4,size-4);
				gfx.strokeStyle='#ff0000';
				break;
			case App.COLORS.GREEN:
				gfx.fillStyle='#006600';
				gfx.fillRect(2,2,size-4,size-4);
				gfx.strokeStyle='#00ff00';
				break;
			case App.COLORS.BLUE:
				gfx.fillStyle='#000066';
				gfx.fillRect(2,2,size-4,size-4);
				gfx.strokeStyle='#0000ff';
				break;
			case App.COLORS.YELLOW:
				gfx.fillStyle='#666600';
				gfx.fillRect(2,2,size-4,size-4);
				gfx.strokeStyle='#ffff00';
				break;
		}

		// turn tile background white if selected
		if(selected){
			gfx.fillStyle = '#ffffff';
			gfx.fillRect(2,2,size-2,size-2);

			// turn tile background green if it is in the proccess of being moved
			if(moving){
				gfx.fillStyle = '#00cc33';
				gfx.fillRect(2,2,size-2,size-2);
			}

			// turn tile background cyan if it is in the proccess of being copied
			if(copied){
				gfx.fillStyle = '#00ffcc';
				gfx.fillRect(2,2,size-2,size-2);
			}
		}

		gfx.beginPath();
		gfx.moveTo(2,2);
		gfx.lineTo(2,size-2);
		gfx.lineTo(size-2,size-2);
		gfx.lineTo(size-2,2);
		gfx.lineTo(2,2);
		gfx.stroke();

		if(size>15)ins.rFunc[type](gfx,size);
		gfx.restore();
	}

	// ========================================================== //
	// ================= I N S T R U C T I O N S ================ //
	// ========================================================== //

	ins.rFunc = {
	//	ins.TYPES['SPAWN UP']:function(){
		0:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/8,-Math.PI,Math.PI);
			gfx.moveTo(3*cs/8,2*cs/8);
			gfx.lineTo(4*cs/8,cs/8);
			gfx.lineTo(5*cs/8,2*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['SPAWN DOWN']:function(){
		1:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/8,-Math.PI,Math.PI);
			gfx.moveTo(3*cs/8,6*cs/8);
			gfx.lineTo(4*cs/8,7*cs/8);
			gfx.lineTo(5*cs/8,6*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['SPAWN LEFT']:function(){
		2:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/8,-Math.PI,Math.PI);
			gfx.moveTo(2*cs/8,3*cs/8);
			gfx.lineTo(cs/8,4*cs/8);
			gfx.lineTo(2*cs/8,5*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['SPAWN RIGHT']:function(){
		3:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/8,-Math.PI,Math.PI);
			gfx.moveTo(6*cs/8,3*cs/8);
			gfx.lineTo(7*cs/8,4*cs/8);
			gfx.lineTo(6*cs/8,5*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['UP']:function(){
		4:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(cs/2,cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['DOWN']:function(){
		5:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/2,3*cs/4);
			gfx.lineTo(cs/4,cs/4);
			gfx.lineTo(3*cs/4,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['LEFT']:function(){
		6:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(cs/4,cs/2);
			gfx.stroke();
		},

	//	ins.TYPES['RIGHT']:function(){
		7:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(3*cs/4,cs/2);
			gfx.lineTo(cs/4,cs/4);
			gfx.lineTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.stroke();
		},

	//	ins.TYPES['ROTATE CW']:function(){
		8:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/4,Math.PI/2,2*Math.PI);
			gfx.moveTo(3*cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['ROTATE CCW']:function(){
		9:function(gfx,cs){
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/4,Math.PI,Math.PI/2);
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(cs/4,cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['IN STREAM']:
		10:function(gfx,cs){
			// TODO: override render func
			// TODO: make letters for each stream
			gfx.beginPath();
			gfx.moveTo(3*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(1*cs/4,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['OUT STREAM']:
		11:function(gfx,cs){
			// TODO: override render func
			// TODO: make letters for each stream
			gfx.beginPath();
			gfx.moveTo(3*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(1*cs/4,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['IN']:function(){
		12:function(gfx,cs){
			// TODO: this should NOT be an 'I' (streams get letters as symbols)
			gfx.beginPath();
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(cs/4,cs/4);
			gfx.lineTo(3*cs/4,cs/4);
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['OUT']:function(){
		13:function(gfx,cs){
			// TODO: this should NOT be an 'O' (streams get letters as symbols)
			gfx.beginPath();
			gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);
			gfx.stroke();
		},

	//	ins.TYPES['GRAB']:function(){
		14:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(cs/2,cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['DROP']:function(){
		15:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['GRAB/DROP']:function(){
		16:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(cs/2,cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();
		},

	//	ins.TYPES['INC']:function(){
		17:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['DEC']:function(){
		18:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.stroke();
		},

	//	ins.TYPES['COND 0']:
		19:function(gfx,cs){
			// TODO: UP DOWN LEFT RIGHT
			gfx.beginPath();
/*
			gfx.fillStyle='#0F0F0F';
			gfx.strokeStyle='#FF0000';

			gfx.moveTo(12*cs/64,16*cs/64);
			gfx.lineTo(52*cs/64,16*cs/64);

			gfx.moveTo(52*cs/64,16*cs/64);
			gfx.lineTo(52*cs/64,24*cs/64);

			gfx.moveTo(52*cs/64,24*cs/64);
			gfx.lineTo(20*cs/64,24*cs/64);

			gfx.moveTo(20*cs/64,24*cs/64);
			gfx.lineTo(20*cs/64,28*cs/64);

			gfx.moveTo(20*cs/64,28*cs/64);
			gfx.lineTo(52*cs/64,28*cs/64);

			gfx.moveTo(52*cs/64,28*cs/64);
			gfx.lineTo(52*cs/64,48*cs/64);

			gfx.moveTo(52*cs/64,48*cs/64);
			gfx.lineTo(12*cs/64,48*cs/64);

			gfx.moveTo(12*cs/64,48*cs/64);
			gfx.lineTo(12*cs/64,40*cs/64);

			gfx.moveTo(12*cs/64,40*cs/64);
			gfx.lineTo(44*cs/64,40*cs/64);

			gfx.moveTo(44*cs/64,40*cs/64);
			gfx.lineTo(44*cs/64,36*cs/64);

			gfx.moveTo(44*cs/64,36*cs/64);
			gfx.lineTo(12*cs/64,36*cs/64);

			gfx.moveTo(12*cs/64,36*cs/64);
			gfx.lineTo(12*cs/64,16*cs/64);
*/
			gfx.stroke();
			gfx.closePath();
		},

	//	ins.TYPES['COND +-']:
		20:function(gfx,cs){
			// TODO: UP DOWN LEFT RIGHT
			gfx.beginPath();
			gfx.stroke();
		},

	//	ins.TYPES['COND EVEN ODD']:
		21:function(gfx,cs){
			// TODO: UP DOWN LEFT RIGHT
/*
			gfx.fillStyle='#0F0F0F';
			gfx.fillRect(0,0,cs/2,cs/2);

			gfx.strokeStyle='#AAAAAA';
			gfx.strokeRect(0,0,cs/2,cs/2);

			gfx.fillStyle='#F0F0F0';
			gfx.fillRect(cs/2,0,cs/2,cs/2);

			gfx.strokeRect(cs/2,0,cs/2,cs/2);

			gfx.fillStyle='#F0F0F0';
			gfx.fillRect(0,cs/2,cs/2,cs/2);

			gfx.strokeRect(0,cs/2,cs/2,cs/2);

			gfx.fillStyle='#0F0F0F';
			gfx.fillRect(cs/2,cs/2,cs/2,cs/2);

			gfx.strokeRect(cs/2,cs/2,cs/2,cs/2);
			gfx.stroke();
*/
		},

	//	ins.TYPES['SYNC']:
		22:function(gfx,cs){
			// TODO: override render | custom syms for each color
/*
			staticRender = function(){
				gfx.save();
				gfx.beginPath();
				switch(color){
					case App.COLORS.RED:
						gfx.translate(x*cs,y*cs);
						gfx.fillStyle='#660000';
						gfx.strokeStyle='#ff0000';
						gfx.moveTo(2,cs-2);
						gfx.lineTo(2,2);
						gfx.lineTo(cs-2,2);
						if(App.Game.cellSize>30){
							gfx.lineTo(cs-2,cs/2);
							gfx.lineTo(cs/2,cs/2);
							gfx.lineTo(cs/2,cs-2);
							gfx.lineTo(2,cs-2);
						}else{
							gfx.lineTo(cs-2,cs-2);
							gfx.lineTo(2,cs-2);
						}
						break;
					case App.COLORS.GREEN:
						gfx.translate(x*cs+cs,y*cs);
						gfx.fillStyle='#006600';
						gfx.strokeStyle='#00ff00';
						gfx.moveTo(2,2);
						gfx.lineTo(cs-2,2);
						gfx.lineTo(cs-2,cs-2);
						if(App.Game.cellSize>30){
							gfx.lineTo(cs/2,cs-2);
							gfx.lineTo(cs/2,cs/2);
							gfx.lineTo(2,cs/2);
							gfx.lineTo(2,2);
						}else{
							gfx.lineTo(2,cs-2);
							gfx.lineTo(2,2)
						}
						break;
					case App.COLORS.BLUE:
						gfx.translate(x*cs,y*cs+cs);
						gfx.fillStyle='#000066';
						gfx.strokeStyle='#0000ff';
						gfx.moveTo(cs-2,cs-2);
						gfx.lineTo(2,cs-2);
						gfx.lineTo(2,2);
						if(App.Game.cellSize>30){
							gfx.lineTo(cs/2,2);
							gfx.lineTo(cs/2,cs/2);
							gfx.lineTo(cs-2,cs/2);
							gfx.lineTo(cs-2,cs-2);
						}else{
							gfx.lineTo(cs-2,2);
							gfx.lineTo(cs-2,cs-2);
						}
						break;
					case App.COLORS.YELLOW:
						gfx.translate(x*cs+cs,y*cs+cs);
						gfx.fillStyle='#666600';
						gfx.strokeStyle='#ffff00';
						gfx.moveTo(cs-2,2);
						gfx.lineTo(cs-2,cs-2);
						gfx.lineTo(2,cs-2);
						if(App.Game.cellSize>30){
							gfx.lineTo(2,cs/2);
							gfx.lineTo(cs/2,cs/2);
							gfx.lineTo(cs/2,2);
							gfx.lineTo(cs-2,2);
						}else{
							gfx.lineTo(2,2);
							gfx.lineTo(cs-2,2);
						}
						break;
				}gfx.fill();
				gfx.stroke();

				gfx.restore();
*/
		},

	//	ins.TYPES['COLOR TOGGLE']:function(){
		23:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(1*cs/4,1*cs/4);
			gfx.lineTo(3*cs/4,1*cs/4);
			gfx.moveTo(2*cs/4,1*cs/4);
			gfx.lineTo(2*cs/4,3*cs/4);
			gfx.stroke();
		},

	//	ins.TYPES['PAUSE']:function(){
		24:function(gfx,cs){
			gfx.beginPath();
			gfx.moveTo(1*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,2*cs/4);
			gfx.lineTo(3*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,1*cs/4);
			gfx.lineTo(1*cs/4,3*cs/4);
			gfx.stroke();
		}
	};

	return ins;
}

/*

*/
