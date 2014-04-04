// deals with all keyboard, mouse, and window input
// In general, use the specific GUI and Game input redirects where possible.

App.makeInputHandler = function(){
	var input = {};

	input.context = App.Canvases.addNewLayer('inputCanvas', 10); // TODO: z value for this should be the largest...
	input.canvas = App.Canvases.layers['inputCanvas'];

	//Redirect objects
	input.Gui = App.makeGuiInput();
	input.Game = App.makeGameInput();

	//Keyboard callback data
	input.keyRegistry = [];
	for(var m in App.MODES){
		input.keyRegistry[App.MODES[m]] = [];
	}
	input.keysDown = [];

	//current mouse information -- feel free to use, but don't modify elsewhere!
	input.mouseData = {
		x:0,
		y:0,
		lmb:false,
		rmb:false,
		mmb:false,
		wheel:0
	}

	//remembers whether or not a click was initiated inside the GUI layer
	input.guiControlsMouse = false;

	//whether or not to include touch controls (could be a setting)
	input.includeTouchHandler = true;

	//freezes all input except key input. Used for text entry - probably nothing more
	input.hijackedInput = null;


	//Use with trepidation. Should only call callback with keys,
	//and only after releasing them (after a full click)
	input.hijackInput = function(callback){
		this.hijackedInput = callback;
		console.debug("HIJACKED INPUT. BE CAREFUL");
	}

	//Make SURE you call this at some point if you call the function above.
	//Otherwise no input ever. :(
	input.deHijackInput = function(){
		this.hijackedInput = null;
		console.debug("UNHIJACKED INPUT, SAFE TO GO!");
	}


	//Registers a callback to be fired when a key is pressed - can only
	//bind ONE callback to a key at a time.
	input.registerKey = function(key, mode, callback){
		if(!this.keyRegistry[mode][key])
			this.keyRegistry[mode][key] = callback;
		else
			console.error("Tried to assign multiple functions to a single keypress!!!: " + key + " , " + callback);
	}

	/////////
	//Section evt handlers
	/////////

	//Deals with the mouse being moved
	var handle_mouseMove 	= function(e){
		if(input.hijackedInput){
			return;
		}
		if(e.currentTarget === null) return;

		var rect = e.currentTarget.getBoundingClientRect();

		input.mouseData.x = e.clientX - rect.left;
		input.mouseData.y = e.clientY - rect.top;
		if(input.guiControlsMouse)
			input.Gui.mouseMove(input.mouseData);
		else
			input.Game.mouseMove(input.mouseData);
	}

	//Handles mouse buttons being clicked or released
	var handle_mouseButton = function(e){
		if(input.hijackedInput){
			return;
		}

		var down = (e.type === 'mousedown');
		if(down){
			setbutton(e.button, down);
			if(input.Gui.mouseDown(input.mouseData))
				input.guiControlsMouse = true;
			else
				input.Game.mouseDown(input.mouseData);

		}
		else{
			if(input.guiControlsMouse)
				input.Gui.mouseUp(input.mouseData);
			else
				input.Game.mouseUp(input.mouseData);

			input.guiControlsMouse = false;

			setbutton(e.button, down);
		}

	}

	var setbutton = function(b, d){
		switch (b){
				case 0:
					input.mouseData.lmb = d;
					break;
				case 1:
					input.mouseData.mmb = d;
					break;
				case 2:
					input.mouseData.rmb = d;
					break;
			}
	}

	//Deals with the wheel being scrolled
	var handle_mouseWheel 	= function(e){
		if(input.hijackedInput){
			return;
		}
		var evt = window.event || e;
		var delta = evt.detail? evt.detail*(-1) : evt.wheelDelta;

		input.mouseData.wheel = (delta < 0) ? -1 : 1;

		if(!input.guiControlsMouse)
			input.Game.mouseWheel(input.mouseData);

		input.mouseData.wheel = 0;
	}

	//Deals with a key being depressed
	var handle_keyDown 		= function(e){
		var key = input.keyCodeToChar[e.keyCode];
		if(input.hijackedInput){
			if(key === 'Backspace')
				e.preventDefault();
			input.hijackedInput(key, e.shiftKey);
			return;
		}

		if(input.keysDown[key])
			return;

		input.keysDown[key] = true;

		if(input.keyRegistry[App.MODE][key]) input.keyRegistry[App.MODE][key]();
	}

	//Deals with a key being released
	var handle_keyUp 		= function(e){
		var key = input.keyCodeToChar[e.keyCode];
		if(input.hijackedInput){
			return;
		}

		if(input.keysDown[key])
			input.keysDown[key] = false;
	}

	//Deals with the mouse being moved outside the canvas.
	var handle_mouseOut 	= function(e){
		input.mouseData.lmb = input.mouseData.mmb = input.mouseData.rmb = false;
		handle_mouseButton(e);
	}

	//No pinch/pull zooming :( I tried. Believe me, I tried.
	//thus, only handles for a "left mouse button" finger, single-touch
	//NOTE: Pen/stylus input gets registered as mouse clicks anyway.
	var handle_touchInput = function(e){
		var touch = e.changedTouches[0];

		//console.log(touch);
		if(touch.identifier > 0)
			return;

		input.mouseData.x = touch.pageX;
		input.mouseData.y = touch.pageY;

		switch(e.type)
	    {
	    case "touchstart":
			handle_mouseButton({type:'mousedown',button:0});
			break;
		case "touchmove":
			handle_mouseMove({clientX:touch.pageX, clientY:touch.pageY, currentTarget:input.canvas});
			break;
		default: //also does touchend
			handle_mouseButton({type:'mouseup',button:0});
			return;
	    }
	    e.preventDefault();
	}

	// registering callbacks
	input.canvas.addEventListener('mousemove', handle_mouseMove, false);
	input.canvas.addEventListener('mouseup', handle_mouseButton, false);
	input.canvas.addEventListener('mousedown', handle_mouseButton, false);
	input.canvas.addEventListener('mouseout', handle_mouseOut, false);
	input.canvas.addEventListener('mousewheel', handle_mouseWheel, false);
	input.canvas.addEventListener('DOMMouseScroll', handle_mouseWheel, false);

	//key strokes have to be captured in the document, not the canvas.
	document.addEventListener('keyup', handle_keyUp, false);
	document.addEventListener('keydown', handle_keyDown, false);

	// disables context menu on right mouse
	input.canvas.oncontextmenu = function(){ return false; };

	// We could either add the touch as an option in settings,
	// Or auto-enable it if a touchscreen is detected.
	if(input.includeTouchHandler){
		input.canvas.addEventListener("touchstart", handle_touchInput, true);
		input.canvas.addEventListener("touchmove", handle_touchInput, true);
		input.canvas.addEventListener("touchend", handle_touchInput, true);
		input.canvas.addEventListener("touchcancel", handle_touchInput, true);
	}

	//Big Ugly Reference. I put it at the bottom to save eyes and brains!
	input.keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
	input.keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};

	return input;
}
