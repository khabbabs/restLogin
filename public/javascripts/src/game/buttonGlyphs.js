App.LowSpeedGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(4*s/10,3*s/10);
	gfx.lineTo(6*s/10,5*s/10);
	gfx.lineTo(4*s/10,7*s/10);
	gfx.stroke();
}

App.MedSpeedGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(3*s/10,3*s/10);
	gfx.lineTo(5*s/10,5*s/10);
	gfx.lineTo(3*s/10,7*s/10);
	gfx.moveTo(5*s/10,3*s/10);
	gfx.lineTo(7*s/10,5*s/10);
	gfx.lineTo(5*s/10,7*s/10);
	gfx.stroke();
}

App.HiSpeedGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(2*s/10,3*s/10);
	gfx.lineTo(4*s/10,5*s/10);
	gfx.lineTo(2*s/10,7*s/10);
	gfx.moveTo(4*s/10,3*s/10);
	gfx.lineTo(6*s/10,5*s/10);
	gfx.lineTo(4*s/10,7*s/10);
	gfx.moveTo(6*s/10,3*s/10);
	gfx.lineTo(8*s/10,5*s/10);
	gfx.lineTo(6*s/10,7*s/10);
	gfx.stroke();
}

App.MaxSpeedGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(2*s/10,3*s/10);
	gfx.lineTo(4*s/10,5*s/10);
	gfx.lineTo(2*s/10,7*s/10);
	gfx.lineTo(6*s/10,7*s/10);
	gfx.lineTo(8*s/10,5*s/10);
	gfx.lineTo(6*s/10,3*s/10);
	gfx.lineTo(2*s/10,3*s/10);
	gfx.stroke();
	gfx.fill();
}

App.StopGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(  s/3,  s/3);
	gfx.lineTo(2*s/3,  s/3);
	gfx.lineTo(2*s/3,2*s/3);
	gfx.lineTo(  s/3,2*s/3);
	gfx.lineTo(  s/3,  s/3);
	gfx.stroke();
	gfx.fill();
}

App.PauseGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(3*s/5,  s/3);
	gfx.lineTo(3*s/5,2*s/3);
	gfx.moveTo(2*s/5,  s/3);
	gfx.lineTo(2*s/5,2*s/3);
	gfx.stroke();
}

App.UndoGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(s/4,s/4);
	gfx.arc(s/2,s/2,s/4,-Math.PI,Math.PI/2);
	gfx.stroke();
}

App.RedoGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.arc(s/2,s/2,s/4,Math.PI/2,0);
	gfx.lineTo(3*s/4,s/4);
	gfx.stroke();
}

App.NewGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(3*s/11,2*s/11);
	gfx.lineTo(3*s/11,9*s/11);
	gfx.lineTo(8*s/11,9*s/11);
	gfx.lineTo(8*s/11,4*s/11);
	gfx.lineTo(6*s/11,2*s/11);
	gfx.lineTo(3*s/11,2*s/11);
	gfx.moveTo(6*s/11,2*s/11);
	gfx.lineTo(6*s/11,4*s/11);
	gfx.lineTo(8*s/11,4*s/11);
	gfx.stroke();
}

App.SaveGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(2*s/11,2*s/11);
	gfx.lineTo(2*s/11,9*s/11);
	gfx.lineTo(9*s/11,9*s/11);
	gfx.lineTo(9*s/11,2*s/11);
	gfx.lineTo(2*s/11,2*s/11);
	gfx.moveTo( 7*s/22,2*s/11);
	gfx.lineTo( 7*s/22,5*s/11);
	gfx.lineTo(15*s/22,5*s/11);
	gfx.lineTo(15*s/22,2*s/11);
	gfx.moveTo( 13*s/22,2*s/11);
	gfx.lineTo( 13*s/22,5*s/11);
	gfx.stroke();
}

App.PropertiesGlyph = function(gfx,s){}

App.BackGlyph = function(gfx,s){
	gfx.beginPath();
	gfx.moveTo(8*s/11,3*s/11);
	gfx.lineTo(8*s/11,8*s/11);
	gfx.lineTo(3*s/11,8*s/11);
	gfx.lineTo(5*s/11,6*s/11);
	gfx.lineTo(5*s/11,7*s/11);
	gfx.stroke();
}
