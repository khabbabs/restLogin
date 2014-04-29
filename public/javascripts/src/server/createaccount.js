App.setupCreateAccount = function(){
	var create = App.ModeHandler.addNewMode('create account');

		// ---------------------------------------------

	create.gfx = App.Canvases.addNewLayer(2).getContext('2d');
	create.gui = new App.guiFrame(create.gfx);

	var returnFunc = function(){
		create.requestStaticRenderUpdate = true;
		App.ModeHandler.popMode();
		endServerStatus();
	}

	create.cancelButton = new App.GuiTextButton(15,100,200,000,'Cancel', returnFunc,false,null,null);
	create.cancelButton.hoverColor = '#af1010';

	create.createButton = new App.GuiTextButton(15,130,200,000,'Create Account',function(){
		createRequest();
	},false,null,null);
	create.createButton.hoverColor = '#10af10';

	create.username = new App.GuiTextBox(15, 300, 200, 25, "Username", 100, 100, null, null);
	create.password = new App.GuiTextBox(15,330, 200, 25, "Password", 100, 100, null, null);
	create.password.passwordMode = true;
	create.username.next = create.password;

	var endServerStatus = function(){
		for(var b in create.entrybox){
			create.gui.addComponent(create.entrybox[b]);
		}
		create.gui.removeComponent(create.serverstatus);
		create.serverstatus.reset();
		create.password.passwordString = '';
		create.password.txt = create.password.defaultText;
		create.username.txt = create.username.defaultText;
	}

	create.serverstatus = new App.GuiServerStatus(0, 200,returnFunc, endServerStatus);
	create.entrybox = [create.username, create.password, create.createButton, create.cancelButton];


	create.gui.addComponent(create.cancelButton);
	create.gui.addComponent(create.createButton);
	create.gui.addComponent(create.username);
	create.gui.addComponent(create.password);

	var createRequest = function(){
		for(var b in create.entrybox){
			create.gui.removeComponent(create.entrybox[b]);
		}
		create.gui.addComponent(create.serverstatus);

		App.Server.createAccount(create.username.txt, create.password.passwordString, createCallback);
	}



	var createCallback = function(data){
		var success = (data.status.indexOf('created') !== -1);
		var message = data.status;
		create.serverstatus.callback(success, message);
	}

	create.alpha = create.goalAlpha = 0;

		// ---------------------------------------------

	create.enterFunc = function(){
		create.requestStaticRenderUpdate = true;
		create.updatingActive = true;
		create.exitFlag = false;
		create.gui.enter();
		create.goalAlpha = 1;
		create.username.txt = create.username.defaultText;
		create.password.txt = create.password.defaultText;
		create.password.passwordString = '';

		App.Shade.turnOn();
	}

	create.updateFunc = function(){
		if(create.gui.update())
			create.requestStaticRenderUpdate = true;

		if(!create.requestStaticRenderUpdate)return;
		create.requestStaticRenderUpdate = false;

		create.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);

		create.gfx.fillStyle = '#fff';
		text(create.gfx,"Create Account",15,15,36,-3);

		if(create.gui.render())
			create.requestStaticRenderUpdate = true;

		if(create.alpha !== create.goalAlpha){
			create.alpha += expInterp(create.alpha,create.goalAlpha,0.003,0.01);
			create.gfx.globalAlpha = create.alpha;
			create.requestStaticRenderUpdate = true;
		}

		if(create.exitFlag && create.requestStaticRenderUpdate === false){
			create.gfx.clearRect(0,0,App.Canvases.width,App.Canvases.height);
			create.updatingActive = false;
		}
	}

	create.exitFunc = function(){
		create.requestStaticRenderUpdate = true;
		create.exitFlag = true;

		create.gui.exit();
		create.goalAlpha = 0;
	}

	create.registerMouseDownFunc(App.InputHandler.MOUSEBUTTON.LEFT, create.gui.mouseDown);
	create.registerMouseUpFunc(App.InputHandler.MOUSEBUTTON.LEFT, create.gui.mouseUp);

	create.registerKeyDownFunc('Enter', createRequest);
	create.registerKeyDownFunc('Esc', returnFunc);

	create.registerResizeFunc(function(){
		App.GameRenderer.bestFit();
	});
}
