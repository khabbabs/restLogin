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
	for(var x in json){
		console.log(json[x]);
	}
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
	if(!(username && levelstr && password && difficulty && title && difficulty && description && callback))
	{
		console.error('must fully specify all arguments to putLevel!');
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
	if(!(username && password && callback))
	{
		console.error('must fully specify all arguments to createAccount!');
		return;
	}
	var data = {"username":username, "password":password};
	$.post(u, data, callback);
}

