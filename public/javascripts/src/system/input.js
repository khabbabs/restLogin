App.makeInputHandler = function(){
	var input = {};

	input.MOUSEBUTTON = {LEFT:0,MIDDLE:1,RIGHT:2};

	input.canvas   = App.Canvases.addNewLayer(100);
	input.context  = input.canvas.getContext('2d');

	input.keysDown = [];
	input.mouseX   = -1;
	input.mouseY   = -1;
	input.lmb      = false;
	input.mmb      = false;
	input.rmb      = false;


	//when set to a non-null value, key presses are sent to the keyOverride function
	input.keyOverride = null;
	input.currentKey = null; //used for keyoverride

	input.seizeKeys = function(obj){
		input.keyOverride = obj;
	}

	input.releaseKeys = function(){
		input.keyOverride = null;
	}

	// ========================================================== //

	document.addEventListener('keydown',function(e){
		input.keysDown[e.keyCode] = true;

		if(e.keyCode === 8 || e.keyCode === 9) //backspace or tab
				e.preventDefault();

		if(input.keyOverride !== null)
		{
			input.currentKey = e.keyCode;
			input.keyOverride(e.keyCode);

			return;
		}
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.keyDownFuncs[e.keyCode];
		if(f)f();
	},false);

	document.addEventListener('keyup',function(e){
		input.keysDown[e.keyCode] = undefined;
		if(input.keyOverride !== null)
		{
			input.currentKey = null;
			return;
		}
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.keyUpFuncs[e.keyCode];
		if(f)f();
	},false);

	// ========================================================== //

	input.canvas.addEventListener('mousedown',function(e){
		switch(e.button){
			case input.MOUSEBUTTON.LEFT:   input.lmb = true;break;
			case input.MOUSEBUTTON.MIDDLE: input.mmb = true;break;
			case input.MOUSEBUTTON.RIGHT:  input.rmb = true;break;
		}

		input.mouseX = e.clientX;
		input.mouseY = e.clientY;
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.mouseDownFuncs[e.button];
		if(f)f(input.mouseX,input.mouseY);
	},false);

	input.canvas.addEventListener('mousemove',function(e){
		input.mouseX = e.clientX;
		input.mouseY = e.clientY;
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.mouseMoveFunc;
		if(f)f(input.mouseX,input.mouseY);
	},false);

	input.canvas.addEventListener('mouseup',function(e){
		switch(e.button){
			case input.MOUSEBUTTON.LEFT:   input.lmb = false;break;
			case input.MOUSEBUTTON.MIDDLE: input.mmb = false;break;
			case input.MOUSEBUTTON.RIGHT:  input.rmb = false;break;
		}

		input.mouseX = e.clientX;
		input.mouseY = e.clientY;
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.mouseUpFuncs[e.button];
		if(f)f(input.mouseX,input.mouseY);
	},false);

	input.canvas.addEventListener('mouseout',function(e){
		var mode = App.ModeHandler.currentMode;
		if(mode){
			for(var i in mode.keysDown)if(mode.keysDown[i]){
				var f = mode.keyUpFuncs[i];
				if(f)f();
			}

			for(var i in input.MOUSEBUTTON){
				var f = mode.mouseUpFuncs[input.MOUSEBUTTON[i]];
				if(f)f(-1,-1);
			}
		}

		input.keysDown = [];
		input.lmb = input.mmb = input.rmb = false;
	},false);

	var touchEvtFunc = function(e){
		var touches = e.changedTouches,
		first = touches[0],
		type = "";
		switch(e.type) {
	    case "touchstart":type = "mousedown"; break;
			case "touchmove":type = "mousemove"; break;
			case "touchend": type = "mouseup"; break;
			case "touchcancel": type = "mouseup"; break;
			default: return;
	   }
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(type, true, true, window, 1,
								first.screenX, first.screenY,
								first.clientX, first.clientY, false,
								false, false, false, 0, null);
		first.target.dispatchEvent(simulatedEvent);
		e.preventDefault();
	}
	input.canvas.addEventListener("touchstart", touchEvtFunc, true);
	input.canvas.addEventListener("touchmove", touchEvtFunc, true);
	input.canvas.addEventListener("touchend", touchEvtFunc, true);
	input.canvas.addEventListener("touchcancel", touchEvtFunc, true);

	var wheelEvtFunc = function(e){
		var event = window.event || e;
		var delta = event.detail?event.detail*-1:event.wheelDelta;
		var mode = App.ModeHandler.currentMode;
		if(!mode)return;
		var f = mode.mouseWheelFunc;
		if(f)f(delta<0?-1:1);
	}

	input.canvas.addEventListener('mousewheel',wheelEvtFunc,false);
	input.canvas.addEventListener('DOMMouseScroll',wheelEvtFunc,false);

	// ========================================================== //

	input.canvas.oncontextmenu = function(){return false;};

	// ========================================================== //

	input.keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,
		"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,
		"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,
		"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,
		"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,
		"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,
		"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,
		"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,
		";":186,"=":187,",":188,"-":189,".":190,
		"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};

	input.keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",
		17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",
		32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",
		37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",
		48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",
		57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",
		73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",
		82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",
		186:";",187:"=",188:",",189:"-",190:".",
		191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};


	input.alphaNumeric = function(key){
		return ((key >= 48 && key <= 90) || (key >= 96 && key <= 111) || (key >= 186));
	}

	input.checkKey = function(str){
		return !!this.keysDown[this.keyCharToCode[str]];
	}

	return input;
}
