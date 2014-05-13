
/*
AUTOMATON MANUAL

Automaton
An Automaton is an autonomous agent instantiated by the Spawn Instruction.
Each automaton may have one to four Colors.  Each Automaton moves
independently on the Grid.  The direction of the movement is determined
by the Up, Down, Left, Right Instructions.  The velocity of all
Automatons on the Grid can be incremented or decremented.

Token
A Token is a datum holding a numerical variable that can be manipulated
by Instructions.  A Token can be grabbed, dropped, and held by an
Automaton.  Tokens are accepted by Streams.  To solve a puzzle, you
must equate the Token variable with the value the Stream accepts.

Grid
The Grid is the 2-dimensional world in which Instructions may operate on 
Automatons.  The Grid represents the set of all possible Cells.  The size
of the Grid is defined by a width and length of Cells but the width and 
length can be infinite.

Cell
Cells are discrete locations on the 2-dimensional Grid.  Each Cell may contain
Automatons, Instructions, Tokens, or Input/Output Streams.  Instructions
can placed on a Cell by using the mouse to drag and drop an Instruction from
the Instruction Menu Bar located at the bottom of the display window.

Color
Colors are relationships between Automatons and Instructions.  
An Instruction will be applied to an Automaton if and only if the Instruction 
and the Automaton share the same color. There can be 0 to 4 colored Instructions 
on any Cell in the Grid.  Each Automaton is represented by a quarter arc and indicate 
if an Instruction of that Color can apply to that Automaton.  Each Instruction 
has a Color indicating which Automatons it will apply to.

Red is represented by the color value: 0xFF0000
Blue is represented by the color value: 0x00FF00
Green is represented by the color value: 0x0000FF
Yellow is represented by the color value: 0xFFFF00

Menu Bar
The Menu Bar displays the Instructions a user can place in a Cell on the Grid.
The Color of all Instructions can be changed by the user.  The Menu Bar also
allows the user to change the speed of the Automatons.

Stream
There are two types of Streams: Input Streams and Output Streams.  Input 
Streams and Output Streams accept Tokens.

Instruction
Instructions are functions which are applied to Automatons.  Each Instruction
has a Color component.  Instructions are only applied to Automatons who share 
the same Color as the Instruction.
	- Move Up: Moves an Automaton North on the Grid
	- Move Down: Moves an Automaton South on the Grid
	- Move Left: Moves an Automaton West on the Grid
	- Move Right: Moves an Automaton East on the Grid
	- Toggle: 
	- Drop: 
	- Grab: 
	- Grab & Drop: 
*/

var info = [];

// dim
var w = 512;

// offsets
var x_off = 15;
var y_off = 15;
var button_h = 28;

// glyph dim
var glyph_w = 128;
var glyph_h = 128;

// font sizes
var title_font_size = 30;
var text_font_size = 12;

parseString = function(text,str,gfx) {
	temp0 = []; temp1 = [];
	index = 0;
	gfx.font="30px Arial"
	for(i=0; i<str.length;i++){
		temp0.concact(str.chatAt(i));
		l = gfx.measureText(temp).width;
		if(l > 100) str[index++] = temp1;
		else {
			temp1 = temp0;
		}
	}
	return str;
}

drawText = function(gfx,str) {
	var y = 56+button_h*2+x_off+title_font_size+y_off;
	var dy = 10;
	for(i=0;i<str.length;i++){
		text(gfx,str[i],15+15,y,12,0);
		y+=text_font_size+text_font_size/2;
	}
}

help = function(gfx, title, info, height) {
	// dynammmic height	
	var h = info.length * text_font_size + info.length*(text_font_size/2) + title_font_size + y_off*3;

	if(h<glyph_h+y_off*2) { 
		h = glyph_h+y_off*2; 
	}

	// background
	gfx.lineWidth = 2;
	gfx.fillStyle = '#000000';
	gfx.fillRect(15,56+28*2,w,h);
	gfx.strokeStyle = '#aaaaaa';
	gfx.strokeRect(15,56+28*2,w,h);
	gfx.fillStyle = '#ffffff';
	// title
	gfx.fillStyle = '#ffffff';
	text(gfx,title,x_off+x_off,56+button_h*2+x_off,title_font_size,-3);
	// foreground
	drawText(gfx,info);
	// glyph
	//gfx.strokeRect(w-glyph_w,56+button_h*2+x_off, glyph_w, glyph_h);
}

// automaton text
info[0] = function(gfx) {
	var title = "Automaton";
	var str = [];
	str[0] = "Automatons are agents which move"
	str[1] = "independently across the Grid."
	str[2] = "Automatons move by the Up, Down,"
	str[3] = "Left, Right Instructions."
	help(gfx, title, str);
}

// token text
info[1] = function(gfx) {
	var title = "Token";
	var str = [];
	str[0] = "Tokens hold a numerical variable"
	str[1] = "that can be manipulated by Instructions." 
	str[2] = "Tokens can be grabbed, dropped, and"
	str[3] = "held by an Automaton. Tokens are"
	str[4] = "accepted by Streams."
	help(gfx, title, str);
	App.renderToken(gfx,w-glyph_w,56+28*2+x_off,0,128);
}

// grid text
info[2] = function(gfx) {
	var title = "Grid";
	var str = [];
	str[0] = "The Grid is the 2-dimensional world"
	str[1] = "in which Instructions may operate on"
	str[2] = "Automatons.  The Grid represents the"
	str[3] = "set of all possible Cells.  The size of"
	str[4] = "the Grid can be infinite."
	help(gfx, title, str);
}

// cell text
info[3] = function(gfx) {
	var title = "Cell"
	var str = [];
	str[0] = "Cells are locations on the Grid."
	str[1] = "Each Cell may contain Automatons," 
	str[2] = "Instructions, Tokens, or Input"
	str[3] = "Output Streams."
	help(gfx, title, str);
}

// colors
info[4] = function(gfx) {
	var title = "Color";
	var str = [];
	str[0] = "Colors are relationships between"
	str[1] = "Automatons and Instructions. The"
	str[2] = "Instructions are only applied to"
	str[3] = "Automatons if the Instruction and"
	str[4] = "the Automaton share the same color."
	help(gfx, title, str);
}

info[5] = function(gfx) {
	var title = "Menu";
	var str = [];
	str[0] = "The Menu allows users to drag and"
	str[1] = "drop Instructions and Streams onto"
	str[2] = "the Grid. The Menu also includes"
	str[3] = "buttons for uploading a level or"
	str[4] = "creating a a new level."
	help(gfx, title, str);
}

info[6] = function(gfx) {
	var title = "Direction";
	var str = [];
	str[0] = "Direction instructions change"
	str[1] = "the direction of movement of an"
	str[2] = "Automaton to either Up, Down,"
	str[3] = "Right,or Left."
	help(gfx, title, str);
	
	gfx.lineCap  = 'round';
	gfx.lineJoin = 'round';
/*
	var cs = glyph_w;
	var lw = (Math.round(Math.log(cs/6)/Math.log(2)+2)-3)*2;
	gfx.strokeStyle =  '#aa0000';
	gfx.fillStyle = '#ff0000';
	gfx.lineWidth = lw;
	gfx.fillRect(w-glyph_w,56+28*2+x_off,glyph_w,glyph_h);
	gfx.strokeRect(w-glyph_w,56+28*2+x_off,glyph_w,glyph_h);
	gfx.translate(w-glyph_w,56+28*2+x_off);
	gfx.beginPath();
	gfx.moveTo(  cs/4,3*cs/4);
	gfx.lineTo(  cs/2,  cs/4);
	gfx.lineTo(3*cs/4,3*cs/4);
	gfx.lineTo(  cs/4,3*cs/4);
	gfx.stroke();
	gfx.translate(-(w-glyph_w),-(56+28*2+x_off));
*/
	App.InstCatalog.render(gfx,5,w-glyph_w,56+28*2+x_off,App.COLORS.RED,glyph_w,false,false)
}

info[7] = function(gfx) {
	var title = "Spawn";
	var str = [];
	str[0] = "Spawn instructions create an Automaton"
	str[1] = "on Cell. The direction of the spawned"
	str[2] = "instruction can be Up, Down, Right,"
	str[3] = "or Left."
	help(gfx, title, str);

	App.InstCatalog.render(gfx,0,w-glyph_w,56+28*2+x_off,App.COLORS.GREEN,glyph_w,false,false)
}

info[8] = function(gfx) {
	var title = "Flip Flop";
	var str = [];
	str[0] = "Flip Flop Instructions disable and enable"
	str[1] = "the directions."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,31,w-glyph_w,56+28*2+x_off,App.COLORS.BLUE,glyph_w,false,false)
}

info[9] = function(gfx) {
	var title = "Color Toggle";
	var str = [];
	str[0] = "The Color Toggle Instruction toggles the"
	str[1] = "color of the Automaton."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,17,w-glyph_w,56+28*2+x_off,App.COLORS.YELLOW,glyph_w,false,false)
}

info[10] = function(gfx) {
	var title = "Grab & Drop";
	var str = [];
	str[0] = "The Grab, Drop, and Grab/Drop Instruction"
	str[1] = "picks up and puts down Tokens."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,12,w-glyph_w,56+28*2+x_off,App.COLORS.RED,glyph_w,false,false)
}
info[11] = function(gfx) {
	var title = "Add & Subtract";
	var str = [];
	str[0] = "The Add and Subtract Instruction increment"
	str[1] = "or decrement the value of the Token."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,13,w-glyph_w,56+28*2+x_off,App.COLORS.GREEN,glyph_w,false,false)
}
info[12] = function(gfx) {
	var title = "Streams";
	var str = [];
	str[0] = "The Stream Instruction allow Tokens to enter"
	str[1] = "and exit the Grid. Input streams give input"
	str[2] = "within a certain range.  Output streams only"
	str[3] = "a fixed output value."
	help(gfx, title, str);
	App.InstCatalog.renderStream(gfx,w-glyph_w,56+28*2+x_off,App.COLORS.RED,glyph_w/2,2,'A',true)
}
info[13] = function(gfx) {
	var title = "Cond Token";
	var str = [];
	str[0] = "The Cond Token tests if the Automaton has"
	str[1] = "a Token and changes the direction."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,19,w-glyph_w,56+28*2+x_off,App.COLORS.YELLOW,glyph_w,false,false)
}
info[14] = function(gfx) {
	var title = "Cond Equal";
	var str = [];
	str[0] = "The Cond Equal Instruction changes"
	str[1] = " the direction if the value is equal" 
	str[2] = "and does nothing if not."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,23,w-glyph_w,56+28*2+x_off,App.COLORS.RED,glyph_w,false,false)
}
info[15] = function(gfx) {
	var title = "Cond +";
	var str = [];
	str[0] = "The Cond + Instruction changes the direction"
	str[1] = "if the value is greater than zero and does"
	str[2] = "nothing if not."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,27,w-glyph_w,56+28*2+x_off,App.COLORS.GREEN,glyph_w,false,false)
}
info[16] = function(gfx) {
	var title = "Sync";
	var str = [];
	str[0] = "The Sync Instruction hold Automatons"
	str[1] = "of that color until all Syncs have an"
	str[2] = "Automaton of that color."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,16,w-glyph_w,56+28*2+x_off,App.COLORS.BLUE,glyph_w,false,false)
}
info[17] = function(gfx) {
	var title = "Pause";
	var str = [];
	str[0] = "The Pause Instruction pauses the game."
	help(gfx, title, str);
	App.InstCatalog.render(gfx,18,w-glyph_w,56+28*2+x_off,App.COLORS.YELLOW,glyph_w,false,false)
}


App.INFO_PAGES = info;
