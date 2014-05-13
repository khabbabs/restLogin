App.Server = {};
App.Server.url = "http://serene-peak-9931.herokuapp.com/";
App.Server.getLevels = function(type, subtype, callback){
	if(!(type && subtype && callback)){
		console.error('must fully specify all arguments to getLevels!')
		return;
	}
	var u = this.url + "api/levels/" + type + "/" + subtype;
	$.getJSON(u, callback);
}

App.Server.testGetCallback = function(json){
	console.log(json);
}

App.Server.testBreakdown = function(json){
	for(var o in json){
		for(var i in json[o]){
			console.log(i + ": " + json[o][i]);
		}
	}
}

App.Server.putLevel = function(levelstr, username, password,difficulty, title, description, callback){
	var u = App.Server.url + "api/postLevel";
	if(!(username && levelstr && password && difficulty && title && difficulty && description && callback) || (title === 'Level Name') || (description === 'Level Description')){
		callback({status:"Do not leave any fields blank!"});
		return;
	}
	//test level to make sure it's valid!
	if(!App.Game.parseLevel(levelstr)){
		callback({status:"Level format incorrect!"});
		return;
	}
	var data = {"username":username,"password":password,"title":title,"description":description,"difficulty":difficulty,"level_str":levelstr }
	$.post( u, data, callback);
}

App.Server.testPostCallback = function(dat){
	console.log(dat);
}

App.Server.createAccount = function(username, password, callback){
	var u = App.Server.url + "api/postsignup";
	if(!(username && password && callback)){
		callback({status:"Do not leave any fields blank!"});
		return;
	}var data = {"username":username, "password":password};
	$.post(u, data, callback);
}

App.Server.getScore = function(levelID, callback){
	var u = App.Server.url + "api/levels/getScore/" + levelID;
	if(!(levelID && callback)){
		callback({status:"Callback and ID required!"});
		return;
	}
	$.getJSON(u, callback);
}

App.Server.postScore = function(levelID, name, autoCount, instCount, cellCount, tickCount, callback){
	var u = App.Server.url + "api/levels/upDateScore/" + levelID;
	if(!(levelID && name && callback)){
		callback({status:"data not defined"});
		return;
	}
	var dat = {"name":name, "autoCount":autoCount, "instruCount":instCount, "cellCount":cellCount, "tickCount":tickCount};
	$.ajax({
   url: u,
   type: 'PUT',
   data:dat,
   success: callback
	});
}

App.Server.updatePlayCount = function(levelID, callback){
	var u = App.Server.url + 'api/levels/updatePlayCount/' + levelID;
	$.ajax({
   url: u,
   type: 'PUT',
   success: callback
	});
}