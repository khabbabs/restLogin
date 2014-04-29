App.makeInstructionCatalog = function(){
	var ins = {};

	ins.TYPES = {
	// --------------------------------------------- AUTOMATON SPAWN
		'SPAWN UP'      : 0,            'SPAWN RIGHT'   : 1,
		'SPAWN DOWN'    : 2,            'SPAWN LEFT'    : 3,
	// ------------------------------------------- DIRECTION CONTROL
		'UP'            : 4,            'RIGHT'         : 5,
		'DOWN'          : 6,            'LEFT'          : 7,
	// ---------------------------------------------------- TOKEN IO
		'IN'            : 8,            'OUT'           : 9,
	// ------------------------------------------ TOKEN MANIPULATION
		'GRAB'          : 10,           'DROP'          : 11,
		'GRAB/DROP'     : 12,           'INC'           : 13,
		'DEC'           : 14,           'SET'           : 15,
	// -------------------------------------------------------- MISC
		'SYNC'          : 16,           'COLOR TOGGLE'  : 17,
		'PAUSE'         : 18,
	// ----------------------------------------- CONDITIONAL CONTROL
		'COND TOKEN U'  : 19,           'COND TOKEN R'  : 20,
		'COND TOKEN D'  : 21,           'COND TOKEN L'  : 22,
		'COND EQUAL U'  : 23,           'COND EQUAL R'  : 24,
		'COND EQUAL D'  : 25,           'COND EQUAL L'  : 26,
		'COND + U'      : 27,           'COND + R'      : 28,
		'COND + D'      : 29,           'COND + L'      : 30,
		'FLIP FLOP U'   : 31,           'FLIP FLOP R'   : 32,
		'FLIP FLOP D'   : 33,           'FLIP FLOP L'   : 34,
	};

	ins.render = function(gfx,type,x,y,c,cs,dataA,dataB){
		gfx.lineCap  = 'round';
		gfx.lineJoin = 'round';
		var lw = (Math.round(Math.log(cs/6)/Math.log(2)+2)-3)*2;

		switch(type){ // branch off if special rendering required
			case ins.TYPES['FLIP FLOP U']:
			case ins.TYPES['FLIP FLOP D']:
			case ins.TYPES['FLIP FLOP L']:
			case ins.TYPES['FLIP FLOP R']:
				ins.renderFlipFlop(gfx,type,x,y,c,cs,lw,dataA); return;

			case ins.TYPES['IN']:
			case ins.TYPES['OUT']:
				ins.renderStream(gfx,x,y,c,cs,lw,dataA,dataB); return;

			case ins.TYPES['SYNC']:         ins.renderSync(gfx,x,y,c,cs,lw);        return;
			case ins.TYPES['COLOR TOGGLE']: ins.renderColorToggle(gfx,x,y,c,cs,lw); return;
		}

		gfx.save();
		gfx.translate(x,y);

		gfx.fillStyle = App.FILL_COLOR[c];
		gfx.fillRect(2,2,cs-4,cs-4);

		gfx.strokeStyle = App.STROKE_COLOR[c];
		gfx.lineWidth = 2;
		gfx.beginPath();
		gfx.moveTo(2,2);
		gfx.lineTo(2,cs-2);
		gfx.lineTo(cs-2,cs-2);
		gfx.lineTo(cs-2,2);
		gfx.lineTo(2,2);
		gfx.stroke();

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
			gfx.lineTo(  cs/4,3*cs/4);
			gfx.stroke();
			break;

		case ins.TYPES['DOWN']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,  cs/4);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(3*cs/4,  cs/4);
			gfx.lineTo(  cs/4,  cs/4);
			gfx.stroke();
			break;

		case ins.TYPES['LEFT']:
			gfx.beginPath();
			gfx.moveTo(3*cs/4,  cs/4);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/4,3*cs/4);
			gfx.lineTo(3*cs/4,  cs/4);
			gfx.stroke();
			break;

		case ins.TYPES['RIGHT']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,  cs/4);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(  cs/4,3*cs/4);
			gfx.lineTo(  cs/4,  cs/4);
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

		case ins.TYPES['INC']:
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.moveTo(cs/2,cs/4);
			gfx.lineTo(cs/2,3*cs/4);
			gfx.stroke();
			break;

		case ins.TYPES['DEC']:
			gfx.beginPath();
			gfx.moveTo(cs/4,cs/2);
			gfx.lineTo(3*cs/4,cs/2);
			gfx.stroke();
			break;

		case ins.TYPES['SET']:
			gfx.beginPath();
			gfx.moveTo(  cs/4,3*cs/8);
			gfx.lineTo(3*cs/4,3*cs/8);
			gfx.moveTo(  cs/4,5*cs/8);
			gfx.lineTo(3*cs/4,5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['PAUSE']:
			gfx.beginPath();gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);gfx.stroke();
			gfx.beginPath();
			gfx.moveTo(  cs/2,  cs/2);
			gfx.lineTo(  cs/2,3*cs/8);
			gfx.moveTo(  cs/2,  cs/2);
			gfx.lineTo(5*cs/8,  cs/2);
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

		case ins.TYPES['COND EQUAL U']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);

			gfx.moveTo(3*cs/8, 9*cs/16);
			gfx.lineTo(5*cs/8, 9*cs/16);
			gfx.moveTo(3*cs/8,11*cs/16);
			gfx.lineTo(5*cs/8,11*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND EQUAL D']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo(3*cs/8, 5*cs/16);
			gfx.lineTo(5*cs/8, 5*cs/16);
			gfx.moveTo(3*cs/8, 7*cs/16);
			gfx.lineTo(5*cs/8, 7*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND EQUAL L']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/8,5*cs/8);

			gfx.moveTo(4*cs/8, 7*cs/16);
			gfx.lineTo(6*cs/8, 7*cs/16);
			gfx.moveTo(4*cs/8, 9*cs/16);
			gfx.lineTo(6*cs/8, 9*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND EQUAL R']:
			gfx.beginPath();
			gfx.moveTo(5*cs/8,3*cs/8);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo(2*cs/8, 7*cs/16);
			gfx.lineTo(4*cs/8, 7*cs/16);
			gfx.moveTo(2*cs/8, 9*cs/16);
			gfx.lineTo(4*cs/8, 9*cs/16);
			gfx.stroke();
			break;

		case ins.TYPES['COND + U']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/2,  cs/4);
			gfx.lineTo(5*cs/8,3*cs/8);

			gfx.moveTo( 4*cs/8, 4*cs/8);
			gfx.lineTo( 4*cs/8, 6*cs/8);
			gfx.moveTo( 3*cs/8, 5*cs/8);
			gfx.lineTo( 5*cs/8, 5*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND + D']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,5*cs/8);
			gfx.lineTo(  cs/2,3*cs/4);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo( 4*cs/8, 2*cs/8);
			gfx.lineTo( 4*cs/8, 4*cs/8);
			gfx.moveTo( 3*cs/8, 3*cs/8);
			gfx.lineTo( 5*cs/8, 3*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND + L']:
			gfx.beginPath();
			gfx.moveTo(3*cs/8,3*cs/8);
			gfx.lineTo(  cs/4,  cs/2);
			gfx.lineTo(3*cs/8,5*cs/8);

			gfx.moveTo( 5*cs/8, 3*cs/8);
			gfx.lineTo( 5*cs/8, 5*cs/8);
			gfx.moveTo( 4*cs/8, 4*cs/8);
			gfx.lineTo( 6*cs/8, 4*cs/8);
			gfx.stroke();
			break;

		case ins.TYPES['COND + R']:
			gfx.beginPath();
			gfx.moveTo(5*cs/8,3*cs/8);
			gfx.lineTo(3*cs/4,  cs/2);
			gfx.lineTo(5*cs/8,5*cs/8);

			gfx.moveTo( 3*cs/8, 3*cs/8);
			gfx.lineTo( 3*cs/8, 5*cs/8);
			gfx.moveTo( 2*cs/8, 4*cs/8);
			gfx.lineTo( 4*cs/8, 4*cs/8);
			gfx.stroke();
			break;
	}

	// ========================================================== //

		}gfx.restore();
	}


	ins.renderStream = function(gfx,x,y,c,cs,lw,streamVar,streamBkg){

		// TODO: I NEED TO KNOW WHAT STREAM I AM FOR LETTERING AND IO
		gfx.save();
		gfx.translate(x,y);

		if(streamBkg){
			gfx.fillStyle = App.TRANS_COLOR[c];
			switch(c){
				case App.COLORS.RED:    gfx.fillRect(    2,    2,2*cs-4,2*cs-4);break;
				case App.COLORS.GREEN:  gfx.fillRect(-cs+2,    2,2*cs-4,2*cs-4);break;
				case App.COLORS.BLUE:   gfx.fillRect(    2,-cs+2,2*cs-4,2*cs-4);break;
				case App.COLORS.YELLOW: gfx.fillRect(-cs+2,-cs+2,2*cs-4,2*cs-4);break;
			}
		}

		switch(c){
			case App.COLORS.RED:    gfx.strokeStyle='#ff0000';break;
			case App.COLORS.GREEN:  gfx.strokeStyle='#00ff00';break;
			case App.COLORS.BLUE:   gfx.strokeStyle='#0000ff';break;
			case App.COLORS.YELLOW: gfx.strokeStyle='#ffff00';break;
		}gfx.lineWidth = lw;


		gfx.beginPath();

		if(cs>15)switch(streamVar){
			case 'A':
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(2*cs/4,  cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(5*cs/16,5*cs/8);
				gfx.lineTo(11*cs/16,5*cs/8);
				break;
			case 'B':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(5*cs/8,  cs/4);
				gfx.arc(5*cs/8,3*cs/8,cs/8,-Math.PI/2,Math.PI/2);
				gfx.arc(5*cs/8,5*cs/8,cs/8,-Math.PI/2,Math.PI/2);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(5*cs/8,  cs/2);
				break;
			case 'C':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.arc(cs/2,cs/2,cs/4,-Math.PI/2,Math.PI/2,true);
				gfx.lineTo(3*cs/4,3*cs/4);
				break;
			case 'D':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/2,  cs/4);
				gfx.arc(cs/2,cs/2,cs/4,-Math.PI/2,Math.PI/2);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				break;
			case 'E':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(  cs/2,  cs/2);
				break;
			case 'F':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(  cs/2,  cs/2);
				break;
			case 'G':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.arc(cs/2,cs/2,cs/4,-Math.PI/2,Math.PI/2,true);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,  cs/2);
				gfx.lineTo(  cs/2,  cs/2);
				break;
			case 'H':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(3*cs/4,  cs/2);
				break;
			case 'I':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(  cs/2,  cs/4);
				gfx.lineTo(  cs/2,3*cs/4);
				break;
			case 'J':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/2);
				gfx.arc(cs/2,cs/2,cs/4,0,Math.PI);
				break;
			case 'K':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(  cs/2,  cs/2);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(  cs/2,  cs/2);
				break;
			case 'L':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				break;
			case 'M':
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/2,  cs/2);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				break;
			case 'N':
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				break;
			case 'O':
				gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);
				break;
			case 'P':
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(5*cs/8,  cs/4);
				gfx.arc(5*cs/8,3*cs/8,cs/8,-Math.PI/2,Math.PI/2);
				gfx.lineTo(  cs/4,  cs/2);
				break;
			case 'Q':
				gfx.arc(cs/2,cs/2,cs/4,-Math.PI,Math.PI);
				gfx.moveTo(5*cs/8,5*cs/8);
				gfx.lineTo(3*cs/4,3*cs/4);
				break;
			case 'R':
				gfx.moveTo(  cs/4,3*cs/4);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(5*cs/8,  cs/4);
				gfx.arc(5*cs/8,3*cs/8,cs/8,-Math.PI/2,Math.PI/2);
				gfx.arc(5*cs/8,5*cs/8,cs/8,-Math.PI/2,0);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(  cs/4,  cs/2);
				gfx.lineTo(5*cs/8,  cs/2);
				break;
			case 'S':
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(3*cs/8,  cs/4);
				gfx.arc(3*cs/8,3*cs/8,cs/8,-Math.PI/2,Math.PI/2,true);
				gfx.lineTo(5*cs/8,  cs/2);
				gfx.arc(5*cs/8,5*cs/8,cs/8,-Math.PI/2,Math.PI/2);
				gfx.lineTo(  cs/4,3*cs/4);
				break;
			case 'T':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.moveTo(  cs/2,  cs/4);
				gfx.lineTo(  cs/2,3*cs/4);
				break;
			case 'U':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/4,  cs/2);
				gfx.arc(cs/2,cs/2,cs/4,Math.PI,0,true);
				gfx.lineTo(3*cs/4,  cs/4);
				break;
			case 'V':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/2,3*cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				break;
			case 'W':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/8,3*cs/4);
				gfx.lineTo(  cs/2,9*cs/16);
				gfx.lineTo(5*cs/8,3*cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				break;
			case 'X':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				gfx.moveTo(3*cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				break;
			case 'Y':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(  cs/2,  cs/2);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.moveTo(  cs/2,  cs/2);
				gfx.lineTo(  cs/2,3*cs/4);
				break;
			case 'Z':
				gfx.moveTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.lineTo(  cs/4,3*cs/4);
				gfx.lineTo(3*cs/4,3*cs/4);
				break;
			default:
				gfx.moveTo(  cs/4,3*cs/8);
				gfx.lineTo(  cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/4);
				gfx.lineTo(3*cs/4,  cs/2);
				gfx.lineTo(  cs/2,  cs/2);
				gfx.lineTo(  cs/2,5*cs/8);
				gfx.moveTo(15*cs/32,3*cs/4);
				gfx.lineTo(17*cs/32,3*cs/4);
				break;
		}

		gfx.stroke();
		gfx.restore();
	}

	ins.renderFlipFlop = function(gfx,type,x,y,c,cs,lw,state){
		gfx.save();
		gfx.translate(x,y);

		switch(state){
			case false:
				gfx.fillStyle = App.TRANS_COLOR[c];
				gfx.strokeStyle = App.FILL_COLOR[c];
				break;
			default:
				gfx.fillStyle = App.FILL_COLOR[c];
				gfx.strokeStyle = App.STROKE_COLOR[c];
				break;
		}gfx.fillRect(2,2,cs-4,cs-4);

		gfx.lineWidth = lw;
		gfx.beginPath();
		switch(type){
			case ins.TYPES['FLIP FLOP U']:
				gfx.moveTo(3*cs/8,3*cs/8);
				gfx.lineTo(  cs/2,  cs/4);
				gfx.lineTo(5*cs/8,3*cs/8);

				gfx.moveTo(5*cs/8,4*cs/8);
				gfx.lineTo(3*cs/8,4*cs/8);
				gfx.lineTo(3*cs/8,6*cs/8);
				gfx.moveTo(3*cs/8,5*cs/8);
				gfx.lineTo(4*cs/8,5*cs/8);
				break;
			case ins.TYPES['FLIP FLOP D']:
				gfx.moveTo(3*cs/8,5*cs/8);
				gfx.lineTo(  cs/2,3*cs/4);
				gfx.lineTo(5*cs/8,5*cs/8);

				gfx.moveTo(5*cs/8,2*cs/8);
				gfx.lineTo(3*cs/8,2*cs/8);
				gfx.lineTo(3*cs/8,4*cs/8);
				gfx.moveTo(3*cs/8,3*cs/8);
				gfx.lineTo(4*cs/8,3*cs/8);
				break;
			case ins.TYPES['FLIP FLOP L']:
				gfx.moveTo(3*cs/8,3*cs/8);
				gfx.lineTo(  cs/4,  cs/2);
				gfx.lineTo(3*cs/8,5*cs/8);

				gfx.moveTo(6*cs/8,3*cs/8);
				gfx.lineTo(4*cs/8,3*cs/8);
				gfx.lineTo(4*cs/8,5*cs/8);
				gfx.moveTo(4*cs/8,4*cs/8);
				gfx.lineTo(5*cs/8,4*cs/8);
				break;
			case ins.TYPES['FLIP FLOP R']:
				gfx.moveTo(5*cs/8,3*cs/8);
				gfx.lineTo(3*cs/4,  cs/2);
				gfx.lineTo(5*cs/8,5*cs/8);

				gfx.moveTo(4*cs/8,3*cs/8);
				gfx.lineTo(2*cs/8,3*cs/8);
				gfx.lineTo(2*cs/8,5*cs/8);
				gfx.moveTo(2*cs/8,4*cs/8);
				gfx.lineTo(3*cs/8,4*cs/8);
				break;
		}gfx.stroke();

		gfx.strokeStyle = App.STROKE_COLOR[c];
		gfx.lineWidth = 2;
		gfx.beginPath();
		gfx.moveTo(2,2);
		gfx.lineTo(2,cs-2);
		gfx.lineTo(cs-2,cs-2);
		gfx.lineTo(cs-2,2);
		gfx.lineTo(2,2);
		gfx.stroke();

		gfx.restore();
	}

	ins.renderSync = function(gfx,x,y,c,cs,lw){
		gfx.save();
		gfx.translate(x,y);

		gfx.lineWidth = 2;
		gfx.beginPath();
		gfx.fillStyle = App.FILL_COLOR[c];
		gfx.strokeStyle = App.STROKE_COLOR[c];
		switch(c){
			case App.COLORS.RED:
				gfx.moveTo(2,2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(cs-2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,cs-2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(2,2);
				break;
			case App.COLORS.GREEN:
				gfx.moveTo(cs-2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,cs-2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,2);
				break;
			case App.COLORS.BLUE:
				gfx.moveTo(2,cs-2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,cs/2);
				gfx.lineTo(cs/2,cs/2);
				gfx.lineTo(cs/2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(2,cs-2);
				break;
			case App.COLORS.YELLOW:
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
		gfx.fillStyle = App.FILL_COLOR[c];
		gfx.strokeStyle = App.STROKE_COLOR[c];
		switch(c){
			case App.COLORS.RED:
				gfx.moveTo(cs-2,cs-2);
				gfx.lineTo(2,cs-2);
				gfx.lineTo(cs-2,2);
				gfx.lineTo(cs-2,cs-2);
				break;
			case App.COLORS.GREEN:
				gfx.moveTo(2,cs-2);
				gfx.lineTo(2,2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(2,cs-2);
				break;
			case App.COLORS.BLUE:
				gfx.moveTo(cs-2,2);
				gfx.lineTo(2,2);
				gfx.lineTo(cs-2,cs-2);
				gfx.lineTo(cs-2,2);
				break;
			case App.COLORS.YELLOW:
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
