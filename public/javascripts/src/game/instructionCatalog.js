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
	// ---------------------------------------------------- TOKEN IO
		'IN'		: 8,		'OUT'		: 9,
	// ------------------------------------------ TOKEN MANIPULATION
		'GRAB'		: 10,		'DROP'		: 11,
		'GRAB/DROP'	: 12,		'INC'		: 13,
		'DEC'		: 14,
	// -------------------------------------------------------- MISC
		'SYNC'		: 15,		'COLOR TOGGLE'	: 16,
		'PAUSE'		: 17,
	// ----------------------------------------- CONDITIONAL CONTROL
		'COND 0 U'	: 18,		'COND 0 D'	: 19,
		'COND 0 L'	: 20,		'COND 0 R'	: 21,
		'COND TOKEN U'	: 22,		'COND TOKEN D'	: 23,
		'COND TOKEN L'	: 24,		'COND TOKEN R'	: 25,
		'COND + U'	: 26,		'COND + D'	: 27,
		'COND + L'	: 28,		'COND + R'	: 29,
	};

	ins.render = function(gfx,type,x,y,c,cs){
		gfx.lineCap  = 'round';
		gfx.lineJoin = 'round';
		var lw = (Math.round(Math.log(cs/6)/Math.log(2)+2)-3)*2;

		switch(type){ // branch off if special rendering required
			case ins.TYPES['IN']:           ins.renderStream(gfx,x,y,c,cs,lw);      return;
			case ins.TYPES['OUT']:          ins.renderStream(gfx,x,y,c,cs,lw);      return;
			case ins.TYPES['SYNC']:         ins.renderSync(gfx,x,y,c,cs,lw);        return;
			case ins.TYPES['COLOR TOGGLE']: ins.renderColorToggle(gfx,x,y,c,cs,lw); return;
		}

		gfx.save();
		gfx.translate(x,y);

		switch(c){
			case App.COLORS.RED:    gfx.fillStyle='#ff0000';break;
			case App.COLORS.GREEN:  gfx.fillStyle='#00ff00';break;
			case App.COLORS.BLUE:   gfx.fillStyle='#0000ff';break;
			case App.COLORS.YELLOW: gfx.fillStyle='#ffff00';break;
		}gfx.fillRect(2,2,cs-4,cs-4);

		switch(c){
			case App.COLORS.RED:    gfx.strokeStyle='#800000';break;
			case App.COLORS.GREEN:  gfx.strokeStyle='#008000';break;
			case App.COLORS.BLUE:   gfx.strokeStyle='#000080';break;
			case App.COLORS.YELLOW: gfx.strokeStyle='#808000';break;
		}

		if(cs>11){
			gfx.lineWidth = 2;
			gfx.beginPath();
			gfx.moveTo(2,2);
			gfx.lineTo(2,cs-2);
			gfx.lineTo(cs-2,cs-2);
			gfx.lineTo(cs-2,2);
			gfx.lineTo(2,2);
			gfx.stroke();
		}

		if(cs>15){
			gfx.lineWidth = lw;

	// ========================================================== //
	// ================= I N S T R U C T I O N S ================ //
	// ========================================================== //

	switch(type){
		case ins.TYPES['SPAWN UP']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.92,-Math.PI*0.58);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.42,-Math.PI*0.08);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.08, Math.PI*0.42);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.58, Math.PI*0.92);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(3*cs/8,  cs/2);
			gfx.lineTo(4*cs/8,3*cs/8);
			gfx.lineTo(5*cs/8,  cs/2);
			gfx.moveTo(4*cs/8,3*cs/8);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['SPAWN DOWN']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.92,-Math.PI*0.58);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.42,-Math.PI*0.08);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.08, Math.PI*0.42);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.58, Math.PI*0.92);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(3*cs/8,  cs/2);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.lineTo(5*cs/8,  cs/2);
			gfx.moveTo(4*cs/8,3*cs/8);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['SPAWN LEFT']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.92,-Math.PI*0.58);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.42,-Math.PI*0.08);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.08, Math.PI*0.42);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.58, Math.PI*0.92);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(  cs/2,3*cs/8);
			gfx.lineTo(3*cs/8,4*cs/8);
			gfx.lineTo(  cs/2,5*cs/8);
			gfx.moveTo(3*cs/8,4*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['SPAWN RIGHT']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.92,-Math.PI*0.58);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI*0.42,-Math.PI*0.08);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.08, Math.PI*0.42);gfx.stroke();
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4, Math.PI*0.58, Math.PI*0.92);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(  cs/2,3*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.lineTo(  cs/2,5*cs/8);
			gfx.moveTo(3*cs/8,4*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['UP']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,3*cs/4);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			/*
			gfx.moveTo(cs/2,3*cs/4);
			gfx.lineTo(cs/2,cs/4);
			gfx.moveTo(cs/2-cs/4, cs/2);
			gfx.lineTo(cs/2,cs/4);
			gfx.moveTo(cs/2+cs/4, cs/2);
			gfx.lineTo(cs/2,cs/4);
			*/
			gfx.stroke();
			break;

		case ins.TYPES['DOWN']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,  cs/4);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(3*cs/4,  cs/4);
			/*
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(cs/2-cs/4, cs/2);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(cs/2+cs/4, cs/2);
			gfx.lineTo(cs/2,3*cs/4);
			*/
			gfx.stroke();
			break;

		case ins.TYPES['LEFT']:
			gfx.beginPath();
			gfx.moveTo(3*cs/4,  cs/4);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/4,3*cs/4);
			/*
			gfx.moveTo(3*cs/4,cs/2);
			gfx.lineTo(cs/4,cs/2);
			gfx.moveTo(cs/2, cs/2-cs/4);
			gfx.lineTo(cs/4, cs/2);
			gfx.moveTo(cs/2, cs/2+cs/4);
			gfx.lineTo(cs/4, cs/2);
			*/
			gfx.stroke();
			break;

		case ins.TYPES['RIGHT']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,  cs/4);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(  cs/4,3*cs/4);
			/*			
			gfx.moveTo(3*cs/4,cs/2);
			gfx.lineTo(cs/4,cs/2);
			gfx.moveTo(cs/2, cs/2-cs/4);
			gfx.lineTo(3*cs/4, cs/2);
			gfx.moveTo(cs/2, cs/2+cs/4);
			gfx.lineTo(3*cs/4, cs/2);
			*/
			gfx.stroke();
			break;

		case ins.TYPES['GRAB']:
			gfx.beginPath();
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(cs/2,cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.stroke();
		break;

		case ins.TYPES['DROP']:
			gfx.beginPath();
			gfx.moveTo(cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();
		break;

		case ins.TYPES['GRAB/DROP']:
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
		break;

/*
		case ins.TYPES['GRAB']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,cs/2);
			gfx.lineTo(5*cs/8,cs/2);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,cs/2);
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(cs/2,cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['DROP']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,cs/2);
			gfx.lineTo(5*cs/8,cs/2);
			gfx.moveTo(cs/2,cs/2);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['GRAB/DROP']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,cs/2);
			gfx.lineTo(5*cs/8,cs/2);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(cs/2,cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();
			break;
*/

		case ins.TYPES['INC']:
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			/*
			gfx.moveTo(cs/4-cs/16,cs/2);
			gfx.lineTo(cs/2-cs/16,cs/2);
			gfx.moveTo(3*cs/4+cs/16,cs/2);
			gfx.lineTo(cs/2+cs/16,cs/2);
			gfx.moveTo(cs/2-cs/8-cs/16,cs/2-cs/8);
			gfx.lineTo(cs/2-cs/8-cs/16,cs/2+cs/8);
			gfx.moveTo(cs/2+cs/8+cs/16,cs/2-cs/8);
			gfx.lineTo(cs/2+cs/8+cs/16,cs/2+cs/8);	
			*/
			gfx.stroke();
			break;

		case ins.TYPES['DEC']:
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			/*
			gfx.moveTo(cs/4-cs/16,cs/2);
			gfx.lineTo(cs/2-cs/16,cs/2);
			gfx.moveTo(cs/2+cs/16,cs/2);
			gfx.lineTo(3*cs/4+cs/16,cs/2);
			*/
			gfx.stroke();
			break;

		case ins.TYPES['PAUSE']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(cs/2,cs/2);
			gfx.lineTo(cs/2,3*cs/8);
			gfx.moveTo(cs/2,cs/2);
			gfx.lineTo(5*cs/8,cs/2);
			gfx.stroke();
/*
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(cs/2-cs/16,cs/2-cs/16);
			gfx.lineTo(cs/2-cs/16,cs/2+cs/16);
			gfx.moveTo(cs/2+cs/16,cs/2-cs/16);
			gfx.lineTo(cs/2+cs/16,cs/2+cs/16);
			gfx.stroke();
*/
			break;

		case ins.TYPES['COND 0 U']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);

			gfx.moveTo(3*cs/8,4*cs/8);
			gfx.lineTo(3*cs/8,6*cs/8);
			gfx.lineTo(5*cs/8,6*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.lineTo(3*cs/8,4*cs/8);
			gfx.lineTo(5*cs/8,6*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND 0 D']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo(3*cs/8,2*cs/8);
			gfx.lineTo(3*cs/8,4*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.lineTo(5*cs/8,2*cs/8);
			gfx.lineTo(3*cs/8,2*cs/8);
			gfx.lineTo(5*cs/8,4*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND 0 L']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/8,5*cs/8);

			gfx.moveTo(4*cs/8,3*cs/8);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.lineTo(6*cs/8,5*cs/8);
			gfx.lineTo(6*cs/8,3*cs/8);
			gfx.lineTo(4*cs/8,3*cs/8);
			gfx.lineTo(6*cs/8,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND 0 R']:
			gfx.beginPath();
			gfx.moveTo(5*cs/8,3*cs/8);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo(2*cs/8,3*cs/8);
			gfx.lineTo(2*cs/8,5*cs/8);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.lineTo(4*cs/8,3*cs/8);
			gfx.lineTo(2*cs/8,3*cs/8);
			gfx.lineTo(4*cs/8,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND TOKEN U']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);
			gfx.stroke();

			gfx.beginPath();gfx.arc(cs/2,5*cs/8,cs/8,-Math.PI,Math.PI);gfx.stroke();
			break;

		case ins.TYPES['COND TOKEN D']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();

			gfx.beginPath();gfx.arc(cs/2,3*cs/8,cs/8,-Math.PI,Math.PI);gfx.stroke();
			break;

		case ins.TYPES['COND TOKEN L']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/8,5*cs/8);
			gfx.stroke();

			gfx.beginPath();gfx.arc(5*cs/8,cs/2,cs/8,-Math.PI,Math.PI);gfx.stroke();
			break;

		case ins.TYPES['COND TOKEN R']:
			gfx.beginPath();
			gfx.moveTo(5*cs/8,3*cs/8);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(5*cs/8,5*cs/8);
			gfx.stroke();

			gfx.beginPath();gfx.arc(3*cs/8,cs/2,cs/8,-Math.PI,Math.PI);gfx.stroke();
			break;

		case ins.TYPES['COND + U']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);

			gfx.moveTo( 8*cs/16, 7*cs/16);
			gfx.lineTo( 8*cs/16,11*cs/16);
			gfx.moveTo( 6*cs/16, 9*cs/16);
			gfx.lineTo(10*cs/16, 9*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND + D']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo( 8*cs/16, 5*cs/16);
			gfx.lineTo( 8*cs/16, 9*cs/16);
			gfx.moveTo( 6*cs/16, 7*cs/16);
			gfx.lineTo(10*cs/16, 7*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND + L']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/8,5*cs/8);

			gfx.moveTo( 9*cs/16, 6*cs/16);
			gfx.lineTo( 9*cs/16,10*cs/16);
			gfx.moveTo( 7*cs/16, 8*cs/16);
			gfx.lineTo(11*cs/16, 8*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND + R']:
			gfx.beginPath();
			gfx.moveTo(5*cs/8,3*cs/8);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo( 7*cs/16, 6*cs/16);
			gfx.lineTo( 7*cs/16,10*cs/16);
			gfx.moveTo( 5*cs/16, 8*cs/16);
			gfx.lineTo( 9*cs/16, 8*cs/16);
			gfx.stroke();
			break;
	}

	// ========================================================== //

		}gfx.restore();
	}

	ins.renderStream = function(gfx,x,y,c,cs,lw){
		// TODO: I NEED TO KNOW WHAT STREAM I AM FOR LETTERING AND IO
		gfx.save();
		gfx.translate(x,y);

		switch(c){
			case App.COLORS.RED:    gfx.strokeStyle='#ff0000';break;
			case App.COLORS.GREEN:  gfx.strokeStyle='#00ff00';break;
			case App.COLORS.BLUE:   gfx.strokeStyle='#0000ff';break;
			case App.COLORS.YELLOW: gfx.strokeStyle='#ffff00';break;
		}gfx.lineWidth = 2;

		gfx.beginPath();
		gfx.moveTo(2,2);
		gfx.lineTo(cs-2,cs-2);
		gfx.moveTo(2,cs-2);
		gfx.lineTo(cs-2,2);
		gfx.stroke();


		gfx.restore();

/*============================================================================*\

		case ins.TYPES['IN']:
			gfx.beginPath();gfx.arc(cs/2,15*cs/32,cs/8,-Math.PI,Math.PI);gfx.stroke();
			gfx.beginPath();
			// TODO: optimize loop
			gfx.moveTo(  cs/2,  cs/4);
			gfx.lineTo(3*cs/4,  cs/4);
			gfx.lineTo(3*cs/4,9*cs/16);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(  cs/4,9*cs/16);
			gfx.lineTo(  cs/4,  cs/4);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.moveTo(  cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.stroke();
			break;

		case ins.TYPES['OUT']:
			gfx.beginPath();gfx.arc(cs/2,17*cs/32,cs/8,-Math.PI,Math.PI);gfx.stroke();
			gfx.beginPath();
			// TODO: optimize loop
			gfx.moveTo(  cs/2,3*cs/4);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,7*cs/16);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(  cs/4,7*cs/16);
			gfx.lineTo(  cs/4,3*cs/4);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.stroke();
			break;

\*============================================================================*/

	}

	ins.renderSync = function(gfx,x,y,c,cs,lw){
		gfx.save();
		gfx.translate(x,y);

		gfx.lineWidth = 2;
		gfx.beginPath();
		switch(c){
			case App.COLORS.RED:
				gfx.fillStyle='#ff0000';gfx.strokeStyle='#800000';
				gfx.moveTo(2,2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(cs-2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,cs-2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(2,2);
				break;
			case App.COLORS.GREEN:
				gfx.fillStyle='#00ff00';gfx.strokeStyle='#008000';
				gfx.moveTo(cs-2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,cs-2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,2);
				break;
			case App.COLORS.BLUE:
				gfx.fillStyle='#0000ff';gfx.strokeStyle='#000080';
				gfx.moveTo(2,cs-2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(2,cs-2);
				break;
			case App.COLORS.YELLOW:
				gfx.fillStyle='#ffff00';gfx.strokeStyle='#808000';
				gfx.moveTo(cs-2,cs-2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(cs-2,cs-2);
				break;
		}gfx.fill();gfx.stroke();

		gfx.restore();
	}

	ins.renderColorToggle = function(gfx,x,y,c,cs,lw){
		gfx.save();
		gfx.translate(x,y);

		gfx.lineWidth = 2;
		gfx.beginPath();
		switch(c){
			case App.COLORS.RED:
				gfx.fillStyle='#ff0000';gfx.strokeStyle='#800000';
				gfx.moveTo(cs-2,cs-2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(cs-2,cs-2);
				break;
			case App.COLORS.GREEN:
				gfx.fillStyle='#00ff00';gfx.strokeStyle='#008000';
				gfx.moveTo(2,cs-2);
				gfx.lineTo(2,2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(2,cs-2);
				break;
			case App.COLORS.BLUE:
				gfx.fillStyle='#0000ff';gfx.strokeStyle='#000080';
				gfx.moveTo(cs-2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,2);
				break;
			case App.COLORS.YELLOW:
				gfx.fillStyle='#ffff00';gfx.strokeStyle='#808000';
				gfx.moveTo(2,2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(2,2);
				break;
		}gfx.fill();gfx.stroke();

		gfx.restore();
	}

	return ins;
}
